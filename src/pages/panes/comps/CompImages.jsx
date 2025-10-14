import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import {
   IMAGE_MODE_CAPTURE_FIELD,
   IMAGE_MODE_GALLERY,
   IMAGE_MODE_STAGING,
   KEY_IMAGE_MODE
} from "pages/settings/ImageSettings";
import ImagesCaptureField from "./images/ImagesCaptureField";
import ImagesStaging from "./images/ImagesStaging";
import {render_comp_modes} from "./CompUtils";

const IMAGE_MODES = [
   {key: IMAGE_MODE_CAPTURE_FIELD, label: 'capture'},
   {key: IMAGE_MODE_STAGING, label: 'staging'},
   {key: IMAGE_MODE_GALLERY, label: 'gallery'},
]

export class CompImages extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   set_image_mode = (image_mode) => {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_IMAGE_MODE]: image_mode})
   }

   render_image_mode = () => {
      const {page_settings, on_settings_changed} = this.props
      const all_modes = render_comp_modes(
         IMAGE_MODES, KEY_IMAGE_MODE, page_settings, on_settings_changed)
      return <styles.CenteredBlock>
         {all_modes}
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      let content = []
      switch (page_settings[KEY_IMAGE_MODE]) {
         case IMAGE_MODE_CAPTURE_FIELD:
            content = <ImagesCaptureField
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         case IMAGE_MODE_STAGING:
            content = <ImagesStaging
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         default:
            content = page_settings[KEY_IMAGE_MODE]
            break
      }
      const modes = this.render_image_mode()
      return [
         <styles.ContentWrapper>{modes}</styles.ContentWrapper>,
         <styles.ImageFieldWrapper>{content}</styles.ImageFieldWrapper>
      ]
   }
}

export default CompImages
