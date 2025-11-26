import {
   TYPE_NUMBER,
   TYPE_STRING,
   TYPE_OBJECT,
   TYPE_ARRAY
} from "./AppSettings";
import {
   SORT_TYPE_BY_ORBITAL,
   SORT_TYPE_BY_SIZE
} from "../panes/comps/archive/CompMinibrot";
import {
   COLORS_INTERNAL,
   COLORS_EXTERNAL
} from "../panes/comps/archive/CompColors";
import {
   SCRIPT_VIEWER_MODE_TEXT,
   SCRIPT_VIEWER_MODE_UI
} from "../panes/comps/archive/scripts/ScriptsViewerBar";
import {PATTERN_TYPE_ORBITALS} from "../panes/comps/archive/CompPatterns";
import {ADMIN_TYPE_SETTINGS} from "../panes/comps/CompAdmin";
import {FIELDS_TYPE_SEPARATIONS} from "../panes/comps/CompFields";
import {FACTORY_TYPE_AUDITOR} from "../panes/comps/CompFactory";
import {AUDIT_NEW_TILES} from "../panes/comps/factory/FactoryAuditor";

export const KEY_IMAGE_WIDTH = 'image_width'
export const KEY_COLORATION_TYPE = 'coloration_type'
export const KEY_MINIBROT_SORT_TYPE = 'minibrot_sort_type'
export const KEY_BAILIWICK_ID = 'bailiwick_id'
export const KEY_COLOR_PHASE = 'color_phase'
export const KEY_PATTERN_TYPE = 'pattern_type'
export const KEY_ADMIN_TYPE = 'admin_type'
export const KEY_FIELDS_TYPE = 'fields_type'
export const KEY_FACTORY_TYPE = 'key_factory_type'

export const KEY_SCRIPT_TREE_WIDTH_PX = 'script_tree_width_px'
export const KEY_SCRIPT_TREE_HEIGHT_PX = 'script_tree_height_px'
export const KEY_SCRIPT_TREE_EXPANDED = 'script_tree_expanded'
export const KEY_SCRIPT_TREE_SELECTED = 'script_tree_selected'
export const KEY_SCRIPT_SELECTED_NODE = 'script_selected_node'
export const KEY_SCRIPT_VIEWER_MODE = 'script_viewer_mode'
export const KEY_SELECTED_SCRIPT_DATA = 'selected_script_data'
export const KEY_SCRIPT_EXPANDED_KEYS = 'script_expanded_sets'
export const KEY_SCRIPT_SELECTED_KEYS = 'script_selected_sets'
export const KEY_SCRIPT_SELECTED_DATA = 'script_selected_data'

export const KEY_FACTORY_AUDIT_TYPE = 'factory_audit_type'

export const COMPONENT_CAPTURE = 'component_capture'
export const COMPONENT_BAILIWICKS = 'component_bailiwicks'
export const COMPONENT_COLORS = 'component_colors'
export const COMPONENT_SCRIPT = 'component_script'
export const COMPONENT_PATTERNS = 'component_patterns'
export const COMPONENT_FIELDS = 'component_fields'
export const COMPONENT_FACTORY = 'component_factory'

export const COMP_KEYED_SETTINGS = {
   [KEY_IMAGE_WIDTH]: {
      data_type: TYPE_NUMBER,
      default_value: 200,
      description: 'width of the captured image in pixels',
      component: COMPONENT_CAPTURE,
      persist: true,
   },
   [KEY_MINIBROT_SORT_TYPE]: {
      data_type: TYPE_STRING,
      default_value: SORT_TYPE_BY_SIZE,
      range: [SORT_TYPE_BY_SIZE, SORT_TYPE_BY_ORBITAL],
      description: 'preferred sorting of minibrots in the UI',
      component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_ID]: {
      data_type: TYPE_NUMBER,
      default_value: -1,
      description: 'identifier of the currently selected bailiwick',
      component: COMPONENT_BAILIWICKS,
      persist: false,
   },
   [KEY_COLORATION_TYPE]: {
      data_type: TYPE_STRING,
      default_value: COLORS_INTERNAL,
      range: [COLORS_INTERNAL, COLORS_EXTERNAL],
      description: 'coloration for the main frame and capture',
      component: COMPONENT_COLORS,
      persist: true,
   },
   [KEY_COLOR_PHASE]: {
      data_type: TYPE_NUMBER,
      default_value: 0,
      range: [0, 360],
      description: 'selected color phase offset angle (degrees)',
      component: COMPONENT_COLORS,
      persist: true,
   },
   [KEY_SCRIPT_TREE_WIDTH_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 200,
      range: [1, 1000],
      description: 'width of the scripts tree panel in pixels',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_TREE_HEIGHT_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 200,
      range: [1, 1000],
      description: 'height of the scripts tree panel in pixels',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_EXPANDED_KEYS]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'list of expanded keys in tree by script name',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_SELECTED_KEYS]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'list of selected keys in tree by script name',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_SELECTED_NODE]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'selected script tree node object',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_VIEWER_MODE]: {
      data_type: TYPE_STRING,
      default_value: SCRIPT_VIEWER_MODE_UI,
      range: [SCRIPT_VIEWER_MODE_TEXT, SCRIPT_VIEWER_MODE_UI],
      description: 'mode of viewing statements in the script component',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_TREE_EXPANDED]: {
      data_type: TYPE_ARRAY,
      default_value: ['base'],
      description: 'expanded keys of the script files tree control',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SCRIPT_TREE_SELECTED]: {
      data_type: TYPE_ARRAY,
      default_value: ['base'],
      description: 'selected keys of the script files tree control',
      component: COMPONENT_SCRIPT,
      persist: true,
   },
   [KEY_SELECTED_SCRIPT_DATA]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'JSON-encoded data of the currently selected script',
      component: COMPONENT_SCRIPT,
      persist: false,
   },
   [KEY_SCRIPT_SELECTED_DATA]: {
      data_type: TYPE_OBJECT,
      default_value: [],
      description: 'data selected in the UI for inspection and editing',
      component: COMPONENT_SCRIPT,
      persist: false,
   },
   [KEY_PATTERN_TYPE]: {
      data_type: TYPE_STRING,
      default_value: PATTERN_TYPE_ORBITALS,
      description: 'type of patterns chosen in the UI (orbitals or meridians)',
      component: COMPONENT_PATTERNS,
      persist: true,
   },
   [KEY_ADMIN_TYPE]: {
      data_type: TYPE_STRING,
      default_value: ADMIN_TYPE_SETTINGS,
      description: 'type of admin contents chosen in the UI (settings or inventory)',
      component: COMPONENT_PATTERNS,
      persist: true,
   },
   [KEY_FIELDS_TYPE]: {
      data_type: TYPE_STRING,
      default_value: FIELDS_TYPE_SEPARATIONS,
      description: 'type of fields contents chosen in the UI (separations or peofiles)',
      component: COMPONENT_FIELDS,
      persist: true,
   },
   [KEY_FACTORY_TYPE]: {
      data_type: TYPE_STRING,
      default_value: FACTORY_TYPE_AUDITOR,
      description: 'Type of factory interface (auditor or generator)',
      component: COMPONENT_FACTORY,
      persist: true,
   },
   [KEY_FACTORY_AUDIT_TYPE]: {
      data_type: TYPE_STRING,
      default_value: AUDIT_NEW_TILES,
      description: 'Type of factory audit (new or updated)',
      component: COMPONENT_FACTORY,
      persist: true,
   },
}
