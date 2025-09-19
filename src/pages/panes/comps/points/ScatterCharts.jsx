import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "settings/PaneSettings";
import {
   click_point_chart,
   escape_points_chart
} from "../patterns/PatternsUtils";
import AppErrorBoundary from "common/app/AppErrorBoundary";
import {CoolSlider} from "common/ui/CoolImports";
import {get_click_point_info, interpolate_orbital} from "./PointUtils";
import {KEY_FOCAL_POINT} from "../../../../settings/AppSettings";

const HEIGHT_FACTOR = 1.025
const HEIGHT_OFFSET_PX = 60
const WIDTH_FACTOR = 2.05
const WIDTH_OFFSET_PX = 15
const POINT_ZOOM_FACTOR = 10
const ZOOMER_WIDTH_PX = 30
const CAPTION_HEIGHT_PX = 15
const ROUNDING_FACTOR = 10000000
const OPTION_BAR_HEIGHT_PX = 20

const OPTION_SCATTER_EMPIRICAL = 'option_scatter_empirical'
const OPTION_SCATTER_ANALYTICAL = 'option_scatter_analytic'
const OPTION_SCATTER_EXPLAINER = 'option_scatter_explainer'

const SCATTER_OPTIONS = [
   {
      label: 'empirical',
      value: OPTION_SCATTER_EMPIRICAL,
   },
   {
      label: 'analytical',
      value: OPTION_SCATTER_ANALYTICAL,
   },
   {
      label: 'tutorial',
      value: OPTION_SCATTER_EXPLAINER,
   }
]

