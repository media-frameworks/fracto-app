import {polynomialRoot, complex} from 'mathjs'

import {
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT
} from "settings/AppSettings";
import FractoFastCalc from "fracto/FractoFastCalc";
import Complex from "common/math/Complex";
import {Scatter} from "react-chartjs-2";
import React from "react";

const EPSILON = 0.0001
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

const get_fracto_values = (page_settings) => {
   let click_point = page_settings[KEY_HOVER_POINT]
   if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
      click_point = page_settings[KEY_FOCAL_POINT]
   }
   if (click_point) {
      const start = performance.now()
      const fracto_values = FractoFastCalc.calc(click_point.x, click_point.y)
      const end = performance.now()
      return {elapsed_ms: end - start, ...fracto_values}
   } else {
      return {x: 0, y: 0}
   }
}

export const get_cycles = (point_set, center) => {
   let current_theta = -1
   let first_theta = 0
   point_set.forEach((point, i) => {
      const diff_x = point.x - center.x
      const diff_y = point.y - center.y
      let theta = Math.atan2(diff_y, diff_x)
      while (theta < current_theta) {
         theta += Math.PI * 2
      }
      if (current_theta === -1) {
         first_theta = theta
      }
      current_theta = theta
   })
   return Math.round((current_theta - first_theta) / (2 * Math.PI))
}

export const check_z = (z, P) => {
   const z_squared = z.mul(z)
   const z_squared_plus_P = z_squared.add(P)
   const z_times_z_squared_plus_P = z.mul(z_squared_plus_P)
   const should_be_zero = z_times_z_squared_plus_P.offset(-P.re, -P.im)
   const magnitude = should_be_zero.magnitude()
   console.log('check_z should be zero', magnitude)
}

export const calculate_zs = (click_point) => {
   const z_roots = polynomialRoot(
      complex(-click_point.x, -click_point.y),
      complex(click_point.x, click_point.y),
      0, complex(1, 0))
   // console.log('z_roots', z_roots)
   return {
      z_0: new Complex(z_roots[0].re, z_roots[0].im),
      z_1: new Complex(z_roots[1].re, z_roots[1].im),
      z_2: new Complex(z_roots[2].re, z_roots[2].im),
   }
}

const find_best_cardinality = (click_point, all_zs) => {
   const discovery_z0 = discover_cardinality(click_point, all_zs.z_0)
   const cardinality_z0 = discovery_z0.best_cardinality
   const magnitude_z0 = discovery_z0.best_magnitude
   const discovery_z1 = discover_cardinality(click_point, all_zs.z_1)
   const cardinality_z1 = discovery_z1.best_cardinality
   const magnitude_z1 = discovery_z1.best_magnitude
   const discovery_z2 = discover_cardinality(click_point, all_zs.z_2)
   const cardinality_z2 = discovery_z2.best_cardinality
   const magnitude_z2 = discovery_z2.best_magnitude
   if (magnitude_z0 < magnitude_z1 && magnitude_z0 < magnitude_z2) {
      console.log('discovery_z0', discovery_z0)
      return [cardinality_z0, magnitude_z0]
   }
   if (magnitude_z1 < magnitude_z2 && magnitude_z1 < magnitude_z0) {
      console.log('discovery_z1', discovery_z1)
      return [cardinality_z1, magnitude_z1]
   }
   console.log('discovery_z2', discovery_z2)
   return [cardinality_z2, magnitude_z2]
}

export const get_click_point_info = (page_settings) => {
   let click_point = page_settings[KEY_HOVER_POINT]
   if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
      click_point = page_settings[KEY_FOCAL_POINT]
   }
   if (!click_point) {
      return null
   }
   const fracto_values = get_fracto_values(page_settings)
   const in_cardioid = FractoFastCalc.point_in_main_cardioid(click_point.x, click_point.y)
   const Q_core_neg = FractoFastCalc.calculate_cardioid_Q(click_point.x, click_point.y, -1)
   let cycles = 0
   if (fracto_values.orbital_points) {
      cycles = get_cycles(fracto_values.orbital_points, Q_core_neg)
   }
   let orbital_points = fracto_values.orbital_points
   let best_magnitude = 0
   let best_cardinality = 0
   let elapsed_new = 0
   let all_zs = {}
   if (!fracto_values.pattern) {
      orbital_points = get_escape_points(click_point)
   } else {
      if (in_cardioid) {
         const start = performance.now()
         all_zs = calculate_zs(click_point)
         const results = find_best_cardinality(click_point, all_zs)
         const finish = performance.now()
         elapsed_new = finish - start
         best_cardinality = results[0]
         best_magnitude = results[1]
      }
   }
   return {
      click_point,
      pattern: fracto_values.pattern,
      elapsed_ms: fracto_values.elapsed_ms,
      orbital_points,
      in_cardioid,
      Q_core_neg,
      iteration: fracto_values.iteration,
      cycles,
      all_zs,
      cardinality: best_cardinality,
      magnitude: best_magnitude,
      elapsed_new,
   }
}

