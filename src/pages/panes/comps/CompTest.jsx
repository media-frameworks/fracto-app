import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompTestStyles as styles} from 'styles/CompTestStyles'
import {KEY_FOCAL_POINT} from "../../../settings/AppSettings";
import Base2i from "../../../common/math/Base2i";

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
         this.collect_chart_data()
      }
   }

   collect_chart_data = () => {
      const {page_settings} = this.props
      const range_values = Base2i.generate_range(2, 10)
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      return <styles.ContentWrapper>
         {'CompTest'}
      </styles.ContentWrapper>

   }
}

export default CompTest
