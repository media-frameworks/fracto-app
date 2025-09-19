import {TYPE_ARRAY, TYPE_NUMBER, TYPE_STRING} from "./AppSettings";

export const KEY_IMAGE_MODE = 'image_mode'
export const KEY_IMAGE_INTERIOR_HUE_MAPPING = 'image_interior_hue_mapping'
export const KEY_IMAGE_INTERIOR_LUM_MAPPING = 'image_interior_lum_mapping'
export const KEY_IMAGE_EXTERIOR_COLOR_MAPPING = 'image_exterior_color_mapping'
export const KEY_IMAGE_EXTERIOR_COLOR_MAPPING_PHASE = 'image_exterior_color_mapping_phase'
export const KEY_IMAGE_EXTERIOR_MAPPING_TYPE = 'image_exterior_mapping_type'
export const KEY_IMAGE_CAPTURE_DIMENSION_PX = 'image_capture_dimension_px'
export const KEY_IMAGE_CAPTURE_ASPECT_RATIO = 'image_capture_aspect_ratio'

// values for KEY_IMAGE_MODE
export const IMAGE_MODE_EXTERIOR = 'image_mode_exterior'
export const IMAGE_MODE_INTERIOR = 'image_mode_interior'
export const IMAGE_MODE_CAPTURE_FIELD = 'image_mode_capture_field'
export const IMAGE_MODE_GALLERY = 'image_mode_gallery'

// values for KEY_IMAGE_INTERIOR_HUE_MAPPING
export const IMAGE_HUE_BY_CARDINALITY = 'hue_by_cardinality'
export const IMAGE_HUE_BY_CYCLES = 'hue_by_cycles'

// values for KEY_IMAGE_INTERIOR_LUM_MAPPING
export const IMAGE_LUM_BY_ITERATIONS = 'lum_by_iterations'
export const IMAGE_LUM_BY_MAGNITUDE = 'lum_by_magnitude'

// values for KEY_IMAGE_EXTERIOR_MAPPING_TYPE
export const IMAGE_EXTERIOR_MAPPING_LINEAR = 'exterior_mapping_linear'
export const IMAGE_EXTERIOR_MAPPING_CIRCULAR = 'exterior_mapping_circular'

export const IMAGE_KEYED_SETTINGS = {
   [KEY_IMAGE_MODE]: {
      data_type: TYPE_STRING,
      default_value: IMAGE_MODE_INTERIOR,
      description: 'mode of rendering for images, interior or exterior',
      persist: true,
   },
   [KEY_IMAGE_INTERIOR_HUE_MAPPING]: {
      data_type: TYPE_STRING,
      default_value: IMAGE_HUE_BY_CARDINALITY,
      description: 'mode of rendering hues in interiors, by orbital cardinality or cycles',
      persist: false,
   },
   [KEY_IMAGE_INTERIOR_LUM_MAPPING]: {
      data_type: TYPE_STRING,
      default_value: IMAGE_LUM_BY_ITERATIONS,
      description: 'mode of rendering luminence in interiors, by iterations or orbital magnitude',
      persist: false,
   },
   [KEY_IMAGE_EXTERIOR_COLOR_MAPPING]: {
      data_type: TYPE_ARRAY,
      default_value: ['black', 'white'],
      description: 'mapping of exterior values, as an array of css color designations',
      persist: true,
   },
   [KEY_IMAGE_EXTERIOR_COLOR_MAPPING_PHASE]: {
      data_type: TYPE_NUMBER,
      default_value: 0.0,
      description: 'phase offset of the exterior color mapping, from 0.0 to 1.0',
      persist: true,
   },
   [KEY_IMAGE_EXTERIOR_MAPPING_TYPE]: {
      data_type: TYPE_STRING,
      default_value: IMAGE_EXTERIOR_MAPPING_LINEAR,
      description: 'the type of exterior color mapping, linear vs. circular',
      persist: true,
   },
   [KEY_IMAGE_CAPTURE_DIMENSION_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 1200,
      description: 'most recent image capture pixel count, aspect ratio fixes dimensions',
      persist: true,
   },
   [KEY_IMAGE_CAPTURE_ASPECT_RATIO]: {
      data_type: TYPE_NUMBER,
      default_value: 1.0,
      description: 'proportion of width / height in a captured image, results may vary with rounding',
      persist: true,
   },
}
