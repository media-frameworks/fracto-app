import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CoolStyles from "common/ui/styles/CoolStyles";
import {CoolSelect} from "common/ui/CoolImports";
import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import {
   get_tiles,
   GET_TILES_FROM_CACHE,
   FILLING_CANVAS_BUFFER,
} from "fracto/FractoTileData";
import {
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import {render_image} from "./ImageUtils";
import ImagesHeatMap from "./ImagesHeatMap";
import {KEY_IMAGE_CAPTURE_DIMENSION_PX} from "pages/settings/ImageSettings";
import PageSettings from "pages/PageSettings";

const RESOLUTIONS = [
   {label: '150', value: 150, help: 'thumbnail',},
   {label: '300', value: 300, help: 'tiny',},
   {label: '600', value: 600, help: 'small',},
   {label: '1200', value: 1200, help: 'medium',},
   {label: '1800', value: 1800, help: 'large',},
   {label: '2400', value: 2400, help: 'super',},
   {label: '3200', value: 3200, help: 'biggest',},
   {label: '3600', value: 3600, help: 'biggest!',},
   {label: '4200', value: 4200, help: 'biggest!!',},
   {label: '4800', value: 4800, help: 'biggest!!!',},
]

export class ImagesCaptureField extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      coverage: 'calculating...',
      current_size: 1200,
      current_focal_point: {},
      current_scope: 0,
      image_outcome: {},
      image_status: {},
      stored_values: {},
   }

   componentDidMount() {
      const {page_settings} = this.props
      this.initialize(page_settings[KEY_IMAGE_CAPTURE_DIMENSION_PX])
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {stored_values} = this.state
      const {page_settings} = this.props
      const current_size = page_settings[KEY_IMAGE_CAPTURE_DIMENSION_PX]
      const size_changes = current_size !== prevState.current_size
      const settings_changed = PageSettings.test_update_settings(
         [
            KEY_SCOPE,
            KEY_FOCAL_POINT,
            KEY_HOVER_POINT,
         ], page_settings, stored_values)
      if (settings_changed || size_changes) {
         this.initialize(current_size)
      }
   }

   initialize = (current_size) => {
      const {page_settings} = this.props
      const current_focal_point = page_settings[KEY_FOCAL_POINT]
      const current_scope = page_settings[KEY_SCOPE]
      const coverage_data = get_tiles(
         current_size,
         current_focal_point,
         current_scope,
         1.0)
      const coverage = coverage_data
         .filter((item) => item.level_tiles.length > current_size / 25)
         .sort((a, b) => b.level - a.level)
         .slice(0, 8)
         .map((item) => {
            return `${item.level}:${item.level_tiles.length}`
         })
      const coverage_str = coverage.join(', ')
      this.setState({
         coverage: coverage_str,
         current_focal_point,
         current_scope,
         current_size,
         image_outcome: {}
      })
      console.log('initialize current_size', current_size)
   }

   change_resolution = (e) => {
      const {on_settings_changed} = this.props
      console.log('change_resolution', e.target.value)
      const current_size = parseInt(e.target.value)
      on_settings_changed({[KEY_IMAGE_CAPTURE_DIMENSION_PX]: current_size})
      this.initialize(current_size)
   }

   update_callback = (image_status) => {
      setTimeout(() => {
         this.setState({image_status})
      }, 50)
   }

   render_now = () => {
      const {current_focal_point, current_scope, current_size} = this.state
      this.setState({image_outcome: {}})
      setTimeout(async () => {
         // console.log('render_now response', response.data)
         const image_outcome = await render_image(
            current_focal_point, current_scope, current_size, 'images', this.update_callback)
         console.log('image_outcome', image_outcome)
         this.setState({image_outcome: image_outcome.data})
      }, 500)
   }

   render() {
      const {coverage, current_size, image_outcome, image_status} = this.state
      const {page_settings, on_settings_changed} = this.props
      const image = image_outcome.public_url
         ? <img src={image_outcome.public_url} alt={'copyright 2025 Fracto Inc'}/>
         : []
      const tile_cache_status = image_status[GET_TILES_FROM_CACHE]
      const tile_cache_status_str = `get tiles: ${tile_cache_status ? Math.round(tile_cache_status * 10000) / 100 : 0}%`
      const canvas_buffer_status = image_status[FILLING_CANVAS_BUFFER]
      const canvas_buffer_status_str = `filling buffer: ${canvas_buffer_status ? Math.round(canvas_buffer_status * 10000) / 100 : 0}%`
      const status = tile_cache_status ? [
         tile_cache_status_str,
         canvas_buffer_status_str].join(', ') : ''
      const image_heat_map = !image_outcome.public_url
         ? <ImagesHeatMap
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>
         : []
      return [
         <styles.Spacer/>,
         <CoolSelect
            options={RESOLUTIONS}
            value={current_size}
            on_change={this.change_resolution}
         />,
         <styles.Spacer/>,
         `coverage is ${coverage}`,
         <styles.Spacer/>,
         <CoolStyles.LinkSpan onClick={this.render_now}>render now</CoolStyles.LinkSpan>,
         <styles.StatusLine>{status}</styles.StatusLine>,
         image_heat_map,
         image
      ]
   }
}

export default ImagesCaptureField