export class ScatterCharts extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      point_zoom: 0,
      zoomer_stealth_ref: React.createRef(),
      scatter_scroll_top_px: 100,
      scatter_option: OPTION_SCATTER_EMPIRICAL,
      width_px: 0,
      height_px: 0,
      click_point_info: null,
   }

   componentDidMount() {
      const {page_settings} = this.props
      const width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR) - WIDTH_OFFSET_PX
      const height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR) - HEIGHT_OFFSET_PX
      this.setState({width_px, height_px})
      setTimeout(this.initialize, 150)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const new_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR)
         - WIDTH_OFFSET_PX
      const new_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR)
         - HEIGHT_OFFSET_PX
      if (prevState.width_px !== new_width_px) {
         this.setState({width_px: new_width_px})
      }
      if (prevState.height_px !== new_height_px) {
         this.setState({height_px: new_height_px})
      }
      if (prevState.click_point_info) {
         const focal_point = page_settings[KEY_FOCAL_POINT]
         const focal_point_x_changed = prevState.click_point_info.click_point.x !== focal_point.x
         const focal_point_y_changed = prevState.click_point_info.click_point.y !== focal_point.y
         if (focal_point_x_changed || focal_point_y_changed) {
            setTimeout(this.initialize, 150)
         }
      }
   }

   initialize = () => {
      const {page_settings} = this.props
      const click_point_info = get_click_point_info(page_settings)
      this.setState({click_point_info})
   }


   render_scatter_chart = () => {
      const {click_point_info} = this.state
      if (!click_point_info) {
         return []
      }
      const {click_point, pattern, orbital_points, in_cardioid, Q_core_neg} = click_point_info
      if (pattern) {
         const set2 = [Q_core_neg]
         // if (in_animation && animation_index >= 0) {
         //    set2.push(orbital_points[animation_index])
         // }
         // const interpolation = interpolate_orbital(orbital_points, Q_core_neg)
         return click_point_chart(orbital_points, [set2], in_cardioid, false)
      }
      return escape_points_chart(click_point, in_cardioid)
   }

   scatter_caption_text = () => {
      const {click_point_info} = this.state
      if (!click_point_info) {
         return []
      }
      const {pattern,iteration, Q_core_neg} = click_point_info
      const subject_text = pattern
         ? `${pattern}-POINT ORBITAL`
         : `${iteration}-POINT ESCAPE PATH`
      const Q_core_neg_x = `${Math.round(Q_core_neg.x * ROUNDING_FACTOR) / ROUNDING_FACTOR}`
      const Q_core_neg_y = `${Math.round(Q_core_neg.y * ROUNDING_FACTOR) / ROUNDING_FACTOR}`
      const i = <styles.CaptionI
         key={'caption-i'}>
         i
      </styles.CaptionI>
      const subject = <styles.CaptionSubject
         key={'caption-subject'}>
         {subject_text}
      </styles.CaptionSubject>
      const qualifier = <styles.CaptionQualifier
         key={'scatter-aption-qualifier'}>
         {', in the vacinity of '}
      </styles.CaptionQualifier>
      const click_point_text = <styles.ClickPoint
         key={'scatter-caption-click-point'}>
         {`${Q_core_neg_x} + ${Q_core_neg_y}`}
      </styles.ClickPoint>
      return [subject, qualifier, click_point_text, i]
   }

   set_scatter_option = (scatter_option) => {
      this.setState({scatter_option})
   }

   render_options = () => {
      const {scatter_option} = this.state
      const unlit_style = {color: '#aaaaaa'}
      const options = SCATTER_OPTIONS.map((option, i) => {
         return [
            <styles.InputWrapper key={`input-${i}`}>
               <input
                  type={"radio"}
                  checked={scatter_option === option.value}
                  onChange={() => this.set_scatter_option(option.value)}
               />
            </styles.InputWrapper>,
            <styles.ScatterTypePrompt
               key={`prompt-${i}`}
               style={scatter_option === option.value ? {} : unlit_style}
               onClick={() => this.set_scatter_option(option.value)}>
               {option.label}
            </styles.ScatterTypePrompt>,
            <styles.Spacer key={`spacer-${i}`}/>
         ]
      })
      return <styles.OptionsWrapper>
         {options}
      </styles.OptionsWrapper>
   }

   render_chart = (content, zoomer, width_px, height_px) => {
      const {point_zoom, zoomer_stealth_ref} = this.state
      const options_style = {
         width: `${width_px - ZOOMER_WIDTH_PX}px`,
         height: `${OPTION_BAR_HEIGHT_PX}px`,
      }
      const chart_style = {
         width: `${width_px - ZOOMER_WIDTH_PX}px`,
         height: `${height_px - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX}px`,
      }
      const stealth_style = {
         width: `${width_px - ZOOMER_WIDTH_PX + point_zoom * POINT_ZOOM_FACTOR}px`,
         height: `${height_px + point_zoom * POINT_ZOOM_FACTOR - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX}px`,
      }
      const caption_text = this.scatter_caption_text()
      const caption = <styles.CaptionWrapper
         key={'scatter-caption'}>
         {caption_text}
      </styles.CaptionWrapper>
      const options = <styles.OptionsWrapper
         key={'scatter-options'}
         style={options_style}>
         {this.render_options()}
      </styles.OptionsWrapper>
      const show_this = [
         <styles.GraphWrapper
            key={'scatter-chart'}
            style={chart_style}>
            <styles.ZoomerStealth
               ref={zoomer_stealth_ref}
               style={stealth_style}>
               {content}
            </styles.ZoomerStealth>
         </styles.GraphWrapper>,
      ]
      const wrapped_zoomer = <styles.ZoomerWrapper
         key={'scatter-zoomer'}
         style={{height: `${height_px - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX - 20}px`}}>
         {zoomer}
      </styles.ZoomerWrapper>
      const rendered_area = [options, show_this, wrapped_zoomer, caption]
      return <AppErrorBoundary fallback={rendered_area}>
         {rendered_area}
      </AppErrorBoundary>
   }

   change_point_zoom = (e) => {
      this.setState({point_zoom: e.target.value})
      setTimeout(() => {
         const stealth = this.state.zoomer_stealth_ref.current
         if (stealth) {
            stealth.scrollIntoView({
               behavior: "instant",
               block: "center",
               inline: "center",
            })
         }
      }, 150)
   }

   render = () => {
      const {width_px, point_zoom} = this.state
      const scatter_chart_height_px = width_px * 1.01
      const scatter_chart_style = {
         width: `${width_px}px`,
         height: `${scatter_chart_height_px}px`,
      }
      const scatter_chart = this.render_scatter_chart()
      const zoomer = <CoolSlider
         value={point_zoom}
         min={0}
         max={250}
         is_vertical={true}
         on_change={this.change_point_zoom}
      />
      return <styles.ChartWrapper style={scatter_chart_style}>
         {this.render_chart(
            scatter_chart, zoomer,
            width_px,
            scatter_chart_height_px - 20)}
      </styles.ChartWrapper>
   }
}

export default ScatterCharts
