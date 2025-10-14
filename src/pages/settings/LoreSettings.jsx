import {TYPE_STRING} from "./AppSettings";

export const KEY_LORE_MODE = 'lore_mode'

// values for KEY_IMAGE_MODE
export const LORE_MODE_INDEX = 'lore_mode_index'
export const LORE_MODE_EDIT = 'lore_mode_edit'
export const LORE_MODE_PRESENT = 'lore_mode_present'

export const LORE_KEYED_SETTINGS = {
   [KEY_LORE_MODE]: {
      data_type: TYPE_STRING,
      default_value: LORE_MODE_INDEX,
      description: 'mode of operation for the Lore tab',
      persist: true,
   },
}
