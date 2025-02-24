import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ColorWheelStyles as styles} from './styles/ColorWheelStyles';
import FractoUtil from "./FractoUtil";
import {KEY_COLOR_PHASE, KEY_DISABLED} from "../pages/PageSettings";

const draw_region = (ctx, canvas_width_px, radius1, radius2, angle1, angle2, pattern, color_phase = 0) => {
   const size_by_two = canvas_width_px / 2
   ctx.beginPath();
   ctx.strokeStyle = 'black'
   ctx.arc(size_by_two, size_by_two, radius1, angle1, angle2, false);
   ctx.arc(size_by_two, size_by_two, radius2, angle2, angle1, true);
   ctx.closePath();

   const [h, s, l] = FractoUtil.fracto_pattern_color_hsl(pattern, 500)
   ctx.fillStyle = `hsl(${h + color_phase}, ${s}%, ${l}%)`
   ctx.fill();
   ctx.stroke();

   const text_pos_x =
      size_by_two + (radius2 + radius1) / 2 * Math.cos((angle1 + angle2) / 2);
   const text_pos_y =
      size_by_two + (radius2 + radius1) / 2 * Math.sin((angle1 + angle2) / 2);

   ctx.font = `lighter ${Math.round(canvas_width_px / 40)}px Courier, monospace`;
   ctx.strokeStyle = 'white';
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';
   ctx.strokeText(`${pattern}`, text_pos_x, text_pos_y);
}

const draw_circle = (ctx, x, y, radius, color) => {
   ctx.beginPath();
   ctx.strokeStyle = 'black'
   ctx.fillStyle = color
   ctx.arc(x, y, radius, 0, 359.9, false);
   ctx.fill();
   ctx.stroke();
   ctx.closePath();
}

const TWO_PI = 2 * Math.PI;
const PI_BY_2 = Math.PI / 2;
const PI_BY_4 = Math.PI / 4;
const PI_BY_8 = Math.PI / 8;
const PI_BY_16 = Math.PI / 16;

export class FractoColorWheel extends Component {
   static propTypes = {
      width_px: PropTypes.number.isRequired,
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      canvas_ref: React.createRef(),
      temp_color_phase: 0
   }

   componentDidMount() {
      this.fill_canvas()
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.width_px !== this.props.width_px
         || prevState.temp_color_phase !== this.state.temp_color_phase) {
         this.fill_canvas()
      }
   }

   fill_canvas = () => {
      const {canvas_ref, temp_color_phase} = this.state
      const {page_settings} = this.props
      const {width_px} = this.props
      if (!canvas_ref.current) {
         return;
      }
      const ctx = canvas_ref.current.getContext('2d');
      ctx.fillStyle = '#eeeeee';
      ctx.fillRect(0, 0, width_px, width_px);
      ctx.font = "20px Arial";
      ctx.textAlign = "center";

      const size_by_two = width_px / 2
      const radius = width_px * 0.44

      const r_1 = radius / Math.PI
      const r_2 = r_1 + (radius - r_1) / 4;
      const r_3 = r_1 + 2 * (radius - r_1) / 4;
      const r_4 = r_1 + 3 * (radius - r_1) / 4;

      let angle = -PI_BY_2
      const color_phase = temp_color_phase

      for (let pattern = 2; pattern <= 3; pattern++) {
         draw_region(ctx, width_px, r_1 / 2, r_1, angle, angle + Math.PI, pattern, color_phase)
         angle += Math.PI
      }
      for (let pattern = 4; pattern <= 7; pattern++) {
         draw_region(ctx, width_px, r_1, r_2, angle, angle + PI_BY_2, pattern, color_phase)
         angle += PI_BY_2
      }
      for (let pattern = 8; pattern <= 15; pattern++) {
         draw_region(ctx, width_px, r_2, r_3, angle, angle + PI_BY_4, pattern, color_phase)
         angle += PI_BY_4
      }
      for (let pattern = 16; pattern <= 31; pattern++) {
         draw_region(ctx, width_px, r_3, r_4, angle, angle + PI_BY_8, pattern, color_phase)
         angle += PI_BY_8
      }
      for (let pattern = 32; pattern <= 63; pattern++) {
         draw_region(ctx, width_px, r_4, radius, angle, angle + PI_BY_16, pattern, color_phase)
         angle += PI_BY_16
      }

      let [h, s, l] = FractoUtil.fracto_pattern_color_hsl(1, 500)
      draw_circle(ctx, size_by_two, size_by_two, r_1 / 2,
         `hsl(${h + color_phase}, ${s}%, ${l}%)`)
      ctx.strokeStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(`1`, size_by_two, size_by_two);

      angle = -Math.PI / 2 - temp_color_phase * TWO_PI / 360;
      [h, s, l] = FractoUtil.fracto_pattern_color_hsl(1, 500)
      const ball_color = `hsl(0, ${s}%, ${l}%)`
      const radius_margin = width_px / 30
      const indicator_x = size_by_two + Math.cos(angle) * (radius + radius_margin);
      const indicator_y = size_by_two + Math.sin(angle) * (radius + radius_margin);
      draw_circle(ctx, indicator_x, indicator_y, radius_margin / 3, ball_color)
   }

   color_angle = (e) => {
      const {canvas_ref} = this.state
      const {width_px} = this.props
      const clientRect = canvas_ref.current.getBoundingClientRect();
      const canvas_x = e.clientX - clientRect.left;
      const canvas_y = e.clientY - clientRect.top;
      let angle = Math.PI / 2
         + Math.atan2(canvas_y - width_px / 2, canvas_x - width_px / 2);
      while (angle < 0) {
         angle += TWO_PI;
      }
      while (angle > TWO_PI) {
         angle -= TWO_PI;
      }
      return angle
   }

   on_click = (e) => {
      const {canvas_ref} = this.state
      const {page_settings, on_settings_changed, width_px} = this.props
      if (page_settings[KEY_DISABLED]) {
         return;
      }
      if (!canvas_ref.current) {
         return;
      }
      const angle = this.color_angle(e)
      let new_settings = {}
      new_settings[KEY_COLOR_PHASE] = -360 * angle / TWO_PI
      new_settings[KEY_DISABLED] = true
      on_settings_changed(new_settings)
      this.fill_canvas()
   }

   on_hover = (e) => {
      const angle = this.color_angle(e)
      this.setState({temp_color_phase: -360 * angle / TWO_PI})
   }

   on_leave = (e) => {
      const {page_settings} = this.props
      this.setState({temp_color_phase: page_settings[KEY_COLOR_PHASE] || 0})
   }

   render() {
      const {canvas_ref} = this.state
      const {width_px} = this.props;
      return <styles.ColorWheelCanvas
         onClick={this.on_click}
         onMouseMove={this.on_hover}
         onMouseLeave={this.on_leave}
         ref={canvas_ref}
         width={width_px}
         height={width_px}
      />
   }
}

export default FractoColorWheel