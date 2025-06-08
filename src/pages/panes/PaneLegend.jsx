import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {KEY_FOCAL_POINT} from "settings/AppSettings";
import {
   KEY_LEGEND_HEIGHT_PX, KEY_LEGEND_WIDTH_PX
} from "settings/PaneSettings";
import {
   PaneLegendStyles as styles,
   HEADER_HEIGHT_PX,
   THUMBNAIL_WIDTH_PX
} from "styles/PaneLegendStyles"
import LegendHeader from "./legend/LegendHeader";
import FractoRasterImage from "fracto/FractoRasterImage";
import FractoCanvasOverlay from "fracto/FractoCanvasOverlay";

import LegendTabStats from "./legend/LegendTabStats";

const DEFAULT_FRACTO_VALUES = {
   focal_point: {x: -0.75, y: 0.0001},
   scope: 2.5
}

export class PaneLegend extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   on_plan_complete = (canvas_buffer, ctx) => {
      const {page_settings} = this.props
      const focal_point = {
         x: page_settings[KEY_FOCAL_POINT]?.x || 0,
         y: page_settings[KEY_FOCAL_POINT]?.y || 0,
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

   render_tabs = () => {
      const {page_settings, on_settings_changed} = this.props
      const wrapper_style = {
         height: `${page_settings[KEY_LEGEND_HEIGHT_PX]}px`,
         width: `${page_settings[KEY_LEGEND_WIDTH_PX] - THUMBNAIL_WIDTH_PX}px`,
      }
      return <styles.TabsWrapper
         style={wrapper_style}>
         <styles.StatsTitle>stats</styles.StatsTitle>
         <LegendTabStats
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>
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
         </styles.LegendWrapper>,
      ]
   }
}

export default PaneLegend
