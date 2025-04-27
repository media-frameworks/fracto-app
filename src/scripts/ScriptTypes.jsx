import React from "react";

import {CompScriptStyles as styles} from "styles/CompScriptStyles"
import {
   TYPE_NUMBER,
   TYPE_STRING,
   TYPE_OBJECT,
} from "settings/AppSettings";
import {
   faGear,
   faCircleQuestion,
   faArrowRight,
   faCode,
   faCodeBranch,
   faBullhorn,
   faPersonWalking,
   faFolderOpen,
   faCropSimple,
   faCrosshairs,
   faLeftRight,
   faUpDown,
   faScroll,
} from "@fortawesome/free-solid-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons"

export const NODE_TYPE_UNKNOWN = 'node_type_unknown'
export const NODE_TYPE_FILE = 'node_type_file'
export const NODE_TYPE_COMMENT = 'node_type_comment'
export const NODE_TYPE_IMPORT = 'node_type_import'
export const NODE_TYPE_INPUT = 'node_type_input'
export const NODE_TYPE_DECLARE = 'node_type_declare'
export const NODE_TYPE_STEP = 'node_type_step'
export const NODE_TYPE_CALL = 'node_type_call'
export const NODE_TYPE_ARRAY_ELEMENT = 'node_type_array_element'

export const KEY_TYPE_SCOPE = 'key_type_scope'
export const KEY_TYPE_FOCAL_POINT = 'key_type_focal_point'
export const KEY_TYPE_WIDTH_PX = 'key_width_px'
export const KEY_TYPE_HEIGHT_PX = 'key_height_px'
export const KEY_TYPE_SCRIPT_PATH = 'key_type_script_path'
export const KEY_TYPE_FRACTO_SCRIPT = 'key_type_fracto_script'

// Script Node Types
export const SCRIPT_NODE_TYPES = {
   [NODE_TYPE_UNKNOWN]: {
      title: 'unknown node type',
      icon: 'faCircleQuestion',
      description: 'The node or key type is not yet registered.',
      listable: true,
      component: 'NodeTypeUnknown',
   },
   [NODE_TYPE_FILE]: {
      title: 'fracto-script file',
      title_plural: 'fracto-script files',
      icon: 'faGear',
      description: 'The highest-level context of a fracto script',
      listable: true,
      component: 'NodeTypeFile',
   },
   [NODE_TYPE_COMMENT]: {
      title: 'comment',
      title_plural: 'comments',
      icon: 'faComment',
      description: 'Statements relevant to the current script context',
      listable: true,
      component: 'NodeTypeComment',
   },
   [NODE_TYPE_IMPORT]: {
      title: 'import',
      title_plural: 'imports',
      icon: 'faCode',
      description: 'Script code and data imported from other files',
      listable: true,
      component: 'NodeTypeImport',
   },
   [NODE_TYPE_INPUT]: {
      title: 'input',
      title_plural: 'inputs',
      icon: 'faArrowRight',
      description: 'Data passed into a script for processing',
      listable: true,
      component: 'NodeTypeInput',
   },
   [NODE_TYPE_DECLARE]: {
      title: 'declare',
      title_plural: 'declares',
      icon: 'faBullhorn',
      description: 'Data specific to the operation of a script',
      listable: true,
      component: 'NodeTypeDeclare',
   },
   [NODE_TYPE_STEP]: {
      title: 'step',
      title_plural: 'steps',
      icon: 'faPersonWalking',
      icon_plural: 'faShoePrints',
      description: 'One or more instructions with inputs to be run',
      listable: true,
      component: 'NodeTypeStep',
   },
   [NODE_TYPE_CALL]: {
      title: 'call',
      title_plural: 'calls',
      icon: 'faCodeBranch',
      icon_plural: 'faCodeBranch',
      description: 'Synchronously invoke a script method with inputs',
      listable: true,
      component: 'NodeTypeCall',
   },
   [NODE_TYPE_ARRAY_ELEMENT]: {
      icon: 'faFolderOpen',
      description: 'abstract place-holder for an array element',
      listable: false,
      component: 'NodeTypeArrayElement',
   }
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
      component: 'KeyTypeScope',
   },
   [KEY_TYPE_FOCAL_POINT]: {
      title: 'focal_point',
      title_plural: 'focal_points',
      icon: 'faCrosshairs',
      icon_plural: 'faCrosshairs',
      description: 'The complex-valued center point of a frame',
      format: TYPE_OBJECT,
      object_proto: {
         r: TYPE_NUMBER,
         i: TYPE_NUMBER,
      },
      listable: true,
      component: 'KeyTypeFocalPoint',
   },
   [KEY_TYPE_WIDTH_PX]: {
      title: 'width_px',
      icon: 'faLeftRight',
      description: 'The width of a frame, in pixels',
      format: TYPE_NUMBER,
      listable: false,
      component: 'KeyTypeWidthPx',
   },
   [KEY_TYPE_HEIGHT_PX]: {
      title: 'height_px',
      icon: 'faUpDown',
      description: 'The height of a frame, in pixels',
      format: TYPE_NUMBER,
      listable: false,
      component: 'KeyTypeHeightPx',
   },
   [KEY_TYPE_SCRIPT_PATH]: {
      title: 'height_px',
      icon: 'faUpDown',
      description: 'The height of a frame, in pixels',
      format: TYPE_STRING,
      listable: false,
      component: 'KeyTypeScriptPath',
   },
   [KEY_TYPE_FRACTO_SCRIPT]: {
      title: 'script',
      icon: 'faScroll',
      description: 'The name of an imported script',
      format: TYPE_STRING,
      listable: false,
      component: 'KeyTypeFactoScript',
   },
}

