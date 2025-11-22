import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_CLIENT_POINT, KEY_CROSSHAIRS_ANGLE,
   KEY_DISABLED,
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
   KEY_IMAGE_BOUNDS
} from "pages/settings/AppSettings";
import FieldUtils from "./FieldUtils";
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
   KEY_FIELDS_PROFILES
} from "../../settings/PaneSettings";

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
      const hover_point = page_settings[KEY_HOVER_POINT]
      const angle = page_settings[KEY_CROSSHAIRS_ANGLE]
      let client_point = page_settings[KEY_CLIENT_POINT]
      const in_bold = page_settings[KEY_FIELDS_PROFILES] && !hover_point
      if (in_bold) {
         client_point = {
            x: image_bounds.x + image_bounds.width / 2,
            y: image_bounds.y + image_bounds.height / 2,
         }
      }
      return FieldUtils.render_cross_hairs(
         image_bounds,
         client_point,
         this.on_click,
         hover_point ? 0 : angle,
         in_bold)
   }
}

export default FieldCrossHairs
