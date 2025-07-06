import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "settings/PaneSettings";
import ScatterCharts from "./points/ScatterCharts";
import PolarCharts from "./points/PolarCharts";

const HEIGHT_FACTOR = 1.025
const HEIGHT_OFFSET_PX = 60
const WIDTH_FACTOR = 2.05
const WIDTH_OFFSET_PX = 15

export class CompPoints extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      column_width_px: 0,
      column_height_px: 0,
   }

   componentDidMount() {
      const {page_settings} = this.props
      const column_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR) - WIDTH_OFFSET_PX
      const column_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR) - HEIGHT_OFFSET_PX
      this.setState({column_width_px, column_height_px})
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const new_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR)
         - WIDTH_OFFSET_PX
      const new_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR)
         - HEIGHT_OFFSET_PX
      if (prevState.column_width_px !== new_width_px) {
         this.setState({column_width_px: new_width_px})
      }
      if (prevState.column_height_px !== new_height_px) {
         this.setState({column_height_px: new_height_px})
      }
   }

   render_left_column = () => {
      const {column_width_px, column_height_px} = this.state
      const {page_settings, on_settings_changed} = this.props
      const scatter_chart_height_px = column_width_px * 1.01
      const remainder_px = column_height_px - scatter_chart_height_px - 10
      const scatter_chart_style = {
         width: `${column_width_px}px`,
         height: `${scatter_chart_height_px}px`,
      }
      const polar_chart_style = {
         width: `${column_width_px}px`,
         height: `${remainder_px}px`,
      }
      return [
         <styles.ChartWrapper style={scatter_chart_style}>
            <ScatterCharts
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.ChartWrapper>,
         <styles.ChartWrapper style={polar_chart_style}>
            <PolarCharts
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.ChartWrapper>
      ]
   }

   render_right_column = () => {
   }

   render() {
      const {column_width_px, column_height_px} = this.state
      const left_column_style = {
         width: `${column_width_px}px`,
         height: `${column_height_px}px`,
      }
      const right_column_style = {
         width: `${column_width_px}px`,
         height: `${column_height_px}px`,
         backgroundColor: 'skyblue',
      }
      const left_panel = <styles.ColumnWrapper style={left_column_style}>
         {this.render_left_column()}
      </styles.ColumnWrapper>
      const right_panel = <styles.ColumnWrapper style={right_column_style}>
         {this.render_right_column()}
      </styles.ColumnWrapper>
      return <styles.ContentWrapper>
         {left_panel}
         {right_panel}
      </styles.ContentWrapper>
   }
}

export default CompPoints
