import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import {
   IMAGE_MODE_CAPTURE_FIELD,
   IMAGE_MODE_EXTERIOR,
   IMAGE_MODE_INTERIOR,
   KEY_IMAGE_MODE
} from "settings/ImageSettings";
import ImagesInteriorMode from "./images/ImagesInteriorMode";
import ImagesExteriorMode from "./images/ImagesExteriorMode";
import ImagesCaptureField from "./images/ImagesCaptureField";

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
      const {page_settings} = this.props
      const image_mode = page_settings[KEY_IMAGE_MODE] || IMAGE_MODE_INTERIOR
      const deselected_style = {color: '#aaaaaa', fontWeight: 400}
      const all_modes = [
         {key: IMAGE_MODE_INTERIOR, label: 'interior mode'},
         {key: IMAGE_MODE_EXTERIOR, label: 'exterior mode'},
         {key: IMAGE_MODE_CAPTURE_FIELD, label: 'capture field'},
      ].map(mode => {
         return [
            <input
               type={"radio"}
               checked={image_mode === mode.key}
               onClick={() => this.set_image_mode(mode.key)}
            />,
            <styles.PatternTypePrompt
               style={image_mode !== mode.key ? deselected_style : {}}
               onClick={() => this.set_image_mode(mode.key)}>
               {mode.label}
            </styles.PatternTypePrompt>,
            <styles.Spacer/>
         ]
      })
      return <styles.CenteredBlock>
         {all_modes}
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      let content = []
      switch (page_settings[KEY_IMAGE_MODE]) {
         case IMAGE_MODE_INTERIOR:
            content = <ImagesInteriorMode
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         case IMAGE_MODE_EXTERIOR:
            content = <ImagesExteriorMode
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         case IMAGE_MODE_CAPTURE_FIELD:
            content = <ImagesCaptureField
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         default:
            content = page_settings[KEY_IMAGE_MODE]
            break
      }
      return <styles.ContentWrapper>
         {this.render_image_mode()}
         {content}
      </styles.ContentWrapper>

   }
}

export default CompImages
