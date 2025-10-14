import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import {CoolSlider} from "common/ui/CoolImports";

import FractoFastCalc from "fracto/FractoFastCalc";
import {
   KEY_AUTOMATION_SCALAR_MS,
   KEY_DISABLED, KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
} from "pages/settings/AppSettings";
import {KEY_COMPS_WIDTH_PX} from "pages/settings/PaneSettings";
import {
   click_point_chart,
   get_escape_points,
   escape_points_chart,
   escape_r_theta_chart,
   process_r_data,
   r_theta_chart,
   normalize_angle,
} from "./PatternsUtils";
import AppErrorBoundary from "common/app/AppErrorBoundary";
import CoolMediaTransport from "common/ui/CoolMediaTransport";

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
      point_zoom: 1,
      r_theta_zoom: 1,
      r_theta_scroll_ref: React.createRef(),
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
      const hover_point_changed = (prevState.hover_point.x) !== (current_hover_point.x)
         || (prevState.hover_point.y) !== (current_hover_point.y);
      if (hover_point_changed) {
         this.setState({
            hover_point: JSON.parse(JSON.stringify(current_hover_point)),
         })
         // console.log('hover_point_changed', prevState.hover_point, current_hover_point)
         if (prevState.in_animation) {
            this.setState({in_animation: false, animation_index: -1})
         }
         setTimeout(this.initialize, 10)
      }
   }

   initialize = () => {
      this.update_r_data()
   }

   get_fracto_values = (set1, set2) => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      return FractoFastCalc.calc(click_point.x, click_point.y)
   }

   get_click_point_info = () => {
      const {page_settings} = this.props
      let click_point = page_settings[KEY_HOVER_POINT]
      if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
         click_point = page_settings[KEY_FOCAL_POINT]
      }
      const fracto_values = this.get_fracto_values()
      const in_cardioid = FractoFastCalc.point_in_main_cardioid(click_point.x, click_point.y)
      // const big_calc_obj = FractoFastCalc.best_big_iteration(
      //    fracto_values.pattern, click_point.x, click_point.y)
      // const big_calc = big_calc_obj.map(p => {
      //    return {x: p.get_re(), y: p.get_im()}
      // })
      // console.log('big_calc', big_calc_obj)
      const Q_core_neg = FractoFastCalc.calculate_cardioid_Q(click_point.x, click_point.y, -1)
      const Q_core_pos = FractoFastCalc.calculate_cardioid_Q(click_point.x, click_point.y, 1)
      return {
         click_point,
         pattern: fracto_values.pattern,
         orbital_points: fracto_values.orbital_points,
         in_cardioid,
         Q_core_neg,
         Q_core_pos,
         iteration: fracto_values.iteration,
         // big_calc
      }
   }

   click_point_data = () => {
      const {animation_index} = this.state
      const click_point_info = this.get_click_point_info()
      const {click_point, pattern, orbital_points, in_cardioid, Q_core_neg} = click_point_info
      if (pattern) {
         return click_point_chart(orbital_points, [Q_core_neg], in_cardioid, false)
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
      const {in_animation, animation_index, r_data, r_theta_scroll_ref} = this.state
      const {page_settings} = this.props
      // console.log('animate', r_data)
      const new_index = (animation_index + 1) % (r_data.length - 1)
      if (!in_animation || new_index >= r_data.length) {
         this.setState({ANIMATION_INIT})
         return;
      }
      const delta_thetas = Math.abs((r_data[new_index + 1]?.x || 0) - (r_data[new_index]?.x || 0))
      this.setState({animation_index: new_index})
      if (r_theta_scroll_ref.current) {
         r_theta_scroll_ref.current.scrollTo({
            left: (new_index * r_theta_scroll_ref.current.scrollWidth) / (1.25 * r_data.length)
         })
      }
      setTimeout(this.animate, delta_thetas * page_settings[KEY_AUTOMATION_SCALAR_MS] || 200)
   }

   set_animation_rate = (e) => {
      const {on_settings_changed} = this.props
      const animation_scalar_ms = e.target.value
      on_settings_changed({[KEY_AUTOMATION_SCALAR_MS]: animation_scalar_ms})
   }

   big_calc_info = (pattern, click_point) => {
      const big_calc_obj = FractoFastCalc.best_big_iteration(
         pattern, click_point.x, click_point.y)
      console.log('big_calc_obj', big_calc_obj)
      const big_calc = big_calc_obj.map(p => {
         return {x: p.get_re(), y: p.get_im()}
      })
      const big_Q_neg = FractoFastCalc.calculate_big_cardioid_Q(
         click_point.x, click_point.y, -1)
      const big_calc_radii = big_calc_obj.map(p => {
         const negative_p = p.scale(-1)
         const diff_Q_p = negative_p.offset(big_Q_neg.x, big_Q_neg.y)
         return diff_Q_p.magnitude().toString()
      })
      console.log('big_calc', big_calc)
      console.log('big_calc_radii', big_calc_radii)
      return big_calc
   }

   sidebar_info = (width_px) => {
      const {r_data, in_animation, animation_index} = this.state
      const {page_settings} = this.props
      const click_point_info = this.get_click_point_info()
      const {pattern, in_cardioid, iteration} = click_point_info
      let cycles = '?'
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
      statements.push(<CoolMediaTransport
         width_px={width_px}
         on_play={this.on_play}
         on_pause={this.on_pause}
         on_stop={this.on_stop}
      />)

      return statements.map(statement => {
         return <styles.InfoLine>{statement}</styles.InfoLine>
      })
   }

   change_point_zoom = (e) => {
      // console.log('change_point_zoom', e.target.value)
      this.setState({point_zoom: e.target.value})
   }

   change_r_theta_zoom = (e) => {
      // console.log('change_point_zoom', e.target.value)
      this.setState({r_theta_zoom: e.target.value})
   }

   render() {
      const {point_zoom, r_theta_zoom, r_data, r_theta_scroll_ref} = this.state
      const {page_settings} = this.props
      const wrapper_dimension = page_settings[KEY_COMPS_WIDTH_PX]
      const parts = [
         {
            content: this.click_point_data(),
            width_px: wrapper_dimension * 0.6,
            height_px: wrapper_dimension * 0.41,
            width_offset_px: (point_zoom - 1) * 10,
            height_offset_px: (point_zoom - 1) * 10,
            zoomer: <CoolSlider
               value={point_zoom}
               min={1}
               max={100}
               is_vertical={true}
               on_change={this.change_point_zoom}
            />
         },
         {
            content: this.sidebar_info(wrapper_dimension * 0.19),
            width_px: wrapper_dimension * 0.19,
            height_px: wrapper_dimension * 0.40,
            width_offset_px: 0,
            height_offset_px: 0,
            zoomer: null,
         },
         {
            content: this.r_theta_data(),
            width_px: wrapper_dimension * 0.86,
            height_px: wrapper_dimension * 0.28,
            width_offset_px: (r_theta_zoom - 1) * 10,
            height_offset_px: r_theta_zoom > 1 ? -15 : 0,
            scroll_ref: r_theta_scroll_ref,
            zoomer: <CoolSlider
               value={r_theta_zoom}
               min={1}
               max={Math.min(r_data.length * 5, 3000)}
               is_vertical={true}
               on_change={this.change_r_theta_zoom}
            />
         },
      ].map((portion, i) => {
         const sheath_style = {
            height: `${portion.height_px + portion.height_offset_px}px`,
            width: `${portion.width_px + portion.width_offset_px}px`,
         }
         const portion_style = {
            height: `${portion.height_px}px`,
            width: `${portion.width_px}px`,
         }
         const show_this =
            <styles.GraphWrapper
               ref={portion.scroll_ref}
               style={portion_style}
               key={`part-${i}`}>
               <styles.ZoomerSheath
                  style={sheath_style}>
                  {portion.content}
               </styles.ZoomerSheath>
            </styles.GraphWrapper>
         const zoomer = portion.zoomer ? <styles.ZoomerWrapper
            style={{height: portion_style.height}}>
            {portion.zoomer}
         </styles.ZoomerWrapper> : ''
         return <AppErrorBoundary fallback={[show_this, zoomer]}>
            {show_this}
            {zoomer}
         </AppErrorBoundary>
      })
      return <styles.PatternPartsWrapper>{parts}</styles.PatternPartsWrapper>
   }
}

export default PatternsOrbital;
