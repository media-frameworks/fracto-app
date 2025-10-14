import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompLoreStyles as styles} from 'styles/CompLoreStyles'
import {KEY_FOCAL_POINT} from "pages/settings/AppSettings";
import Base2i from "common/math/Base2i";
import Complex from "common/math/Complex";
import {Scatter} from "react-chartjs-2";

export class CompTest extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      chart_focal_point: {},
      chart_data: [],
   }

   componentDidMount() {
      this.collect_chart_data()
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const focal_point = this.props.page_settings[KEY_FOCAL_POINT]
      const focal_point_x_changed = prevState.chart_focal_point.x !== focal_point.x
      const focal_point_y_changed = prevState.chart_focal_point.y !== focal_point.y
      if (focal_point_x_changed || focal_point_y_changed) {
         // this.collect_chart_data()
      }
   }

   collect_chart_data = () => {
      const range_values = Base2i.generate_range(2, 6)
      const chart_data = []
      range_values.forEach((value, i) => {
         const x = new Complex(value.complex_value.re, value.complex_value.im)
         const x_squared = x.mul(x)
         // const negative_x_squared = x_squared.scale(-1)
         // const one_minus_x_squared = negative_x_squared.offset(1, 0)
         const y = x_squared // one_minus_x_squared.sqrt()
         const magnitude_y = y.magnitude()
         if (magnitude_y > 2.0) {
            return
         }
         const x_in_base_2i = new Base2i(x.re, x.im)
         const x_in_base_2i_str = x_in_base_2i.to_string()
         const y_in_base_2i = new Base2i(y.re, y.im)
         const y_in_base_2i_str = y_in_base_2i.to_string()
         const parsed_x = Base2i.parse_float_base_4(x_in_base_2i_str)
         const parsed_y = Base2i.parse_float_base_4(y_in_base_2i_str)
         if (parsed_x < 2 && parsed_y < 2) {
            chart_data.push({
               complex_x: {
                  re: x.re,
                  im: x.im,
               },
               complex_y: {
                  re: y.re,
                  im: y.im,
               },
               x: parsed_x,
               y: parsed_y,
            })
         }
      })
      this.setState({chart_data})
   }

   render() {
      const {chart_data} = this.state
      console.log('chart_data', chart_data)
      const data_dataset = {datasets: []}
      data_dataset.datasets.push({
         Id: 1,
         label: 'x squared',
         data: chart_data,
         pointRadius: 1,
      })
      return <styles.ContentWrapper>
         <Scatter
            datasetIdKey='id1'
            data={data_dataset}
         />
      </styles.ContentWrapper>
   }
}

export default CompTest
