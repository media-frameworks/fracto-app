import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import Complex from "common/math/Complex";
import FractoFastCalc from "fracto/FractoFastCalc";
import FractoUtil from "fracto/FractoUtil";
import {render_pattern_block} from "fracto/styles/FractoStyles";
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

ChartJS.register(CategoryScale, BarController)

const GRID_CONFIG = {
   color: function (context) {
      return context.tick.value === 0 ? '#aaaaaa' : '#dddddd'
   },
   lineWidth: function (context) {
      return context.tick.value === 0 ? 1.5 : 1
   }
};

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

   click_point_chart = (set1, set2, in_cardioid = false, escaper = false) => {
      const options = {
         scales: {
            x: {grid: GRID_CONFIG,},
            y: {grid: GRID_CONFIG,}
         },
         animation: false,
         maintainAspectRatio: false,
      }
      if (!in_cardioid) {
         options.scales.x.min = -2
         options.scales.x.max = 2
         options.scales.y.min = -2
         options.scales.y.max = 2
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
      return [
         <Scatter
            datasetIdKey='id1'
            data={data_dataset} options={options}
         />
      ]
   }

   get_fracto_values = (set1, set2) => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      return FractoFastCalc.calc(click_point.x, click_point.y)
   }

   calculate_cardioid_Q = (x, y, scalar = 1) => {
      const P = new Complex(x, y)
      const negative_four_P = P.scale(-4.0)
      const under_radocal = negative_four_P.offset(1, 0)
      const radical = under_radocal.sqrt().scale(scalar)
      const result = radical.offset(1.0, 0).scale(0.5)
      return {x: result.re, y: result.im}
   }

   escape_points_chart = (click_point) => {
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
         if (sum_squares > 4) {
            break;
         }
         escape_points.push({x: Q_x, y: Q_y})
      }
      const Q_core_neg = this.calculate_cardioid_Q(click_point.x, click_point.y, -1)
      setTimeout(() => {
         this.setState({orbital_points: escape_points, Q_core_neg})
      }, 1000)

      return this.click_point_chart(escape_points, [Q_core_neg], false, true)
   }

   click_point_data = () => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      const fracto_values = this.get_fracto_values()
      const in_cardioid = FractoFastCalc.point_in_main_cardioid(click_point.x, click_point.y)
      const Q_core_neg = this.calculate_cardioid_Q(click_point.x, click_point.y, -1)
      if (fracto_values.pattern) {
         setTimeout(() => {
            this.setState({orbital_points: fracto_values.orbital_points, Q_core_neg})
         }, 1000)
         return this.click_point_chart(
            fracto_values.orbital_points,
            [Q_core_neg],
            in_cardioid, false
         )
      }
      return this.escape_points_chart(click_point)
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
            <styles.PatternBlockWrapper>
               {render_pattern_block(current_pattern)}
            </styles.PatternBlockWrapper>
            {/*{render_coordinates(product.re, product.im)}*/}
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
            theta = Math.atan((m1 - m2)/(1 + m1 * m2))
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
      const wrapper_style = {
         width: `${wrapper_dimension * 0.750}px`,
         height: `${wrapper_dimension * 0.750}px`
      }
      return <styles.ContentWrapper style={wrapper_style}>
         {this.click_point_data()}
         {this.click_point_table()}
         {this.render_info()}
      </styles.ContentWrapper>
   }
}

export default PatternsOrbital;
