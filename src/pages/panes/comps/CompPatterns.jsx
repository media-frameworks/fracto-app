import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CoolStyles} from "common/ui/CoolImports";
import FractoFastCalc from "fracto/FractoFastCalc";
import {KEY_HOVER_POINT} from "../../PageSettings";
import FractoUtil from "../../../fracto/FractoUtil";

ChartJS.register(CategoryScale, BarController)

const ContentWrapper = styled(CoolStyles.Block)`
   padding: 0.5rem;
   background-color: white;
`

export class CompPatterns extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   click_point_chart = (set1) => {
      const options = {
         scales: {
            x: {
               type: 'linear',
            },
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

   click_point_data = () => {
      const {page_settings} = this.props
      const click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         return []
      }
      const fracto_values = FractoFastCalc.calc(click_point.x, click_point.y)
      console.log('fracto_values.orbital_points', fracto_values.orbital_points)
      return [
         `${(fracto_values.orbital_points?.length || 1) - 1} points`,
         <br />,
         this.click_point_chart(fracto_values.orbital_points)
      ]
   }

   render() {
      return <ContentWrapper>
         {this.click_point_data()}
      </ContentWrapper>
   }
}

export default CompPatterns;
