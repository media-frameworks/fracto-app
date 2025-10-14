import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "pages/settings/PaneSettings";

import ScatterCharts from "./points/ScatterCharts";
import PolarCharts from "./points/PolarCharts";
import DashboardControl from "./points/DashboardControl";
import VertexList from "./points/VertexList";

const HEIGHT_FACTOR = 1.025
const HEIGHT_OFFSET_PX = 60
const WIDTH_FACTOR = 2.618
const WIDTH_OFFSET_PX = 50

export class CompPoints extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      left_column_width_px: 0,
      right_column_width_px: 0,
      column_height_px: 0,
   }

   componentDidMount() {
      const {page_settings} = this.props
      const right_column_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] * 0.618) - 2 * WIDTH_OFFSET_PX
      const column_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR) - HEIGHT_OFFSET_PX
      this.setState({
            right_column_width_px,
            left_column_width_px: page_settings[KEY_COMPS_WIDTH_PX] - right_column_width_px - 2 * WIDTH_OFFSET_PX,
            column_height_px
         }
      )
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const new_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR)
         - HEIGHT_OFFSET_PX
      const new_right_column_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR) - 2 * WIDTH_OFFSET_PX
      if (prevState.right_column_width_px !== new_right_column_width_px) {
         this.setState({
            right_column_width_px: new_right_column_width_px,
            left_column_width_px: page_settings[KEY_COMPS_WIDTH_PX] - new_right_column_width_px - 2 * WIDTH_OFFSET_PX,
         })
      }
      if (prevState.column_height_px !== new_height_px) {
         this.setState({column_height_px: new_height_px})
      }
   }

   render_left_column = () => {
      const {page_settings, on_settings_changed} = this.props
      return [
         <styles.ChartWrapper>
            <ScatterCharts
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.ChartWrapper>,
         <styles.ChartWrapper>
            <PolarCharts
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.ChartWrapper>
      ]
   }

   render_right_column = () => {
      const {page_settings, on_settings_changed} = this.props
      return [
         <styles.DashboardWrapper>
            <DashboardControl
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.DashboardWrapper>,
         <styles.ChartWrapper>
            <VertexList
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.ChartWrapper>
      ]
   }

   render() {
      const {left_column_width_px, right_column_width_px, column_height_px} = this.state
      const left_column_style = {
         width: `${left_column_width_px - 20}px`,
         height: `${column_height_px}px`,
      }
      const right_column_style = {
         maxWidth: `${right_column_width_px}px`,
      }
      const left_panel = <styles.ColumnWrapper
         style={left_column_style}>
         {this.render_left_column()}
      </styles.ColumnWrapper>
      const right_panel = <styles.ColumnWrapper
         style={right_column_style}>
         {this.render_right_column()}
      </styles.ColumnWrapper>
      return <styles.ContentWrapper>
         {left_panel}
         {right_panel}
      </styles.ContentWrapper>
   }
}

export default CompPoints
