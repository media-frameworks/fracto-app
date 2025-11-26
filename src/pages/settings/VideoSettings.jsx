import {TYPE_STRING} from "./AppSettings";

export const KEY_VIDEO_MODE = 'video_mode'
export const KEY_VIDEO_CAPTURE_DIMENSION_PX = 'video_capture_dimension_px'

// values for KEY_IMAGE_MODE
export const VIDEO_MODE_CAPTURE_FIELD = 'video_mode_capture_field'
export const VIDEO_MODE_STAGING = 'video_mode_staging'
export const VIDEO_MODE_GALLERY = 'video_mode_gallery'

export const VIDEO_KEYED_SETTINGS = {
   [KEY_VIDEO_MODE]: {
      data_type: TYPE_STRING,
      default_value: VIDEO_MODE_CAPTURE_FIELD,
      description: 'mode of rendering for video',
      persist: true,
   },
   [KEY_VIDEO_CAPTURE_DIMENSION_PX]: {
      data_type: TYPE_STRING,
      default_value: 0,
      description: 'dimension of video to be captured',
      persist: true,
   },
}
