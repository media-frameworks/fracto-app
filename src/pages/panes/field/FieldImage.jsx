import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FractoRasterImage, {BAD_TILES} from "fracto/FractoRasterImage";
import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'
import {HEADER_HEIGHT_PX} from "styles/PaneStepsStyles";
import {CACHED_TILES} from "fracto/FractoTileCache";

import {
   KEY_FOCAL_POINT,
   KEY_SCOPE,
   KEY_CANVAS_BUFFER,
   KEY_CTX,
   KEY_DISABLED,
   KEY_BAD_TILES,
   KEY_HOVER_POINT,
   KEY_CACHE_SIZE,
   KEY_UPDATE_INDEX,
   KEY_FIELD_CROSSHAIRS,
   KEY_CLIENT_POINT, KEY_IMAGE_BOUNDS,
} from "settings/AppSettings";
import {
   KEY_FIELD_WIDTH_PX,
   KEY_FIELD_HEIGHT_PX,
} from 'settings/PaneSettings'
import {
   KEY_IMAGE_WIDTH,
   KEY_COLORATION_TYPE,
   KEY_COLOR_PHASE
} from 'settings/CompSettings'
import FractoUtil from "fracto/FractoUtil";
import {COLORS_EXTERNAL} from "../comps/CompColors";
import {CoolDropdown} from "common/ui/CoolImports";
import FieldContextMenu from "./FieldContextMenu";
import FieldCrossHairs from "./FieldCrossHairs";

const IMAGE_SIZE_DELTA = 50
const ZOOM_FACTOR = 1.5
const ZOOM_FACTOR_MINOR = 1.5
const ZOOM_FACTOR_MAJOR = 3.0

