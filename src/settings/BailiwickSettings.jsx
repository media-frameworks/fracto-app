import {TYPE_STRING} from "./AppSettings";

export const KEY_BAILIWICK_MODE = 'bailiwick_mode'
export const KEY_BAILIWICK_DISPLAY = 'bailiwick_display'
export const KEY_BAILIWICK_ORDERING = 'bailiwick_ordering'
export const KEY_BAILIWICK_ORDERING_DIRECTION = 'bailiwick_ordering_direction'

export const BAILIWICK_MODE_NODAL = 'bailiwick_mode_nodal'
export const BAILIWICK_MODE_FREEFORM = 'bailiwick_mode_freeform'
export const BAILIWICK_MODE_INLINE = 'bailiwick_mode_inline'

export const BAILIWICK_DISPLAY_LIST = 'bailiwick_display_list'
export const BAILIWICK_DISPLAY_ICONS = 'bailiwick_display_icons'

export const BAILIWICK_ORDER_BY_SIZE = 'bailiwick_order_by_size'
export const BAILIWICK_ORDER_BY_CARDINALITY = 'bailiwick_order_by_cardinality'

export const BAILIWICK_ORDERING_ASCENDING = 'bailiwick_ordering_ascending'
export const BAILIWICK_ORDERING_DESCENDING = 'bailiwick_ordering_descending'

export const BAILIWICK_KEYED_SETTINGS = {
   [KEY_BAILIWICK_MODE]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_MODE_FREEFORM,
      description: 'mode of bailiwick to study',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_DISPLAY]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_DISPLAY_LIST,
      description: 'type of presentation for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_ORDERING]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_ORDER_BY_SIZE,
      description: 'type of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
   [KEY_BAILIWICK_ORDERING_DIRECTION]: {
      data_type: TYPE_STRING,
      default_value: BAILIWICK_ORDERING_DESCENDING,
      description: 'direction of ordering for the list of bailiwicks',
      // component: COMPONENT_BAILIWICKS,
      persist: true,
   },
}

