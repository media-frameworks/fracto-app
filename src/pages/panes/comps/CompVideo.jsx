import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'

import {render_comp_modes} from "./CompUtils";
import {
   KEY_VIDEO_MODE,
   VIDEO_MODE_CAPTURE_FIELD,
   VIDEO_MODE_GALLERY,
   VIDEO_MODE_STAGING
} from "pages/settings/VideoSettings";
import VideoCaptureField from "./video/VideoCaptureField";
import VideoStaging from "./video/VideoStaging";
import VideoGallery from "./video/VideoGallery";

const VIDEO_MODES = [
   {key: VIDEO_MODE_CAPTURE_FIELD, label: 'capture'},
   {key: VIDEO_MODE_STAGING, label: 'staging'},
   {key: VIDEO_MODE_GALLERY, label: 'gallery'},
]

export class CompVideo extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render_video_mode = () => {
      const {page_settings, on_settings_changed} = this.props
      return render_comp_modes(
         VIDEO_MODES, KEY_VIDEO_MODE, page_settings, on_settings_changed)
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      let content = []
      switch (page_settings[KEY_VIDEO_MODE]) {
         case VIDEO_MODE_CAPTURE_FIELD:
            content = <VideoCaptureField
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         case VIDEO_MODE_STAGING:
            content = <VideoStaging
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         case VIDEO_MODE_GALLERY:
            content = <VideoGallery
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break
         default:
            content = page_settings[KEY_VIDEO_MODE]
            break
      }
      const modes = this.render_video_mode()
      return <styles.ContentWrapper>
         {modes}{content}
      </styles.ContentWrapper>
   }
}

export default CompVideo
