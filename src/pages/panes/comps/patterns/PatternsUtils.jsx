import React from "react";
import {Scatter} from "react-chartjs-2";

import Complex from "common/math/Complex";
import FractoUtil from "fracto/FractoUtil";

const EPSILON = 0.0001
const ANIMATION_COLOR = 'red'

const GRID_CONFIG = {
   color: function (context) {
      const pi_grid = context.tick.value / (Math.PI * 2)
      const diff = Math.abs(pi_grid - Math.round(pi_grid))
      if (diff < EPSILON && pi_grid > EPSILON) {
         return '#888888'
      }
      return context.tick.value === 0 ? '#aaaaaa' : '#dddddd'
   },
   lineWidth: function (context) {
      const pi_grid = context.tick.value / (Math.PI * 2)
      const diff = Math.abs(pi_grid - Math.round(pi_grid))
      if (diff < EPSILON && pi_grid > EPSILON) {
         return 1.5
      }
      return context.tick.value === 0 ? 1.5 : 1
   }
};

export const calculate_cardioid_Q = (x, y, scalar = 1) => {
   const P = new Complex(x, y)
   const negative_four_P = P.scale(-4.0)
   const under_radical = negative_four_P.offset(1, 0)
   const radical = under_radical.sqrt().scale(scalar)
   const result = radical.offset(1.0, 0).scale(0.5)
   return {x: result.re, y: result.im}
}

export const click_point_chart = (set1, set2, in_cardioid = false, escaper = false) => {
   if (!set1) {
      return []
   }
   const options = {
      scales: {
         x: {grid: GRID_CONFIG,},
         y: {grid: GRID_CONFIG,}
      },
      animation: false,
      maintainAspectRatio: false,
   }
   if (!in_cardioid && escaper) {
      options.scales.x.min = -1.5
      options.scales.x.max = 1
      options.scales.y.min = -1.25
      options.scales.y.max = 1.25
   }
   const cardinality = set1?.length - 1 || 0
   const set1_label = escaper
      ? `escapes in ${cardinality || '?'} steps`
      : `${cardinality || '?'} point${in_cardioid ? 's in cardiod' : ' orbital'}`
   const in_animation = set2?.length > 1
   const data_dataset = {
      datasets: [
         {
            Id: 2,
            label: in_cardioid ? 'Q' : 'Q',
            data: JSON.parse(JSON.stringify(set2)),
            backgroundColor: in_animation ? ANIMATION_COLOR : 'black',
            pointRadius: in_animation ? 4 : 3,
            borderColor: ANIMATION_COLOR,
            showLine: true
         },
         {
            Id: 1,
            label: set1_label,
            data: JSON.parse(JSON.stringify(set1)),
            backgroundColor: FractoUtil.fracto_pattern_color(cardinality || 0),
            pointRadius: in_animation ? 2 : 3,
            showLine: true
         },
      ]
   }
   return <Scatter
      datasetIdKey='id1'
      data={data_dataset} options={options}
   />
}

export const iteration_chart = (set1, in_cardioid, escaper, animation_index = -1) => {
   const options = {
      scales: {
         x: {
            grid: GRID_CONFIG,
            ticks: {
               stepSize: Math.PI / 2,
            },
         },
         y: {grid: GRID_CONFIG,},
      },
      animation: false,
      maintainAspectRatio: false,
   }
   options.scales.y.min = 0
   const cardinality = set1?.length - 1 || 0
   if (cardinality) {
      options.scales.x.min = set1[0]?.x || 0
      options.scales.x.max = set1[set1.length - 1]?.x || 0
   } else if (escaper) {
      options.scales.y.max = 2.0
   }
   const data_dataset = {datasets: []}
   if (animation_index >= 0 && set1[animation_index]) {
      const set2 = [
         {x:set1[animation_index]?.x || 0, y: 0},
         {x:set1[animation_index]?.x || 0, y: set1[animation_index]?.y || 0},
      ]
      data_dataset.datasets.push(
         {
            Id: 2,
            label: 'theta sweep',
            data: JSON.parse(JSON.stringify(set2)),
            backgroundColor: ANIMATION_COLOR,
            pointRadius: 4,
            borderColor: ANIMATION_COLOR,
            showLine: true
         },
      )
   }
   data_dataset.datasets.push(
      {
         Id: 1,
         label: `r (${cardinality})`,
         data: JSON.parse(JSON.stringify(set1)),
         backgroundColor: FractoUtil.fracto_pattern_color(cardinality),
         borderColor: 'lightgrey',
         showLine: true
      })
   return <Scatter
      datasetIdKey='id1'
      data={data_dataset} options={options}
   />
}

export const get_escape_points = (click_point) => {
   const P_x = click_point.x
   const P_y = click_point.y
   let Q_x_squared = 0
   let Q_y_squared = 0
   let Q_x = 0
   let Q_y = 0
   const escape_points = [{x: 0, y: 0}]
   for (let iteration = 0; iteration < 10000; iteration++) {
      Q_y = 2 * Q_x * Q_y + P_y;
      Q_x = Q_x_squared - Q_y_squared + P_x;
      Q_x_squared = Q_x * Q_x
      Q_y_squared = Q_y * Q_y
      const sum_squares = Q_x_squared + Q_y_squared
      if (sum_squares > 16) {
         break;
      }
      escape_points.push({x: Q_x, y: Q_y})
   }
   return escape_points
}

export const escape_points_chart = (click_point, in_cardioid, animation_index = -1) => {
   const escape_points = get_escape_points(click_point)
   const Q_core_neg = calculate_cardioid_Q(click_point.x, click_point.y, -1)
   const set2 = [Q_core_neg]
   if (animation_index >= 0) {
      set2.push(escape_points[animation_index])
   }
   return click_point_chart(escape_points, set2, in_cardioid, true, animation_index)
}

export const process_r_data = (orbital_points, Q, progress_offset = Math.PI / 4) => {
   if (!orbital_points) {
      return []
   }
   let max_angle = 0
   return orbital_points.map((p, index) => {
      const point = new Complex(p.x, p.y)
      const difference = point.offset(-Q.x, -Q.y)
      let angle = Math.atan2(difference.im, difference.re)
      while (angle < max_angle - progress_offset) {
         angle += Math.PI * 2
      }
      max_angle = angle
      return {x: angle, y: difference.magnitude()}
   })
}

export const r_theta_chart = (orbital_points, Q, in_cardioid, animation_index) => {
   if (!orbital_points) {
      return []
   }
   const r_data = process_r_data(orbital_points, Q)
   return iteration_chart(r_data, in_cardioid, false, animation_index)
}

export const escape_r_theta_chart = (click_point, in_cardioid, animation_index) => {
   const escape_points = get_escape_points(click_point)
   const Q_core_neg = calculate_cardioid_Q(click_point?.x || 0, click_point?.y || 0, -1)
   const r_data = process_r_data(escape_points, Q_core_neg, Math.PI / 2)
   return iteration_chart(r_data, in_cardioid, true, animation_index)
}