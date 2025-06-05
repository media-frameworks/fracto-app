import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import {CoolSlider} from "common/ui/CoolImports";

import FractoFastCalc from "fracto/FractoFastCalc";
import {
   KEY_AUTOMATION_SCALAR_MS,
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
} from "settings/AppSettings";
import {KEY_COMPS_WIDTH_PX} from "settings/PaneSettings";
import {
   calculate_cardioid_Q,
   click_point_chart,
   get_escape_points,
   escape_points_chart,
   escape_r_theta_chart,
   process_r_data,
   r_theta_chart,
   normalize_angle,
} from "./PatternsUtils";
import AppErrorBoundary from "common/app/AppErrorBoundary";

ChartJS.register(CategoryScale, BarController)

const ANIMATION_INIT = {
   in_animation: false,
   animation_index: -1,
   page_settings_str: null,
   animation_click_point: null,
}

export class PatternsOrbital extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      orbital_points: [],
      r_data: [],
      Q_core_neg: null,
      in_animation: false,
      animation_index: -1,
      page_settings_str: null,
      animation_click_point: null,
      hover_point: {x: 0, y: 0},
   }

   componentDidMount() {
      const {page_settings} = this.props;
      const {hover_point} = page_settings
      this.setState({
         page_settings_str: JSON.stringify(page_settings),
         hover_point: JSON.parse(JSON.stringify(hover_point)),
      })
      setTimeout(this.initialize, 250)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props;
      const current_hover_point = page_settings[KEY_HOVER_POINT]
      const hover_point_changed = (prevState.hover_point?.x || 0) !== (current_hover_point?.x || 0)
         || (prevState.hover_point?.y || 0) !== (current_hover_point?.y || 0);
      if (hover_point_changed) {
         console.log('hover_point_changed')
         if (prevState.in_animation) {
            this.setState({in_animation: false, animation_index: -1})
         }
         setTimeout(this.initialize, 250)
      }
   }

   initialize = () => {
      this.update_r_data()
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
         iteration: fracto_values.iteration,
      }
   }

   click_point_data = () => {
      const {in_animation, animation_index} = this.state
      const click_point_info = this.get_click_point_info()
      const {click_point, pattern, orbital_points, in_cardioid, Q_core_neg} = click_point_info
      if (pattern) {
         const set2 = [Q_core_neg]
         if (in_animation && animation_index >= 0) {
            set2.push(orbital_points[animation_index])
         }
         return click_point_chart(orbital_points, set2, in_cardioid, false)
      }
      return escape_points_chart(click_point, in_cardioid, animation_index)
   }

   r_theta_data = () => {
      const {animation_index} = this.state
      const click_point_info = this.get_click_point_info()
      const {click_point, pattern, orbital_points, in_cardioid, Q_core_neg} = click_point_info
      if (pattern) {
         return r_theta_chart(orbital_points, Q_core_neg, in_cardioid, animation_index)
      }
      return escape_r_theta_chart(click_point, in_cardioid, animation_index)
   }

   update_r_data = () => {
      const click_point_info = this.get_click_point_info()
      const {pattern, click_point, Q_core_neg, orbital_points} = click_point_info
      if (!pattern) {
         const escape_points = get_escape_points(click_point)
         const escaped_r_data = process_r_data(escape_points, Q_core_neg)
         this.setState({r_data: escaped_r_data})
         console.log('update_r_data', escaped_r_data.length)
      } else {
         const r_data = process_r_data(orbital_points, Q_core_neg)
         this.setState({r_data: r_data})
         console.log('update_r_data', r_data.length)
      }
   }

   toggle_animation = () => {
      const {in_animation} = this.state
      const {page_settings} = this.props
      if (!in_animation && page_settings[KEY_DISABLED]) {
         return;
      }
      const new_setting = !in_animation
      this.update_r_data()
      this.setState({
         in_animation: new_setting,
         animation_index: new_setting ? 0 : -1,
      })
      setTimeout(this.animate, 100)
   }

   animate = () => {
      const {in_animation, animation_index, r_data} = this.state
      const {page_settings} = this.props
      // console.log('animate', r_data)
      const new_index = (animation_index + 1) % (r_data.length - 1)
      if (!in_animation || new_index >= r_data.length) {
         this.setState({ANIMATION_INIT})
         return;
      }
      const delta_thetas = Math.abs((r_data[new_index + 1]?.x || 0) - (r_data[new_index]?.x || 0))
      this.setState({animation_index: new_index})
      setTimeout(this.animate, delta_thetas * page_settings[KEY_AUTOMATION_SCALAR_MS] || 200)
   }

   set_animation_rate = (e) => {
      const {on_settings_changed} = this.props
      const animation_scalar_ms = e.target.value
      on_settings_changed({[KEY_AUTOMATION_SCALAR_MS]: animation_scalar_ms})
   }

   sidebar_info = () => {
      const {r_data, in_animation, animation_index} = this.state
      const {page_settings} = this.props
      const click_point_info = this.get_click_point_info()
      const {pattern, in_cardioid, iteration} = click_point_info
      let cycles = '?'
      console.log('sidebar_info', r_data.length)
      if (r_data.length) {
         const cycles_portion = ((r_data[r_data.length - 1]?.x || 0) - (r_data[0]?.x || 0)) / (Math.PI * 2)
         cycles = Math.round(cycles_portion * 100) / 100
      }
      const statements = []
      if (pattern) {
         statements.push(`${pattern} point${pattern !== 1 ? 's' : ''}`)
         statements.push(`${iteration} iterations`)
      } else {
         statements.push(`escapes in ${iteration}`)
      }
      statements.push(`${cycles} cycle${cycles !== 1 ? 's' : ''}`)
      statements.push(`${in_cardioid ? 'endo' : 'epi'}cardial`)
      statements.push(<styles.AnimateButton
         onClick={this.toggle_animation}>
         {in_animation ? 'stop animation' : 'animate now'}
      </styles.AnimateButton>)
      if (in_animation) {
         statements.push(`index: ${animation_index}`)
         const current_cycle = (r_data[animation_index].x - r_data[0].x) / (Math.PI * 2)
         statements.push(`phase: ${Math.round(current_cycle * 100) / 100}`)
         const next_animation_index = (animation_index + 1) % r_data.length
         const theta_1 = r_data[animation_index].x
         const theta_2 = r_data[next_animation_index].x
         statements.push(`step: ${Math.round(normalize_angle(theta_2 - theta_1) * 10000) / 10000}`)
         const slider = <CoolSlider
            value={page_settings[KEY_AUTOMATION_SCALAR_MS] || 200}
            min={10}
            max={1500}
            is_vertical={false}
            on_change={this.set_animation_rate}
         />
         statements.push(slider)
      }
      return statements.map(statement => {
         return <styles.InfoLine>{statement}</styles.InfoLine>
      })
   }

   render() {
      const {page_settings} = this.props
      let wrapper_dimension = page_settings[KEY_COMPS_WIDTH_PX]
      if (page_settings[KEY_COMPS_WIDTH_PX]) {
         wrapper_dimension = Math.min(page_settings[KEY_COMPS_WIDTH_PX], page_settings[KEY_COMPS_WIDTH_PX])
      }
      const click_point_style = {
         width: `${wrapper_dimension * 0.61}px`,
         height: `${wrapper_dimension * 0.40}px`,
      }
      const r_theta_style = {
         width: `${wrapper_dimension * 0.85}px`,
         height: `${wrapper_dimension * 0.25}px`,
      }
      const sidebar_style = {
         width: `${wrapper_dimension * 0.20}px`,
         height: `${wrapper_dimension * 0.40}px`,
      }
      return [
         {
            content: this.click_point_data(),
            style: click_point_style,
            zoomer: <CoolSlider
               value={1}
               min={1}
               max={100}
               is_vertical={true}
               // on_change={}
            />
         },
         {
            content: this.sidebar_info(),
            style: sidebar_style,
            zoomer: null,
         },
         {
            content: this.r_theta_data(),
            style: r_theta_style,
            zoomer: <CoolSlider
               value={1}
               min={1}
               max={100}
               is_vertical={true}
               // on_change={}
            />
         },
      ].map((portion, i) => {
         const show_this =
            <styles.GraphWrapper style={portion.style} key={`part-${i}`}>
               {portion.content}
            </styles.GraphWrapper>
         const zoomer = portion.zoomer ? <styles.ZoomerWrapper
            style={{height: portion.style.height}}>
            {portion.zoomer}
         </styles.ZoomerWrapper> : ''
         return <AppErrorBoundary fallback={show_this}>
            {show_this}
            {zoomer}
         </AppErrorBoundary>
      })
   }
}

export default PatternsOrbital;
