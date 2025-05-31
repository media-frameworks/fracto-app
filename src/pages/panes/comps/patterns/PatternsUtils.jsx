import React from "react";
import {Scatter} from "react-chartjs-2";

import Complex from "common/math/Complex";
import FractoUtil from "fracto/FractoUtil";

const GRID_CONFIG = {
   color: function (context) {
      return context.tick.value === 0 ? '#aaaaaa' : '#dddddd'
   },
   lineWidth: function (context) {
      return context.tick.value === 0 ? 1.5 : 1
   }
};

export const calculate_cardioid_Q = (x, y, scalar = 1) => {
   const P = new Complex(x, y)
   const negative_four_P = P.scale(-4.0)
   const under_radocal = negative_four_P.offset(1, 0)
   const radical = under_radocal.sqrt().scale(scalar)
   const result = radical.offset(1.0, 0).scale(0.5)
   return {x: result.re, y: result.im}
}

export const click_point_chart = (set1, set2, in_cardioid = false, escaper = false) => {
   const options = {
      scales: {
         x: {grid: GRID_CONFIG,},
         y: {grid: GRID_CONFIG,}
      },
      animation: false,
      maintainAspectRatio: false,
   }
   if (!in_cardioid) {
      options.scales.x.min = -1.5
      options.scales.x.max = 1
      options.scales.y.min = -1.25
      options.scales.y.max = 1.25
   }
   const cardinality = set1?.length - 1 || 0
   const set1_label = escaper
      ? `escapes in ${cardinality || '?'} steps`
      : `${cardinality || '?'} point${in_cardioid ? 's in cardiod' : ' orbital'}`
   const data_dataset = {
      datasets: [
         {
            Id: 1,
            label: set1_label,
            data: set1,
            backgroundColor: FractoUtil.fracto_pattern_color(cardinality || 0),
            showLine: true
         },
         {
            Id: 2,
            label: in_cardioid ? 'Q' : 'Q',
            data: set2,
            backgroundColor: 'black',
            showLine: false
         },
      ]
   }
   return <Scatter
      datasetIdKey='id1'
      data={data_dataset} options={options}
   />
}

export const iteration_chart = (set1, set2) => {
   const options = {
      scales: {
         x: {
            grid: GRID_CONFIG,
            ticks: {
               stepSize: 2 * Math.PI,
            },
         },
         y: {grid: GRID_CONFIG,},
      },
      animation: false,
      maintainAspectRatio: false,
   }
   options.scales.y.min = 0
   options.scales.x.min = set1[0].x
   // options.scales.x.max = set1[set1.length - 1].x
   const cardinality = set1?.length - 1 || 0
   const data_dataset = {
      datasets: [
         {
            Id: 1,
            label: `r (${cardinality})`,
            data: set1,
            backgroundColor: FractoUtil.fracto_pattern_color(cardinality),
            showLine: true
         }
      ]
   }
   return <Scatter
      datasetIdKey='id1'
      data={data_dataset} options={options}
   />
}

const get_escape_points = (click_point) => {
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

export const escape_points_chart = (click_point) => {
   const escape_points = get_escape_points(click_point)
   const Q_core_neg = calculate_cardioid_Q(click_point.x, click_point.y, -1)
   return click_point_chart(escape_points, [Q_core_neg], false, true)
}

export const r_theta_chart = (orbital_points, Q) => {
   if (!orbital_points) {
      return []
   }
   let max_angle = 0
   const r_data = orbital_points.map((p, index) => {
      const point = new Complex(p.x, p.y)
      const difference = point.offset(-Q.x, -Q.y)
      let angle = Math.atan2(difference.im, difference.re)
      while (angle < max_angle - Math.PI) {
         angle += Math.PI * 2
      }
      max_angle = angle
      return {x: angle, y: difference.magnitude()}
   })
   return iteration_chart(r_data, [])
}

export const escape_r_theta_chart = (click_point) => {
   const escape_points = get_escape_points(click_point)
   const Q_core_neg = calculate_cardioid_Q(click_point.x, click_point.y, -1)
   let max_angle = 0
   const r_data = escape_points.map((p, index) => {
      const point = new Complex(p.x, p.y)
      const difference = point.offset(-Q_core_neg.x,-Q_core_neg.y)
      let angle = Math.atan2(difference.im, difference.re)
      while (angle < max_angle - Math.PI) {
         angle += Math.PI * 2
      }
      max_angle = angle
      return {x: angle, y: difference.magnitude()}
   })
   return iteration_chart(r_data, [])
}