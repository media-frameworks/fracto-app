import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "settings/PaneSettings";
import AppErrorBoundary from "../../../../common/app/AppErrorBoundary";
import {
   get_click_point_info,
   process_escape_sets,
   process_orbital_sets,
} from "./PointUtils";
import {iteration_chart} from "../patterns/PatternsUtils";
import {CoolSlider} from "../../../../common/ui/CoolImports";

const HEIGHT_FACTOR = 1.025
const HEIGHT_OFFSET_PX = 60
const WIDTH_FACTOR = 2.05
const WIDTH_OFFSET_PX = 15
const POINT_ZOOM_FACTOR = 10
const ZOOMER_WIDTH_PX = 30
const CAPTION_HEIGHT_PX = 35
const ROUNDING_FACTOR = 10000000
const OPTION_BAR_HEIGHT_PX = 35

const OPTION_POLAR_R_THETA = 'option_polar_r_theta'
const OPTION_POLAR_ROOTS_OF_UNITY = 'option_polar_roots_of_unity'
const OPTION_POLAR_EXPLAINER = 'option_polar_explainer'

const POLAR_OPTIONS = [
   {
      label: 'polar form',
      value: OPTION_POLAR_R_THETA,
   },
   {
      label: 'roots of unity',
      value: OPTION_POLAR_ROOTS_OF_UNITY,
   },
   {
      label: 'tutorial',
      value: OPTION_POLAR_EXPLAINER,
   }
]

export class PolarCharts extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      point_zoom: 0,
      zoomer_stealth_ref: React.createRef(),
      polar_option: OPTION_POLAR_R_THETA,
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

   set_polar_option = (polar_option) => {
      this.setState({polar_option})
   }

   render_options = () => {
      const {polar_option} = this.state
      const unlit_style = {color: '#aaaaaa'}
      const options = POLAR_OPTIONS.map((option, i) => {
         return [
            <styles.InputWrapper key={`input-${i}`}>
               <input
                  type={"radio"}
                  checked={polar_option === option.value}
                  onChange={() => this.set_polar_option(option.value)}
               />
            </styles.InputWrapper>,
            <styles.ScatterTypePrompt
               key={`prompt-${i}`}
               style={polar_option === option.value ? {} : unlit_style}
               onClick={() => this.set_polar_option(option.value)}>
               {option.label}
            </styles.ScatterTypePrompt>,
            <styles.Spacer key={`spacer-${i}`}/>
         ]
      })
      return <styles.OptionsWrapper>
         {options}
      </styles.OptionsWrapper>
   }

   render_charts = (width_px, height_px) => {
      const {point_zoom, zoomer_stealth_ref} = this.state
      const {page_settings} = this.props
      const click_point_info = get_click_point_info(page_settings)
      if (!click_point_info) {
         return []
      }
      const {click_point, orbital_points, Q_core_neg, pattern, in_cardioid} = click_point_info
      let r_data_set = null
      if (!pattern) {
         const escape_sets = process_escape_sets(click_point, Q_core_neg)
         r_data_set = escape_sets.r_set
      } else {
         const orbital_sets = process_orbital_sets(orbital_points, Q_core_neg)
         r_data_set = orbital_sets.r_set
      }
      // console.log('r_data_set', r_data_set)
      const r_chart = iteration_chart(r_data_set, in_cardioid, !pattern)

      const chart_style = {
         width: `${width_px - ZOOMER_WIDTH_PX}px`,
         height: `${height_px - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX}px`,
      }
      const stealth_style = {
         width: `${width_px - ZOOMER_WIDTH_PX + point_zoom * POINT_ZOOM_FACTOR}px`,
         height: `${height_px  - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX}px`,
      }
      return <styles.GraphWrapper
         key={'scatter-chart'}
         style={chart_style}>
         <styles.ZoomerStealth
            ref={zoomer_stealth_ref}
            style={stealth_style}>
            {r_chart}
         </styles.ZoomerStealth>
      </styles.GraphWrapper>
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

   polar_caption_text = () => {
      const {page_settings} = this.props
      const click_point_info = get_click_point_info(page_settings)
      if (!click_point_info) {
         return []
      }
      const {orbital_points, click_point, Q_core_neg} = click_point_info
      let min_y = 100
      let max_y = 0
      if (orbital_points) {
         orbital_points.forEach(point => {
            if (point.y < min_y) {
               min_y = point.y
            }
            if (point.y > max_y) {
               max_y = point.y
            }
         })
      } else {
         const escape_sets = process_escape_sets(click_point, Q_core_neg)
         escape_sets.r_set.forEach(point => {
            if (point.y < min_y && point.y) {
               min_y = point.y
            }
            if (point.y > max_y) {
               max_y = point.y
            }
         })
      }
      const subject = <styles.CaptionSubject
         key={'caption-subject'}>
         {'AMPLITUDE'}
      </styles.CaptionSubject>
      min_y = `${Math.round(min_y * ROUNDING_FACTOR) / ROUNDING_FACTOR}`
      max_y = `${Math.round(max_y * ROUNDING_FACTOR) / ROUNDING_FACTOR}`
      const qualifier = <styles.CaptionQualifier
         key={'caption-qualifier'}>
         {', in the range of '}
      </styles.CaptionQualifier>
      const min_y_styled = <styles.ClickPoint
         key={'caption-click-point'}>
         {`${min_y}`}
      </styles.ClickPoint>
      const max_y_styled = <styles.ClickPoint
         key={'caption-click-point'}>
         {`${max_y}`}
      </styles.ClickPoint>
      const and = <styles.CaptionQualifier
         key={'caption-qualifier'}>
         {' and '}
      </styles.CaptionQualifier>
      return [
         subject,
         qualifier,
         min_y_styled,
         and,
         max_y_styled
      ]
   }

   render() {
      const {column_width_px, column_height_px, point_zoom} = this.state
      const polar_chart_style = {
         width: `${column_width_px - ZOOMER_WIDTH_PX}px`,
         height: `${column_height_px - column_width_px - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX}px`,
      }
      const options = this.render_options()
      const charts = this.render_charts(column_width_px, column_height_px - column_width_px)
      const chart_stack = <styles.ChartWrapper style={polar_chart_style}>
         {charts}
      </styles.ChartWrapper>
      const zoomer = <CoolSlider
         value={point_zoom}
         min={0}
         max={250}
         is_vertical={true}
         on_change={this.change_point_zoom}
      />
      const wrapped_zoomer = <styles.ZoomerWrapper
         key={'polar-zoomer'}
         style={{height: `${column_height_px - column_width_px - CAPTION_HEIGHT_PX - OPTION_BAR_HEIGHT_PX - 20}px`}}>
         {zoomer}
      </styles.ZoomerWrapper>
      const caption_text = this.polar_caption_text()
      const caption = <styles.CaptionWrapper
         key={'polar-caption'}>
         {caption_text}
      </styles.CaptionWrapper>
      const rendered_area = [
         options,
         chart_stack,
         wrapped_zoomer,
         caption,
      ]
      return <AppErrorBoundary fallback={rendered_area}>
         {rendered_area}
      </AppErrorBoundary>
   }
}

export default PolarCharts