export const definition_from_key = (key_code) => {
   const node_type_keys = Object.keys(SCRIPT_NODE_TYPES)
   const node_key = node_type_keys.find(key =>
      SCRIPT_NODE_TYPES[key].title === key_code ||
      SCRIPT_NODE_TYPES[key].title_plural === key_code
   )
   if (!node_key) {
      const script_type_keys = Object.keys(SCRIPT_KEY_TYPES)
      const type_key = script_type_keys.find(key =>
         SCRIPT_KEY_TYPES[key].title === key_code ||
         SCRIPT_KEY_TYPES[key].title_plural === key_code
      )
      if (!type_key) {
         return NODE_TYPE_UNKNOWN
      }
      return SCRIPT_KEY_TYPES[type_key]
   }
   return SCRIPT_NODE_TYPES[node_key]
}

export const node_type_from_key = (key_code) => {
   const node_type_keys = Object.keys(SCRIPT_NODE_TYPES)
   const node_key = node_type_keys.find(key =>
      SCRIPT_NODE_TYPES[key].title === key_code ||
      SCRIPT_NODE_TYPES[key].title_plural === key_code
   )
   if (!node_key) {
      const script_type_keys = Object.keys(SCRIPT_KEY_TYPES)
      const type_key = script_type_keys.find(key =>
         SCRIPT_KEY_TYPES[key].title === key_code ||
         SCRIPT_KEY_TYPES[key].title_plural === key_code
      )
      if (!type_key) {
         return NODE_TYPE_UNKNOWN
      }
      return type_key
   }
   return node_key
}

export const icon_from_key = (key) => {
   const node = definition_from_key(key)
   switch (node.icon) {
      case 'faCode':
         return <styles.TreeIcon icon={faCode}/>
      case 'faGear':
         return <styles.TreeIcon icon={faGear}/>
      case 'faArrowRight':
         return <styles.TreeIcon icon={faArrowRight}/>
      case 'faComment':
         return <styles.TreeIcon icon={faComment}/>
      case 'faCodeBranch':
         return <styles.TreeIcon icon={faCodeBranch}/>
      case 'faBullhorn':
         return <styles.TreeIcon icon={faBullhorn}/>
      case 'faPersonWalking':
         return <styles.TreeIcon icon={faPersonWalking}/>
      case 'faFolderOpen':
         return <styles.TreeIcon icon={faFolderOpen}/>
      case 'faCropSimple':
         return <styles.TreeIcon icon={faCropSimple}/>
      case 'faCrosshairs':
         return <styles.TreeIcon icon={faCrosshairs}/>
      case 'faLeftRight':
         return <styles.TreeIcon icon={faLeftRight}/>
      case 'faUpDown':
         return <styles.TreeIcon icon={faUpDown}/>
      case 'faScroll':
         return <styles.TreeIcon icon={faScroll}/>
      default:
         return <styles.TreeIcon icon={faCircleQuestion}/>
   }
}