export class FieldImage extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      image_ref: React.createRef(),
      main_field_ref: React.createRef(),
      context_menu_client_pos: {},
   }

   componentDidMount() {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_UPDATE_INDEX]: 0,})
      window.addEventListener('keydown', this.key_listener)
   }

   componentWillUnmount() {
      window.removeEventListener('keydown', this.key_listener)
   }

   key_listener = (e) => {
      const {page_settings, on_settings_changed} = this.props
      // console.log('key_listener', e)
      if (e.code === 'Escape') {
         on_settings_changed({[KEY_SCOPE]: page_settings[KEY_SCOPE] * 1.618})
      }
   }

   get_mouse_pos = (e) => {
      const {image_ref} = this.state
      const {page_settings} = this.props
      const focal_point = page_settings[KEY_FOCAL_POINT]
      const scope = page_settings[KEY_SCOPE]
      const inspector_bounds = {
         left: focal_point.x - scope / 2, top: focal_point.y + scope / 2,
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
      return {x: x, y: y, clientX: e.clientX, clientY: e.clientY, image_bounds: bounds}
   }

   on_mousemove = (e) => {
      const {on_settings_changed} = this.props
      const location = this.get_mouse_pos(e)
      setTimeout(() => {
         on_settings_changed({
            [KEY_HOVER_POINT]: {x: location.x, y: location.y},
            [KEY_CLIENT_POINT]: {x: location.clientX, y: location.clientY},
            [KEY_FIELD_CROSSHAIRS]: true,
            [KEY_IMAGE_BOUNDS]: JSON.parse(JSON.stringify(location.image_bounds)),
         })
      }, 10)
   }

   client_click = (e) => {
      const {image_ref} = this.state
      const container_bounds = image_ref.current.getBoundingClientRect()
      const x = Math.floor(e.clientX - container_bounds.left)
      const y = Math.floor(e.clientY - container_bounds.top)
      return {x, y, container_bounds, clientX: e.clientX, clientY: e.clientY}
   }

   on_click = (e) => {
      const {page_settings, on_settings_changed} = this.props
      const {focal_point, scope, disabled} = page_settings
      if (disabled) {
         return
      }
      const client_click = this.client_click(e)
      const leftmost = focal_point.x - scope / 2
      const topmost = focal_point.y + scope / 2
      const increment = scope / client_click.container_bounds.width
      let settings = {[KEY_DISABLED]: true}
      settings[KEY_FOCAL_POINT] = {
         x: leftmost + increment * client_click.x, y: topmost - increment * client_click.y,
      }
      if (e.ctrlKey) {
         settings[KEY_SCOPE] = page_settings[KEY_SCOPE] / ZOOM_FACTOR
      }
      on_settings_changed(settings)
   }

   on_context_menu = (e) => {
      const {page_settings} = this.props
      const {disabled} = page_settings
      e.preventDefault()
      if (disabled) {
         this.setState({context_menu_client_pos: null})
         return
      }
      const context_menu_client_pos = this.client_click(e)
      this.setState({context_menu_client_pos})
   }

   on_wheel = (e) => {
      const {page_settings, on_settings_changed} = this.props
      const {scope, disabled} = page_settings
      if (disabled) {
         return;
      }
      let settings = {[KEY_DISABLED]: true}
      let zoom_factor = e.shiftKey ? ZOOM_FACTOR_MAJOR : ZOOM_FACTOR
      if (e.altKey) {
         zoom_factor = ZOOM_FACTOR_MINOR
      }
      if (e.deltaY > 0) {
         settings[KEY_SCOPE] = scope * zoom_factor
      } else {
         settings[KEY_SCOPE] = scope / zoom_factor
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
      const {page_settings, on_settings_changed} = this.props
      on_settings_changed({
         [KEY_CANVAS_BUFFER]: canvas_buffer,
         [KEY_CTX]: ctx,
         [KEY_DISABLED]: false,
         [KEY_BAD_TILES]: Object.keys(BAD_TILES).length,
         [KEY_CACHE_SIZE]: Object.keys(CACHED_TILES).length,
         [KEY_UPDATE_INDEX]: 1 + page_settings[KEY_UPDATE_INDEX] || 0,
         [KEY_IMAGE_WIDTH]: this.get_image_width(),
      })
   }

   color_handler = (pattern, iterations) => {
      const {page_settings} = this.props
      if (page_settings[KEY_COLORATION_TYPE] !== COLORS_EXTERNAL) {
         const [h, s, l] = FractoUtil.fracto_pattern_color_hsl(pattern, iterations)
         const offset = page_settings[KEY_COLOR_PHASE]
            ? page_settings[KEY_COLOR_PHASE] : 0
         return [h + offset, s, l]
      } else {
         if (pattern > 0) {
            return [0, 0, 0]
         }
         const log_iterations = Math.log(iterations)
         return [12 + 112 * log_iterations, 1 + 2 * log_iterations, 1 + 15 * log_iterations]
      }
   }

   on_context_menu_select = (code) => {
      console.log('on_context_menu', code)
      this.setState({context_menu_client_pos: null})
   }

   render() {
      const {image_ref, main_field_ref, context_menu_client_pos} = this.state
      const {page_settings, on_settings_changed} = this.props
      const {focal_point, scope, disabled} = page_settings
      const image_width = this.get_image_width()
      const field_width = page_settings[KEY_FIELD_WIDTH_PX]
      const field_height = page_settings[KEY_FIELD_HEIGHT_PX] - HEADER_HEIGHT_PX
      // console.log('update_index', update_index)
      const context_menu = context_menu_client_pos ?
         <CoolDropdown
            items={FieldContextMenu.get_menu_items(page_settings)}
            reference_rect={{top: context_menu_client_pos.clientY, left: context_menu_client_pos.clientX}}
            callback={this.on_context_menu_select}
         /> : []
      const crosshairs = page_settings[KEY_FIELD_CROSSHAIRS]
         ? <FieldCrossHairs
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>
         : ''
      return [
         <styles.FieldWrapper
            key={'field-wrapper'}
            ref={main_field_ref}
            style={{width: field_width, height: field_height}}>
            <styles.ImageWrapper
               ref={image_ref}
               onClick={this.on_click}
               onContextMenu={this.on_context_menu}
               onMouseMove={this.on_mousemove}
               onWheel={this.on_wheel}
               style={{width: image_width, marginTop: (field_height - image_width) / 2}}>
               <FractoRasterImage
                  width_px={image_width}
                  scope={scope}
                  focal_point={focal_point}
                  aspect_ratio={1.0}
                  on_plan_complete={this.on_plan_complete}
                  disabled={disabled}
                  color_handler={this.color_handler}
                  update_counter={page_settings[KEY_UPDATE_INDEX]}
               />
            </styles.ImageWrapper>
         </styles.FieldWrapper>,
         context_menu,
         crosshairs,
      ]
   }
}

export default FieldImage
