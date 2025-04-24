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
   KEY_HOVER_POINT
} from "settings/AppSettings";
import {KEY_COMPS_WIDTH_PX} from "settings/PaneSettings";

ChartJS.register(CategoryScale, BarController)

const GRID_CONFIG = {
   color: function (context) {
      return context.tick.value === 0 ? '#aaaaaa' : '#dddddd'
   },
   lineWidth: function (context) {
      return context.tick.value === 0 ? 1.5 : 1
   }
};

export class CompPatterns extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   click_point_chart = (set1, set2, in_cardioid = false) => {
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
      const data_dataset = {
         datasets: [
            {
               Id: 1,
               label: `${cardinality || '?'}-point orbital`,
               data: set1,
               backgroundColor: FractoUtil.fracto_pattern_color(cardinality || 0),
               showLine: true
            },
            {
               Id: 2,
               label: set2.length ? `P` : '(in cardioid)',
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

   escape_points_chart = (click_point) => {
      const P_x = click_point.x
      const P_y = click_point.y
      let Q_x_squared = 0
      let Q_y_squared = 0
      let Q_x = 0
      let Q_y = 0
      const all_points = [{x: 0, y: 0}]
      for (let iteration = 0; iteration < 10000; iteration++) {
         Q_y = 2 * Q_x * Q_y + P_y;
         Q_x = Q_x_squared - Q_y_squared + P_x;
         Q_x_squared = Q_x * Q_x
         Q_y_squared = Q_y * Q_y
         const sum_squares = Q_x_squared + Q_y_squared
         if (sum_squares > 4) {
            break;
         }
         all_points.push({x: Q_x, y: Q_y})
      }
      return this.click_point_chart(all_points, [], false)
   }

   click_point_data = () => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      const fracto_values = this.get_fracto_values()
      const in_cardioid = FractoFastCalc.point_in_main_cardioid(click_point.x, click_point.y)
      if (fracto_values.pattern) {
         return this.click_point_chart(
            fracto_values.orbital_points,
            in_cardioid ? [] : [{x: click_point.x, y: click_point.y}],
            in_cardioid
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
            console.log('z', z.toString())
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

   render() {
      const {page_settings} = this.props
      const wrapper_dimension = Math.round(page_settings[KEY_COMPS_WIDTH_PX] * 0.9)
      const wrapper_style = {
         width: `${wrapper_dimension}px`,
         height: `${wrapper_dimension}px`
      }
      return <styles.ContentWrapper style={wrapper_style}>
         {this.click_point_data()}
         {this.render_info()}
      </styles.ContentWrapper>
   }
}

export default CompPatterns;
