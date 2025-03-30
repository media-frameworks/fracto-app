export const KEY_STEPS_WIDTH_PX = 'steps_width_px'
export const KEY_STEPS_HEIGHT_PX = 'steps_height_px'
export const KEY_FIELD_WIDTH_PX = 'field_width_px'
export const KEY_FIELD_HEIGHT_PX = 'field_height_px'
export const KEY_COMPS_WIDTH_PX = 'comps_width_px'
export const KEY_COMPS_HEIGHT_PX = 'comps_height_px'
export const KEY_LEGEND_WIDTH_PX = 'legend_width_px'
export const KEY_LEGEND_HEIGHT_PX = 'legend_height_px'
export const KEY_IMAGE_WIDTH = 'image_width'
export const KEY_LIT_TYPE = 'lit_type'
export const KEY_MINIBROT_SORT_TYPE = 'minibrot_sort_type'
export const KEY_SCRIPT_TREE_WIDTH_PX = 'script_tree_width_px'
export const KEY_SCRIPT_TREE_HEIGHT_PX = 'script_tree_height_px'
export const KEY_SCRIPT_TREE_EXPANDED = 'script_tree_expanded'
export const KEY_SCRIPT_TREE_SELECTED = 'script_tree_selected'

export const KEY_FOCAL_POINT = 'focal_point'
export const KEY_SCOPE = 'scope'
export const KEY_DISABLED = 'disabled'
export const KEY_CANVAS_BUFFER = 'canvas_buffer'
export const KEY_CTX = 'ctx'
export const KEY_HOVER_POINT = 'hover_point'
export const KEY_IMG_X = 'img_x'
export const KEY_IMG_Y = 'img_y'
export const KEY_STEPS_ZOOM = 'steps_zoom'

export const KEY_BAILIWICK_ID = 'bailiwick_id'
export const KEY_HIGHLIGHTS = 'highlights'
export const KEY_BAD_TILES = 'bad_tiles'
export const KEY_CACHE_SIZE = 'cache_size'
export const KEY_UPDATE_INDEX = 'update_index'
export const KEY_IN_ANIMATION = 'in_animation'
export const KEY_MODAL = 'modal'
export const KEY_COLOR_PHASE = 'color_phase'

export const ALL_PANE_DIMENSIONS = [
   KEY_STEPS_WIDTH_PX,
   KEY_STEPS_HEIGHT_PX,
   KEY_FIELD_WIDTH_PX,
   KEY_FIELD_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
   KEY_COMPS_HEIGHT_PX,
   KEY_LEGEND_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX,
   KEY_IMAGE_WIDTH,
   KEY_SCRIPT_TREE_WIDTH_PX,
   KEY_SCRIPT_TREE_HEIGHT_PX,
]

export const ALL_OPERATIVES = [
   KEY_FOCAL_POINT,
   KEY_SCOPE,
   KEY_DISABLED,
   KEY_HOVER_POINT,
   KEY_CTX,
   KEY_CANVAS_BUFFER,
   KEY_IMG_X,
   KEY_IMG_Y,
   KEY_BAD_TILES,
   KEY_CACHE_SIZE,
   KEY_STEPS_ZOOM,
   KEY_UPDATE_INDEX,
   KEY_LIT_TYPE,
   KEY_MODAL,
   KEY_COLOR_PHASE,
   KEY_BAILIWICK_ID,
   KEY_MINIBROT_SORT_TYPE,
   KEY_SCRIPT_TREE_SELECTED,
   KEY_SCRIPT_TREE_EXPANDED,
]

export const TYPE_STRING = typeof 'abc'
export const TYPE_NUMBER = typeof 123
export const TYPE_OBJECT = typeof {abc: 123}
export const TYPE_ARRAY = typeof ['abc', 123]

export const PERSIST_KEYS_MAP = {
   [KEY_SCOPE]: TYPE_STRING,
   [KEY_FOCAL_POINT]: TYPE_OBJECT,
   [KEY_SCRIPT_TREE_WIDTH_PX]: TYPE_NUMBER,
   [KEY_SCRIPT_TREE_HEIGHT_PX]: TYPE_NUMBER,
   [KEY_MINIBROT_SORT_TYPE]: TYPE_STRING,
   [KEY_STEPS_ZOOM]: TYPE_NUMBER,
   [KEY_LIT_TYPE]: TYPE_STRING,
   [KEY_SCRIPT_TREE_SELECTED]: TYPE_ARRAY,
   [KEY_SCRIPT_TREE_EXPANDED]: TYPE_ARRAY,
}

export class PageSettings {

}
