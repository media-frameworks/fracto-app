import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneLegendStyles as styles, HEADER_HEIGHT_PX, THUMBNAIL_WIDTH_PX} from "styles/PaneLegendStyles"
import {KEY_FOCAL_POINT, KEY_LEGEND_HEIGHT_PX, KEY_LEGEND_WIDTH_PX} from "../PageSettings";
import LegendHeader from "./legend/LegendHeader";
import FractoRasterImage from "fracto/FractoRasterImage";
import FractoCanvasOverlay from "fracto/FractoCanvasOverlay";
import {CoolTabs} from "../../common/ui/CoolImports";

import LegendTabStats from "./legend/LegendTabStats";
import LegendTabHelp from "./legend/LegendTabHelp";
import LegendTabMarkers from "./legend/LegendTabMarkers";
import LegendTabSettings from "./legend/LegendTabSettings";
import LegendTabReports from "./legend/LegendTabReports";

const DEFAULT_FRACTO_VALUES = {
   focal_point: {x: -0.75, y: 0.0001},
   scope: 2.5
}
const TAB_LABEL_STATS = 'stats'
const TAB_LABEL_HELP = 'help'
const TAB_LABEL_MARKERS = 'markers'
const TAB_LABEL_REPORTS = 'reports'
const TAB_LABEL_SETTINGS = 'settings'
const ALL_TABS = [
   TAB_LABEL_STATS,
   TAB_LABEL_HELP,
   TAB_LABEL_MARKERS,
   TAB_LABEL_SETTINGS,
   TAB_LABEL_REPORTS
]

export class PaneLegend extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      selected_tab_index: 0
   }

   on_plan_complete = (canvas_buffer, ctx) => {
      const {page_settings} = this.props
      const focal_point = {
         x: page_settings[KEY_FOCAL_POINT].x,
         y: page_settings[KEY_FOCAL_POINT].y,
      }
      if (ctx) {
         FractoCanvasOverlay.render_highlights(
            ctx,
            DEFAULT_FRACTO_VALUES.focal_point,
            DEFAULT_FRACTO_VALUES.scope, [focal_point]);
      }
   }

   render_thumbnail = () => {
      const {page_settings} = this.props
      const wrapper_style = {
         height: `${page_settings[KEY_LEGEND_HEIGHT_PX]}px`,
         width: `${THUMBNAIL_WIDTH_PX}px`,
      }
      const focal_point = {
         x: -0.75 + Math.random() / 12342345,
         y: 0.0001 + Math.random() / 12323445,
      }
      return <styles.ThumbnailWrapper
         style={wrapper_style}>
         <FractoRasterImage
            width_px={THUMBNAIL_WIDTH_PX}
            scope={DEFAULT_FRACTO_VALUES.scope}
            focal_point={focal_point}
            aspect_ratio={1.0}
            disabled={false}
            on_plan_complete={this.on_plan_complete}
         />
         <styles.BrandWrapper>
            <styles.BrandName>fracto</styles.BrandName>
            <styles.BrandBlurb>atlas of chaos</styles.BrandBlurb>
         </styles.BrandWrapper>
      </styles.ThumbnailWrapper>
   }

   render_selected_content = () => {
      const {selected_tab_index} = this.state
      const {page_settings, on_settings_changed} = this.props
      const element_list = [
         <LegendTabStats
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>,
         <LegendTabHelp
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>,
         <LegendTabMarkers
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>,
         <LegendTabSettings
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>,
         <LegendTabReports
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>,
      ]
      return element_list[selected_tab_index]
   }

   render_tabs = () => {
      const {selected_tab_index} = this.state
      const {page_settings} = this.props
      const wrapper_style = {
         height: `${page_settings[KEY_LEGEND_HEIGHT_PX]}px`,
         width: `${page_settings[KEY_LEGEND_WIDTH_PX] - THUMBNAIL_WIDTH_PX}px`,
      }
      return <styles.TabsWrapper
         style={wrapper_style}>
         <CoolTabs
            labels={ALL_TABS}
            tab_index={selected_tab_index}
            on_tab_select={new_tab_index => this.setState({selected_tab_index: new_tab_index})}
            selected_content={this.render_selected_content()}/>
      </styles.TabsWrapper>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const list_height_px = page_settings[KEY_LEGEND_HEIGHT_PX] - HEADER_HEIGHT_PX
      return [
         <styles.HeaderWrapper style={{height: `${HEADER_HEIGHT_PX}px`}}>
            <LegendHeader
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         </styles.HeaderWrapper>,
         <styles.LegendWrapper style={{height: `${list_height_px}px`}}>
            {this.render_thumbnail()}
            {this.render_tabs()}
            {this.render_selected_content()}
         </styles.LegendWrapper>,
      ]
   }
}

export default PaneLegend
