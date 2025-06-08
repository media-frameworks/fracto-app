import {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'
import {
   KEY_CLIENT_POINT,
   KEY_DISABLED,
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT, KEY_IMAGE_BOUNDS
} from "settings/AppSettings";

export class FieldCrossHairs extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   on_click = () => {
      const {page_settings, on_settings_changed} = this.props
      on_settings_changed({
         [KEY_FOCAL_POINT]: JSON.parse(JSON.stringify(page_settings[KEY_HOVER_POINT])),
         [KEY_DISABLED]: true
      })
   }

   render() {
      const {page_settings} = this.props;
      if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
         return []
      }
      if (page_settings[KEY_DISABLED]) {
         return []
      }
      const image_bounds = page_settings[KEY_IMAGE_BOUNDS]
      const horizontal_style = {
         top: `${page_settings[KEY_CLIENT_POINT].y || -1}px`,
         left: `${image_bounds.left - 3}px`,
         width: `${image_bounds.width + 5}px`,
      };
      const vertical_style = {
         left: `${page_settings[KEY_CLIENT_POINT].x || -1}px`,
         top: `${image_bounds.top - 3}px`,
         height: `${image_bounds.height + 5}px`,
      };
      return [
         <styles.HorizontalCrossHair
            key={'horizontal-crosshair'}
            style={horizontal_style}
            onClick={this.on_click}
         />,
         <styles.VerticalCrossHair
            key={'vertical-crosshair'}
            style={vertical_style}
            onClick={this.on_click}
         />
      ]
   }
}

export default FieldCrossHairs
