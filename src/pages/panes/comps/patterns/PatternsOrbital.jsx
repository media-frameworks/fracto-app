import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import FractoFastCalc from "fracto/FractoFastCalc";
import {
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
} from "settings/AppSettings";
import {KEY_COMPS_WIDTH_PX} from "settings/PaneSettings";
import {
   calculate_cardioid_Q,
   click_point_chart,
   escape_points_chart,
   escape_r_theta_chart, process_r_data,
   r_theta_chart
} from "./PatternsUtils";

ChartJS.register(CategoryScale, BarController)

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

   get_click_point_info = () => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!click_point) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      const fracto_values = this.get_fracto_values()
      const in_cardioid = FractoFastCalc.point_in_main_cardioid(click_point.x, click_point.y)
      const Q_core_neg = calculate_cardioid_Q(click_point.x, click_point.y, -1)
      return {
         click_point,
         pattern: fracto_values.pattern,
         orbital_points: fracto_values.orbital_points,
         in_cardioid,
         Q_core_neg,
      }
   }

   click_point_data = () => {
      const click_point_info = this.get_click_point_info()
      const {click_point, pattern, orbital_points, in_cardioid, Q_core_neg} = click_point_info
      if (pattern) {
         setTimeout(() => {
            this.setState({orbital_points, Q_core_neg})
         }, 1000)
         return click_point_chart(orbital_points, [Q_core_neg], in_cardioid, false)
      }
      return escape_points_chart(click_point, in_cardioid)
   }

   r_theta_data = () => {
      const click_point_info = this.get_click_point_info()
      const {click_point, pattern, orbital_points, in_cardioid, Q_core_neg} = click_point_info
      if (pattern) {
         return r_theta_chart(orbital_points, Q_core_neg, in_cardioid)
      }
      return escape_r_theta_chart(click_point, in_cardioid)
   }

   sidebar_info = () => {
      const click_point_info = this.get_click_point_info()
      const {pattern, orbital_points, Q_core_neg} = click_point_info
      if (!orbital_points) {
         return ''
      }
      console.log('sidebar_info', click_point_info)
      const r_data = process_r_data(orbital_points, Q_core_neg)
      const cycles = (r_data[r_data.length - 1].x - r_data[0].x) / (Math.PI * 2)
      return `${pattern} points, ${Math.round(cycles)} cycles`
   }

   render() {
      const {page_settings} = this.props
      let wrapper_dimension = page_settings[KEY_COMPS_WIDTH_PX]
      if (page_settings[KEY_COMPS_WIDTH_PX]) {
         wrapper_dimension = Math.min(page_settings[KEY_COMPS_WIDTH_PX], page_settings[KEY_COMPS_WIDTH_PX])
      }
      const click_point_style = {
         width: `${wrapper_dimension * 0.65}px`,
         height: `${wrapper_dimension * 0.45}px`,
      }
      const r_theta_style = {
         width: `${wrapper_dimension * 0.85}px`,
         height: `${wrapper_dimension * 0.30}px`,
      }
      const sidebar_style = {
         width: `${wrapper_dimension * 0.20}px`,
         height: `${wrapper_dimension * 0.45}px`,
      }
      return <styles.ContentWrapper>
         <styles.GraphWrapper style={click_point_style}>
            {this.click_point_data()}
         </styles.GraphWrapper>
         <styles.SidebarWrapper style={sidebar_style}>
            {this.sidebar_info()}
         </styles.SidebarWrapper>
         <styles.GraphWrapper style={r_theta_style}>
            {this.r_theta_data()}
         </styles.GraphWrapper>
      </styles.ContentWrapper>
   }
}

export default PatternsOrbital;
