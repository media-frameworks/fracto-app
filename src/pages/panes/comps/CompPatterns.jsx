import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CoolStyles} from "common/ui/CoolImports";
import FractoFastCalc from "fracto/FractoFastCalc";
import Complex from "common/math/Complex";
import {KEY_FOCAL_POINT} from "../../PageSettings";

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

   click_point_chart = (set1, set2, set3) => {
      const options = {
         scales: {
            x: {
               type: 'linear',
            },
         },
         animation: false
      }
      const data_dataset = {
         datasets: [
            {
               Id: 1,
               label: "set1",
               data: set1,
               backgroundColor: 'red',
               showLine: true
            },
            {
               Id: 2,
               label: "set2",
               data: set2,
               backgroundColor: 'blue'
            },
            // {
            //    Id: 3,
            //    label: "set3",
            //    data: set3,
            //    backgroundColor: 'green'
            // },
         ]
      }
      return [
         <Scatter
            width={250}
            height={250}
            datasetIdKey='id1'
            data={data_dataset} options={options}
         />
      ]
   }

   click_point_data = () => {
      const {page_settings} = this.props
      const click_point = page_settings[KEY_FOCAL_POINT]
      if (!click_point) {
         return []
      }
      const fracto_values = FractoFastCalc.calc(click_point.x, click_point.y)
      const P = new Complex(click_point.x, click_point.y)

      const under_radical = P.scale(-4).offset(1, 0)
      const negative_radical = under_radical.sqrt().scale(-1)
      const Q = negative_radical.offset(1, 0).scale(0.5)
      const Q_center = {x: Q.re, y: Q.im}

      const under_radical2 = P.scale(-4).offset(-3, 0)
      const negative_radical2 = under_radical2.sqrt().scale(-1)
      const Q2 = negative_radical2.offset(-1, 0).scale(0.5)
      const Q2_center = {x: Q2.re, y: Q2.im}

      console.log('fracto_values.orbital_points', fracto_values.orbital_points)
      return [
         `${(fracto_values.orbital_points?.length || 1) - 1} points`,
         <br />,
         this.click_point_chart(
            fracto_values.orbital_points,
            [Q_center],
            [Q2_center]),
      ]
   }

   render() {
      return <ContentWrapper>
         {this.click_point_data()}
      </ContentWrapper>
   }
}

export default CompPatterns;
