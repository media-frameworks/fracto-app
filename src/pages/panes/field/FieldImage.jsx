import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FractoRasterImage from "fracto/FractoRasterImage";
import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'

import {
   KEY_FIELD_WIDTH_PX,
   KEY_FIELD_HEIGHT_PX,
   KEY_FOCAL_POINT,
   KEY_SCOPE,
   KEY_CANVAS_BUFFER,
   KEY_CTX,
   KEY_DISABLED
} from "../../PageSettings";

const IMAGE_SIZE_DELTA = 50

export class FieldImage extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
      on_hover: PropTypes.func.isRequired,
   }

   state = {
      image_ref: React.createRef(),
   }

   get_mouse_pos = (e) => {
      const {image_ref} = this.state
      const {page_settings} = this.props
      const focal_point = page_settings[KEY_FOCAL_POINT]
      const scope = page_settings[KEY_SCOPE]
      const inspector_bounds = {
         left: focal_point.x - scope / 2,
         top: focal_point.y + scope / 2,
      }
      const image_wrapper = image_ref.current
      if (!image_wrapper) {
         return {}
      }
      const bounds = image_wrapper.getBoundingClientRect()
      const increment = scope / this.get_image_width()
      const x = inspector_bounds.left + increment * (e.clientX - bounds.x)
      const y = inspector_bounds.top - increment * (e.clientY - bounds.y)
      // console.log('x, y', x, y)
      return {x: x, y: y}
   }

   on_mousemove = (e) => {
      const {on_hover} = this.props
      const location = this.get_mouse_pos(e)
      if (on_hover) {
         on_hover(location)
      }
   }

   on_mouseleave = (e) => {
      const {on_hover} = this.props
      if (on_hover) {
         on_hover(false)
      }
   }

   on_click = (e) => {
      const {image_ref} = this.state
      const {focal_point, scope, on_settings_changed, disabled} = this.props
      if (disabled) {
         return
      }
      const container_bounds = image_ref.current.getBoundingClientRect()
      const img_x = Math.floor(e.clientX - container_bounds.left)
      const img_y = Math.floor(e.clientY - container_bounds.top)
      const leftmost = focal_point.x - scope / 2
      const topmost = focal_point.y + scope / 2
      const increment = scope / container_bounds.width
      let settings = {}
      settings[KEY_FOCAL_POINT] = {
         x: leftmost + increment * img_x,
         y: topmost - increment * img_y,
      }
      on_settings_changed(settings)
   }

   get_image_width = () => {
      const {page_settings} = this.props
      const field_width = page_settings[KEY_FIELD_WIDTH_PX]
      const field_height = page_settings[KEY_FIELD_HEIGHT_PX]
      const min_dimension = Math.min(field_width - 20, field_height - 40)
      return Math.floor(min_dimension / IMAGE_SIZE_DELTA) * IMAGE_SIZE_DELTA
   }

   on_plan_complete = (canvas_buffer, ctx) => {
      const {on_settings_changed} = this.props
      let new_setings = {}
      new_setings[KEY_CANVAS_BUFFER] = canvas_buffer
      new_setings[KEY_CTX] = ctx
      new_setings[KEY_DISABLED] = false
      on_settings_changed(new_setings)
   }

   render() {
      const {image_ref} = this.state
      const {page_settings} = this.props
      const image_width = this.get_image_width()
      const field_width = page_settings[KEY_FIELD_WIDTH_PX]
      const field_height = page_settings[KEY_FIELD_HEIGHT_PX]
      return <styles.ImageWrapper
         ref={image_ref}
         onClick={this.on_click}
         onMouseMove={this.on_mousemove}
         onMouseLeave={this.on_mouseleave}
         style={{width: field_width, marginTop: ((field_height - image_width) / 2) - 5}}>
         <FractoRasterImage
            width_px={image_width}
            scope={page_settings[KEY_SCOPE]}
            focal_point={page_settings[KEY_FOCAL_POINT]}
            aspect_ratio={1.0}
            on_plan_complete={this.on_plan_complete}
         />
      </styles.ImageWrapper>
   }
}

export default FieldImage
