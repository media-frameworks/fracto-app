import {
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT
} from "settings/AppSettings";
import FractoFastCalc from "fracto/FractoFastCalc";

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
   return {
      click_point,
      pattern: fracto_values.pattern,
      orbital_points: fracto_values.orbital_points,
      in_cardioid,
      Q_core_neg,
      Q_core_pos,
      iteration: fracto_values.iteration,
   }
}

export const process_orbital_sets = (point_set, center) => {
   if (!point_set) {
      return []
   }
   const r_set = point_set.map((point, i) => {
      const diff_x = point.x - center.x
      const diff_y = point.y - center.y
      console.log(point.x, point.y)
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