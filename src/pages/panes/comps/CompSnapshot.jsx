import {Component} from 'react';
import PropTypes from 'prop-types';

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import {CoolButton, CoolSelect} from "common/ui/CoolImports";
import FractoRasterImage from "../../../fracto/FractoRasterImage";
import {KEY_FOCAL_POINT, KEY_SCOPE} from "../../PageSettings";
import CoolStyles from "../../../common/ui/styles/CoolStyles";

const RESOLUTIONS = [
   {label: '1200', value: 1200, help: 'small',},
   {label: '2400', value: 2400, help: 'medium',},
   {label: '3600', value: 3600, help: 'large',},
   {label: '4800', value: 4800, help: 'larger',},
]

export class CompSnapshot extends Component {
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

   render() {
      const {current_image, current_size} = this.state
      const image = current_image
         ? <CoolStyles.Block>
            <FractoRasterImage
               width_px={current_size}
               focal_point={current_image.focal_point}
               scope={current_image.scope}
            />
         </CoolStyles.Block>
         : []
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
         {image}
      </styles.ContentWrapper>
   }
}

export default CompSnapshot
