import {TYPE_NUMBER} from "../settings/AppSettings";
import {TYPE_STRING} from "../pages/PageSettings";

export const NODE_TYPE_FILE = 'node_type_file'
export const NODE_TYPE_COMMENT = 'node_type_comment'
export const NODE_TYPE_IMPORT = 'node_type_import'
export const NODE_TYPE_INPUT = 'node_type_input'
export const NODE_TYPE_DECLARE = 'node_type_declare'
export const NODE_TYPE_STEP = 'node_type_step'
export const NODE_TYPE_CALL = 'node_type_call'

export const KEY_TYPE_SCOPE = 'key_type_scope'
export const KEY_TYPE_FOCAL_POINT = 'key_type_focal_point'
export const KEY_TYPE_WIDTH_PX = 'key_width_px'
export const KEY_TYPE_HEIGHT_PX = 'key_height_px'
export const KEY_TYPE_SCRIPT_PATH = 'key_type_script_path'

// Script Node Types
export const SCRIPT_NODE_TYPES = {
   [NODE_TYPE_FILE]: {
      title: 'fracto-script file',
      title_plural: 'fracto-script files',
      icon: 'faGear',
      description: 'The highest-level context of a fracto script',
      listable: true,
   },
   [NODE_TYPE_COMMENT]: {
      title: 'comment',
      title_plural: 'comments',
      icon: 'faComment',
      description: 'Statements relevant to the current script context',
      listable: true,
   },
   [NODE_TYPE_IMPORT]: {
      title: 'import',
      title_plural: 'imports',
      icon: 'faCode',
      description: 'Script code and data imported from other files',
      listable: true,
   },
   [NODE_TYPE_INPUT]: {
      title: 'input',
      title_plural: 'inputs',
      icon: 'faArrowRight',
      description: 'Data passed into a script for processing',
      listable: true,
   },
   [NODE_TYPE_DECLARE]: {
      title: 'declare',
      title_plural: 'declares',
      icon: 'faBullhorn',
      description: 'Data specific to the operation of a script',
      listable: true,
   },
   [NODE_TYPE_STEP]: {
      title: 'step',
      title_plural: 'steps',
      icon: 'faPersonWalking',
      icon_plural: 'faShoePrints',
      description: 'One or more instructions with inputs to be run',
      listable: true,
   },
   [NODE_TYPE_CALL]: {
      title: 'call',
      title_plural: 'calls',
      icon: 'faCodeBranch',
      icon_plural: 'faCodeBranch',
      description: 'Synchronously invoke a script method with inputs',
      listable: true,
   },
}

// Script Key Types
export const SCRIPT_KEY_TYPES = {
   [KEY_TYPE_SCOPE]: {
      title: 'scope',
      title_plural: 'scopes',
      icon: 'faCropSimple',
      icon_plural: 'faCropSimple',
      description: 'The real value scope of a frame being rendered',
      format: TYPE_NUMBER,
      listable: true,
   },
   [KEY_TYPE_FOCAL_POINT]: {
      title: 'focal point',
      title_plural: 'focal points',
      icon: 'faCrosshairs',
      icon_plural: 'faCrosshairs',
      description: 'The complex-valued center point of a frame',
      format: TYPE_OBJECT,
      object_proto: {
         r: TYPE_NUMBER,
         i: TYPE_NUMBER,
      },
      listable: true,
   },
   [KEY_TYPE_WIDTH_PX]: {
      title: 'width_px',
      icon: 'faLeftRight',
      description: 'The width of a frame, in pixels',
      format: TYPE_NUMBER,
      listable: false,
   },
   [KEY_TYPE_HEIGHT_PX]: {
      title: 'height_px',
      icon: 'faUpDown',
      description: 'The height of a frame, in pixels',
      format: TYPE_NUMBER,
      listable: false,
   },
   [KEY_TYPE_SCRIPT_PATH]: {
      title: 'height_px',
      icon: 'faUpDown',
      description: 'The height of a frame, in pixels',
      format: TYPE_STRING,
      listable: false,
   },
}
