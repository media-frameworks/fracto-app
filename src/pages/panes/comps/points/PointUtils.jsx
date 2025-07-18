import {
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT
} from "settings/AppSettings";
import FractoFastCalc from "fracto/FractoFastCalc";

export const KEY_CONNECT_DOTS = 'connect_dots'

const get_fracto_values = (page_settings) => {
   let click_point = page_settings[KEY_HOVER_POINT]
   if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
      click_point = page_settings[KEY_FOCAL_POINT]
   }
   if (click_point) {
      return FractoFastCalc.calc(click_point.x, click_point.y)
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
   const Q_core_pos = FractoFastCalc.calculate_cardioid_Q(click_point.x, click_point.y, 1)
   let cycles = 0
   if (fracto_values.orbital_points) {
      cycles = get_cycles(fracto_values.orbital_points, Q_core_neg)
   }
   let orbital_points = fracto_values.orbital_points
   let magnitude = 0
   let interpolation = []
   if (!fracto_values.pattern) {
      orbital_points = get_escape_points(click_point)
   } else {
      magnitude = get_magnitude(orbital_points, Q_core_neg)
      interpolation = interpolate_orbital(orbital_points, Q_core_neg)
   }
   return {
      click_point,
      pattern: fracto_values.pattern,
      orbital_points,
      in_cardioid,
      Q_core_neg,
      Q_core_pos,
      iteration: fracto_values.iteration,
      cycles,
      magnitude,
      interpolation,
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

export const process_theta_set = (point_set, center) => {
   if (!point_set) {
      return []
   }
   let current_theta = 0
   return point_set.map((point, i) => {
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

export const interpolate_orbital = (point_set, center) => {
   const result = []
   const best_increment_rad = 2 * Math.PI / 100
   point_set.forEach((point, i) => {
      const previous_index = (i + point_set.length - 1) % point_set.length
      const point_1_diff_x = center.x - point_set[previous_index].x
      const point_1_diff_y = center.y - point_set[previous_index].y
      const angle_1 = Math.atan2(point_1_diff_y, point_1_diff_x)
      const point_1_magnitude = Math.sqrt(
         point_1_diff_x * point_1_diff_x + point_1_diff_y * point_1_diff_y)

      const point_2_diff_x = center.x - point_set[i].x
      const point_2_diff_y = center.y - point_set[i].y
      let angle_2 = Math.atan2(point_2_diff_y, point_2_diff_x)
      while (angle_2 < angle_1) {
         angle_2 += 2 * Math.PI
      }
      const point_2_magnitude = Math.sqrt(
         point_2_diff_x * point_2_diff_x + point_2_diff_y * point_2_diff_y)

      const theta = angle_2 - angle_1
      const increment_count = 1 + Math.floor(theta / best_increment_rad)
      const increment_rad = theta / increment_count
      const increment_magnitude = (point_2_magnitude - point_1_magnitude) / increment_count
      for (let step = 1; step <= increment_count; step++) {
         const magnitude = point_1_magnitude + increment_magnitude * step
         const angle = angle_1 + increment_rad * step
         result.push({
            x: -magnitude * Math.cos(angle) + center.x,
            y: -magnitude * Math.sin(angle) + center.y,
         })
      }
   })
   return result
}