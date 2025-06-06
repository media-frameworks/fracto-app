import {Component} from 'react';
import PropTypes from 'prop-types';

import {CoolStyles, CoolButton, CoolSelect} from "common/ui/CoolImports";
import {NumberSpan} from "fracto/styles/FractoStyles";
import {CompAdminStyles as styles} from 'styles/CompAdminStyles'

import FractoUtil from "fracto/FractoUtil";
import FractoRasterImage, {get_tiles} from "fracto/FractoRasterImage";
import {COLORS_EXTERNAL} from "./CompColors";

import {
   KEY_FOCAL_POINT, KEY_SCOPE
} from "settings/AppSettings";
import {
   KEY_COLORATION_TYPE, KEY_COLOR_PHASE
} from 'settings/CompSettings'

const RESOLUTIONS = [
   {label: '150', value: 150, help: 'thumbnail',},
   {label: '300', value: 300, help: 'snapshot',},
   {label: '600', value: 600, help: 'tiny',},
   {label: '1600', value: 1600, help: 'small',},
   {label: '2400', value: 2400, help: 'medium',},
   {label: '3200', value: 3200, help: 'large',},
]

export class CompCapture extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      current_image: null,
      current_size: 2400,
   }

   take_snapshot = () => {
      const {page_settings} = this.props
      console.log('snap!')
      this.setState({
         current_image: {
            focal_point: page_settings[KEY_FOCAL_POINT],
            scope: page_settings[KEY_SCOPE]
         }
      })
   }

   change_resolution = (e) => {
      console.log('change_resolution', e.target.value)
      this.setState({
         current_size: e.target.value,
         current_image: null,
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

   render() {
      const {current_image, current_size} = this.state
      const {page_settings} = this.props
      const image = current_image
         ? <CoolStyles.Block>
            <FractoRasterImage
               width_px={current_size}
               focal_point={current_image.focal_point}
               scope={current_image.scope}
               color_handler={this.color_handler}
            />
         </CoolStyles.Block>
         : []
      const coverage_data = get_tiles(
         current_size,
         page_settings[KEY_FOCAL_POINT],
         page_settings[KEY_SCOPE],
         1.0)
      // console.log('coverage_data', coverage_data)
      const coverage_str = coverage_data
         .sort((a, b) => b.level - a.level)
         .slice(0, 8)
         .map((item) => {
            return `${item.level}:${item.level_tiles.length}`
         }).join(', ')
      return <styles.ContentWrapper style={{overflow: 'auto'}}>
         <CoolButton
            content={'When you have adjusted the view to your liking, click here'}
            on_click={this.take_snapshot}
         />
         <CoolSelect
            options={RESOLUTIONS}
            value={current_size}
            on_change={this.change_resolution}
         />
         <CoolStyles.Block><NumberSpan>{coverage_str}</NumberSpan></CoolStyles.Block>
         {image}
      </styles.ContentWrapper>
   }
}

export default CompCapture
