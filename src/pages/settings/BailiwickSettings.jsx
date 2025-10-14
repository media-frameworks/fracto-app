import {TYPE_OBJECT, TYPE_STRING} from "./AppSettings";
import {CELL_ALIGN_CENTER, CELL_ALIGN_LEFT, CELL_TYPE_CALLBACK, CELL_TYPE_TEXT} from "../../common/ui/CoolTable";

export const KEY_BAILIWICK_MODE = 'bailiwick_mode'
export const KEY_BAILIWICK_FREEFORM_ORDERING = 'bailiwick_freeform_ordering'
export const KEY_BAILIWICK_FREEFORM_ORDERING_DIRECTION = 'bailiwick_freeform_ordering_direction'
export const KEY_BAILIWICK_INLINE_ORDERING = 'bailiwick_inline_ordering'
export const KEY_BAILIWICK_INLINE_ORDERING_DIRECTION = 'bailiwick_inline_ordering_direction'
export const KEY_BAILIWICK_NODAL_ORDERING = 'bailiwick_nodal_ordering'
export const KEY_BAILIWICK_NODAL_ORDERING_DIRECTION = 'bailiwick_nodal_ordering_direction'
export const KEY_BAILIWICK_DETAIL_DATA = 'bailiwick_detail_data'

export const BAILIWICK_MODE_NODAL = 'bailiwick_mode_nodal'
export const BAILIWICK_MODE_FREEFORM = 'bailiwick_mode_freeform'
export const BAILIWICK_MODE_INLINE = 'bailiwick_mode_inline'

export const BAILIWICK_ORDERING_ASCENDING = 'bailiwick_ordering_ascending'
export const BAILIWICK_ORDERING_DESCENDING = 'bailiwick_ordering_descending'

export const COLUMN_ID_PATTERN = "pattern";
export const COLUMN_ID_NAME = "name";
export const COLUMN_ID_SIZE = "size";
export const COLUMN_ID_MODIFIED = "modified";

export const BAILIWICK_TABLE_COLUMNS = [
   {
      id: COLUMN_ID_PATTERN,
      label: "#",
      type: CELL_TYPE_CALLBACK,
      width_px: 35,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: COLUMN_ID_NAME,
      label: "name",
      type: CELL_TYPE_TEXT,
      width_px: 200,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: COLUMN_ID_SIZE,
      label: "size",
      type: CELL_TYPE_CALLBACK,
      width_px: 100,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: COLUMN_ID_MODIFIED,
      label: "modified",
      type: CELL_TYPE_CALLBACK,
      width_px: 100,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "go",
      label: "go",
      type: CELL_TYPE_CALLBACK,
      width_px: 35,
      align: CELL_ALIGN_CENTER,
   },
]

export const BAILIWICK_KEYED_SETTINGS = {
   [KEY_BAILIWICK_MODE]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_MODE_FREEFORM,
      description: 'mode of bailiwick to study',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_FREEFORM_ORDERING]: {
      data_type: TYPE_STRING,
      default_value: COLUMN_ID_PATTERN,
      description: 'type of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_FREEFORM_ORDERING_DIRECTION]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_ORDERING_ASCENDING,
      description: 'direction of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_INLINE_ORDERING]: {
      data_type: TYPE_STRING,
      default_value: COLUMN_ID_SIZE,
      description: 'type of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_INLINE_ORDERING_DIRECTION]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_ORDERING_DESCENDING,
      description: 'direction of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_NODAL_ORDERING]: {
      data_type: TYPE_STRING,
      default_value: COLUMN_ID_SIZE,
      description: 'type of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_NODAL_ORDERING_DIRECTION]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_ORDERING_DESCENDING,
      description: 'direction of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_DETAIL_DATA]: {
      data_type: TYPE_OBJECT,
      default_value: {},
      description: 'current bailiwick being edited or published',
      // component: COMPONENT_BAILIWICKS,
      persist: false,
   },
}

