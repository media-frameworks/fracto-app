export const TYPE_STRING = typeof 'abc'
export const TYPE_NUMBER = typeof 123
export const TYPE_OBJECT = typeof {abc: 123}
export const TYPE_ARRAY = typeof ['abc', 123]
export const TYPE_BOOLEAN = typeof true

export const KEY_FOCAL_POINT = 'focal_point'
export const KEY_SCOPE = 'scope'
export const KEY_DISABLED = 'disabled'
export const KEY_CANVAS_BUFFER = 'canvas_buffer'
export const KEY_CTX = 'ctx'
export const KEY_HOVER_POINT = 'hover_point'
export const KEY_CLIENT_POINT = 'client_point'
export const KEY_STEPS_ZOOM = 'steps_zoom'
export const KEY_BAD_TILES = 'bad_tiles'
export const KEY_CACHE_SIZE = 'cache_size'
export const KEY_UPDATE_INDEX = 'update_index'
export const KEY_MODAL = 'modal'
export const KEY_AUTOMATION_SCALAR_MS = 'automation_scalar_ms'
export const KEY_FIELD_CROSSHAIRS = 'field_crosshairs'
export const KEY_FIELD_COVERAGE = 'field_coverage'
export const KEY_IMAGE_BOUNDS = 'image_bounds'
export const KEY_LOCATE_CENTER = 'locate_center'
export const KEY_CROSSHAIRS_ANGLE = 'crosshairs_angle'

export const APP_KEYED_SETTINGS = {
   [KEY_FOCAL_POINT]: {
      data_type: TYPE_OBJECT,
      default_value: {x: 0, y: 0},
      description: 'center point of main frame rendering',
      persist: true,
   },
   [KEY_SCOPE]: {
      data_type: TYPE_NUMBER,
      default_value: 3.0,
      description: 'extent of main frame rendering area',
      persist: true,
   },
   [KEY_DISABLED]: {
      data_type: TYPE_NUMBER,
      default_value: 3.0,
      description: 'readiness semaphor while processing',
      persist: false,
   },
   [KEY_CANVAS_BUFFER]: {
      data_type: TYPE_ARRAY,
      default_value: null,
      description: 'buffer containing all frame data',
      persist: false,
   },
   [KEY_CTX]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'device context of main frame canvas',
      persist: false,
   },
   [KEY_HOVER_POINT]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'live position of cursor over main frame, in image coordinates',
      persist: false,
   },
   [KEY_CLIENT_POINT]: {
      data_type: TYPE_OBJECT,
      default_value: {x: -1, y: -1},
      description: 'live position of cursor over main frame, in client coordinates',
      persist: false,
   },
   [KEY_STEPS_ZOOM]: {
      data_type: TYPE_NUMBER,
      default_value: 2.0,
      description: 'user-selected zoom factor for the steps pane',
      persist: true,
   },
   [KEY_BAD_TILES]: {
      data_type: TYPE_ARRAY,
      default_value: [],
      description: 'tiles that were not formatted properly',
      persist: false,
   },
   [KEY_CACHE_SIZE]: {
      data_type: TYPE_NUMBER,
      default_value: 0,
      description: 'the number of tiles currently cached for display',
      persist: false,
   },
   [KEY_UPDATE_INDEX]: {
      data_type: TYPE_NUMBER,
      default_value: 0,
      description: 'an ever-increasng number to trigger display updates',
      persist: false,
   },
   [KEY_MODAL]: {
      data_type: TYPE_ARRAY,
      default_value: null,
      description: 'modal popup instance to be opened and activated',
      persist: false,
   },
   [KEY_AUTOMATION_SCALAR_MS]: {
      data_type: TYPE_NUMBER,
      default_value: 500,
      description: 'the relative speed of animation of the orbital visualizations',
      persist: true,
   },
   [KEY_FIELD_CROSSHAIRS]: {
      data_type: TYPE_BOOLEAN,
      default_value: false,
      description: 'tells whether to temporarily use crosshairs on the main field',
      persist: false,
      debug: false,
   },
   [KEY_FIELD_COVERAGE]: {
      data_type: TYPE_ARRAY,
      default_value: [],
      description: 'the number of tiles available for a given frame of field',
      persist: false,
   },
   [KEY_IMAGE_BOUNDS]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'the bounding rectangle of the field image, in screen coordinates',
      persist: false,
   },
   [KEY_LOCATE_CENTER]: {
      data_type: TYPE_BOOLEAN,
      default_value: false,
      description: 'displays crosshairs in the exact center of the main field',
      persist: false,
   },
   [KEY_CROSSHAIRS_ANGLE]: {
      data_type: TYPE_NUMBER,
      default_value: 0,
      description: 'displays crosshairs at an angle from -90 to +90',
      persist: false,
   },
}