export const process_orbital_sets = (point_set, center) => {
   if (!point_set) {
      return []
   }
   const r_set = point_set.map((point, i) => {
      const diff_x = point.x - center.x
      const diff_y = point.y - center.y
      return {
         x: i + 1,
         y: Math.sqrt(diff_x * diff_x + diff_y * diff_y),
      }
   })
   let current_theta = 0
   const theta_set = point_set.map((point, i) => {
      const diff_x = point.x - center.x
      const diff_y = point.y - center.y
      let theta = Math.atan2(diff_y, diff_x)
      while (theta < current_theta) {
         theta += Math.PI * 2
      }
      current_theta = theta
      return {
         x: i + 1,
         y: theta,
      }
   })
   return {r_set, theta_set}
}

export const process_escape_sets = (p, center) => {
   const P_x = p.re || p.x
   const P_y = p.im || p.y
   let Q_x_squared = 0
   let Q_y_squared = 0
   let Q_x = 0
   let Q_y = 0
   let iteration = 1
   const all_r_values = []
   const all_theta_values = []
   all_r_values.push({x: 0, y: 0})
   all_theta_values.push({x: 0, y: 0})
   let current_theta = 0
   for (; iteration < 1000000; iteration++) {
      Q_y = 2 * Q_x * Q_y + P_y;
      Q_x = Q_x_squared - Q_y_squared + P_x;
      Q_x_squared = Q_x * Q_x
      Q_y_squared = Q_y * Q_y
      if (Q_x_squared + Q_y_squared > 4) {
         break;
      }
      const diff_x = Q_x - center.x
      const diff_y = Q_y - center.y
      const magnitude = Math.sqrt(diff_x * diff_x + diff_y * diff_y)
      all_r_values.push({x: iteration, y: magnitude})
      let theta = Math.atan2(diff_y, diff_x)
      while (theta < current_theta) {
         theta += Math.PI * 2
      }
      all_theta_values.push({x: iteration, y: theta})
   }
   return {
      r_set: all_r_values,
      theta_set: all_theta_values,
   }
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

export const get_magnitude = (point_set, center) => {
   if (!point_set) {
      return []
   }
   let max_radius = 0
   point_set.forEach((point, i) => {
      const diff_x = point.x - center.x
      const diff_y = point.y - center.y
      const magnitude = Math.sqrt(diff_x * diff_x + diff_y * diff_y)
      if (max_radius < magnitude) {
         max_radius = magnitude
      }
   })
   return 2 * max_radius
}

export const round_places = (x, digits) => {
   const factor = Math.pow(10, digits)
   return Math.round(x * factor) / factor
}

export const discover_cardinality = (p, q) => {
   const P = new Complex(p.re || p.x, p.im || p.y)
   const first_Q = new Complex(q.re || q.x, q.im || q.y)
   // console.log('discover_cardinality P, Q', P.toString(),Q.toString())
   let Q = first_Q.scale(1)
   let Q_squared = Q.mul(Q)
   let best_magnitude = 1000
   let best_cardinality = 0
   for (let cardinality = 1; cardinality <= 10000; cardinality++) {
      const next_Q = Q_squared.add(P)
      const diff_Qs = new Complex(
         first_Q.re - next_Q.re,
         first_Q.im - next_Q.im
      )
      const test_magnitude = diff_Qs.magnitude()
      if (test_magnitude < best_magnitude) {
         best_magnitude = test_magnitude
         best_cardinality = cardinality
         if (test_magnitude === 0) {
            console.log('discover_cardinality exact result')
            return {best_cardinality, best_magnitude}
         }
      }
      Q = next_Q.scale(1)
      Q_squared = Q.mul(Q)
      if (!Q_squared.is_valid()) {
         return {best_cardinality: 0, best_magnitude: 1000}
      }
   }
   console.log('discover_cardinality best_magnitude, best_cardinality',
      best_magnitude, best_cardinality)
   return {best_cardinality, best_magnitude}
}

export const step_ratio_chart = (point_set) => {
   const options = {
      scales: {
         x: {
            grid: GRID_CONFIG,
            ticks: {display: false},
         },
         y: {
            grid: GRID_CONFIG,
            ticks: {display: false},
         },
      },
      animation: false,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            display: false,
         },
      },
   }
   let min_y = 1000
   let max_y = 0

   const set1 = []
   const set2 = []
   point_set.forEach((point, i) => {
      const re = point.x
      const im = point.y
      if (im < min_y) {
         min_y = im
      }
      if (im > max_y) {
         max_y = im
      }
      if (re < min_y) {
         min_y = re
      }
      if (re > max_y) {
         max_y = re
      }
      set1.push({x: i, y: re})
      set2.push({x: i, y: im})
   })
   const delta_y = max_y - min_y
   min_y -= delta_y * 0.15
   max_y += delta_y * 0.15
   options.scales.y.min = min_y
   options.scales.y.max = max_y

   const data_dataset = {
      datasets: [
         {
            Id: 1,
            label: `re`,
            data: JSON.parse(JSON.stringify(set1)),
            backgroundColor: 'green',
            borderColor: 'lightgrey',
            showLine: true
         },
         // {
         //    Id: 1,
         //    label: `im`,
         //    data: JSON.parse(JSON.stringify(set2)),
         //    backgroundColor: 'blue',
         //    borderColor: 'lightgrey',
         //    showLine: true
         // },
      ]
   }
   try {
      // console.log('data_dataset', data_dataset)
      return <Scatter
         datasetIdKey='id1'
         data={data_dataset} options={options}
      />
   } catch (e) {
      debugger;
      return [e.message]
   }
}
