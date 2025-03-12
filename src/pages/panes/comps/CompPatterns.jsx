import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import FractoFastCalc from "fracto/FractoFastCalc";
import {KEY_FOCAL_POINT, KEY_HOVER_POINT} from "../../PageSettings";
import FractoUtil from "fracto/FractoUtil";
import {render_pattern_block, describe_pattern} from "fracto/styles/FractoStyles";

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
      const fracto_values = this.get_fracto_values()
      const current_pattern = (fracto_values.orbital_points?.length || 1) - 1
      if (current_pattern) {
         return <styles.InfoBlockWrapper>
            <styles.PatternBlockWrapper>
               {render_pattern_block(current_pattern)}
            </styles.PatternBlockWrapper>
            <styles.DescriptorWrapper>{describe_pattern(current_pattern)}</styles.DescriptorWrapper>
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
