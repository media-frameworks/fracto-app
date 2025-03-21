import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import FractoFastCalc from "fracto/FractoFastCalc";
import {KEY_FOCAL_POINT, KEY_HOVER_POINT} from "../../PageSettings";
import FractoUtil from "fracto/FractoUtil";
import {render_pattern_block, describe_pattern, render_coordinates} from "fracto/styles/FractoStyles";
import Complex from "../../../common/math/Complex";

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

   click_point_chart = (set1) => {
      const options = {
         scales: {
            x: {grid: GRID_CONFIG},
            y: {grid: GRID_CONFIG}
         },
         animation: false
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

   click_point_data = () => {
      const fracto_values = this.get_fracto_values()
      return this.click_point_chart(fracto_values.orbital_points)
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
         let z= new Complex(0,0)
         for (let i = 0; i < current_pattern + 10; i++) {
            z = z.add(neg_c)
            console.log('z', z.toString())
            z = z.sqrt()
         }
         console.log('fracto_values.orbital_points', fracto_values.orbital_points)
         // let product = new Complex(1, 0)
         // for (let point_index = 0; point_index < fracto_values.orbital_points.length - 1; point_index++) {
         //    console.log(`product`, product.re, product.im)
         //    const op_1 = new Complex(
         //       fracto_values.orbital_points[point_index].x,
         //       fracto_values.orbital_points[point_index].y
         //    )
         //    const op_2 = new Complex(
         //       fracto_values.orbital_points[point_index + 1].x,
         //       fracto_values.orbital_points[point_index + 1].y
         //    )
         //    const sum = op_1.add(op_2)
         //    product = product.mul(sum)
         // }
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
      return <styles.ContentWrapper>
         {this.click_point_data()}
         {this.render_info()}
      </styles.ContentWrapper>
   }
}

export default CompPatterns;
