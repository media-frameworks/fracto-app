import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_CLIENT_POINT,
   KEY_DISABLED,
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT, KEY_IMAGE_BOUNDS
} from "pages/settings/AppSettings";
import FieldUtils from "./FieldUtils";

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
      return FieldUtils.render_cross_hairs(
         image_bounds, page_settings[KEY_CLIENT_POINT], this.on_click)
   }
}

export default FieldCrossHairs
