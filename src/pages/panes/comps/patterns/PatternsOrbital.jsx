import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import Complex from "common/math/Complex";
import FractoFastCalc from "fracto/FractoFastCalc";
// import {render_pattern_block} from "fracto/styles/FractoStyles";
import {
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
} from "settings/AppSettings";
import {KEY_COMPS_WIDTH_PX} from "settings/PaneSettings";
import CoolTable, {
   CELL_ALIGN_CENTER,
   CELL_ALIGN_LEFT,
   CELL_TYPE_NUMBER,
} from "common/ui/CoolTable";
import {
   calculate_cardioid_Q,
   click_point_chart,
   escape_points_chart,
   escape_r_theta_chart,
   r_theta_chart
} from "./PatternsUtils";

ChartJS.register(CategoryScale, BarController)

const ORBITAL_POINTS_COLUMNS = [
   {
      id: "index",
      label: "#",
      type: CELL_TYPE_NUMBER,
      width_px: 50,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "r",
      label: "r",
      type: CELL_TYPE_NUMBER,
      width_px: 200,
      align: CELL_ALIGN_LEFT
   },
   {
      id: "i",
      label: "i",
      type: CELL_TYPE_NUMBER,
      width_px: 200,
      align: CELL_ALIGN_LEFT
   },
   {
      id: "theta",
      label: "theta",
      type: CELL_TYPE_NUMBER,
      width_px: 200,
      align: CELL_ALIGN_LEFT
   },
]

export class PatternsOrbital extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      orbital_points: [],
      Q_core_neg: null,
   }

   get_fracto_values = (set1, set2) => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      return FractoFastCalc.calc(click_point.x, click_point.y)
   }

   click_point_data = () => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      const fracto_values = this.get_fracto_values()
      const in_cardioid = FractoFastCalc.point_in_main_cardioid(click_point.x, click_point.y)
      const Q_core_neg = calculate_cardioid_Q(click_point.x, click_point.y, -1)
      if (fracto_values.pattern) {
         setTimeout(() => {
            this.setState({orbital_points: fracto_values.orbital_points, Q_core_neg})
         }, 1000)
         return click_point_chart(
            fracto_values.orbital_points,
            [Q_core_neg],
            in_cardioid, false
         )
      }
      return escape_points_chart(click_point)
   }

   r_theta_data = () => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      const fracto_values = this.get_fracto_values()
      const Q_core_neg = calculate_cardioid_Q(click_point.x, click_point.y, -1)
      if (fracto_values.pattern) {
         return r_theta_chart(fracto_values.orbital_points, Q_core_neg)
      }
      return escape_r_theta_chart(click_point)
   }

   render_info = () => {
      const {page_settings} = this.props
      const fracto_values = this.get_fracto_values()
      const current_pattern = (fracto_values.orbital_points?.length || 1) - 1
      if (current_pattern) {
         let click_point = page_settings[KEY_HOVER_POINT]
         if (!click_point) {
            click_point = page_settings[KEY_FOCAL_POINT]
         }
         const c = new Complex(click_point.x, click_point.y)
         const neg_c = c.scale(-1)
         let z = new Complex(0, 0)
         for (let i = 0; i < current_pattern + 10; i++) {
            z = z.add(neg_c)
            // console.log('z', z.toString())
            z = z.sqrt()
         }
         console.log('fracto_values.orbital_points', fracto_values.orbital_points)
         return <styles.InfoBlockWrapper>
         </styles.InfoBlockWrapper>
      }
      return <styles.InfoPrompt>
         {'Hover or click to show orbital points'}
      </styles.InfoPrompt>
   }

   click_point_table = () => {
      const {orbital_points, Q_core_neg} = this.state
      if (!orbital_points) {
         return []
      }
      let prev_x = 0
      let prev_y = 0
      const table_data = orbital_points.map((point, i) => {
         let m1 = 0
         let m2 = 0
         let theta = 0
         if (i > 0) {
            m1 = (point.y - Q_core_neg.y) / (point.x - Q_core_neg.x)
            m2 = (prev_y - Q_core_neg.y) / (prev_x - Q_core_neg.x)
            theta = Math.atan((m1 - m2) / (1 + m1 * m2))
         }
         prev_x = point.x
         prev_y = point.y
         return {
            index: i + 1,
            r: point.x,
            i: point.y,
            theta
         }
      })
      return <CoolTable
         data={table_data}
         columns={ORBITAL_POINTS_COLUMNS}
      />
   }

   render() {
      const {page_settings} = this.props
      let wrapper_dimension = page_settings[KEY_COMPS_WIDTH_PX]
      if (page_settings[KEY_COMPS_WIDTH_PX]) {
         wrapper_dimension = Math.min(page_settings[KEY_COMPS_WIDTH_PX], page_settings[KEY_COMPS_WIDTH_PX])
      }
      const click_point_style = {
         width: `${wrapper_dimension * 0.55}px`,
         height: `${wrapper_dimension * 0.55}px`
      }
      const r_theta_style = {
         width: `${wrapper_dimension * 0.75}px`,
         height: `${wrapper_dimension * 0.35}px`,
         backgroundColor: '#f8f8f8',
      }
      return <styles.ContentWrapper>
         <styles.GraphWrapper style={click_point_style}>
            {this.click_point_data()}
         </styles.GraphWrapper>
         <styles.GraphWrapper style={r_theta_style}>
            {this.r_theta_data()}
         </styles.GraphWrapper>
         {/*{this.click_point_table()}*/}
         {/*{this.render_info()}*/}
      </styles.ContentWrapper>
   }
}

export default PatternsOrbital;
