import {TYPE_BOOLEAN, TYPE_NUMBER} from "./AppSettings";

export const KEY_STEPS_WIDTH_PX = 'steps_width_px'
export const KEY_STEPS_HEIGHT_PX = 'steps_height_px'
export const KEY_FIELD_WIDTH_PX = 'field_width_px'
export const KEY_FIELD_HEIGHT_PX = 'field_height_px'
export const KEY_COMPS_WIDTH_PX = 'comps_width_px'
export const KEY_COMPS_HEIGHT_PX = 'comps_height_px'
export const KEY_LEGEND_WIDTH_PX = 'legend_width_px'
export const KEY_LEGEND_HEIGHT_PX = 'legend_height_px'
export const KEY_FIELDS_PROFILES = 'fields_profiles'

export const PANE_KEYED_SETTINGS = {
   [KEY_STEPS_WIDTH_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 125,
      description: 'width of the steps pane in pixels',
      persist: true,
   },
   [KEY_STEPS_HEIGHT_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 500,
      description: 'height of the steps pane in pixels',
      persist: true,
   },
   [KEY_FIELD_WIDTH_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 500,
      description: 'width of the field pane in pixels',
      persist: true,
   },
   [KEY_FIELD_HEIGHT_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 500,
      description: 'height of the field pane in pixels',
      persist: true,
   },
   [KEY_COMPS_WIDTH_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 950,
      description: 'width of the comps pane in pixels',
      persist: true,
   },
   [KEY_COMPS_HEIGHT_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 800,
      description: 'height of the comps pane in pixels',
      persist: false,
   },
   [KEY_LEGEND_WIDTH_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 600,
      description: 'width of the legend pane in pixels',
      persist: true,
   },
   [KEY_LEGEND_HEIGHT_PX]: {
      data_type: TYPE_NUMBER,
      default_value: 300,
      description: 'height of the legend pane in pixels',
      persist: true,
   },
   [KEY_FIELDS_PROFILES]: {
      data_type: TYPE_BOOLEAN,
      default_value: false,
      description: 'whether or not the profiles page is shown',
      persist: false,
   },
}
