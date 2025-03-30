import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AppPageMain from 'app/AppPageMain';
import LeftPaneSplitters, {
   UPPER_HEIGHT_KEY,
   UPPER_LEFT_WIDTH_KEY,
   UPPER_RIGHT_WIDTH_KEY,
   LOWER_HEIGHT_KEY
} from "./LeftPaneSplitters";

import PaneField from "./panes/PaneField";
import PaneSteps from "./panes/PaneSteps";
import PaneLegend from "./panes/PaneLegend";
import PaneComps from "./panes/PaneComps";
import {
   KEY_STEPS_WIDTH_PX,
   KEY_STEPS_HEIGHT_PX,
   KEY_FIELD_WIDTH_PX,
   KEY_FIELD_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
   KEY_COMPS_HEIGHT_PX,
   KEY_LEGEND_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX,
   KEY_FOCAL_POINT,
   KEY_SCOPE,
   KEY_DISABLED,
   KEY_HOVER_POINT,
   KEY_CANVAS_BUFFER,
   KEY_MODAL,
   ALL_PANE_DIMENSIONS,
   ALL_OPERATIVES,
   PERSIST_KEYS_MAP, TYPE_STRING, TYPE_NUMBER, TYPE_OBJECT, TYPE_ARRAY,
} from "./PageSettings";

export class PageMain extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
   }

   state = {
      left_width_px: 0,
      right_width_px: 0,
      height_px: 1,
      page_settings: {
         focal_point: {x: -0.75, y: 0.0125},
         scope: 3,
         disabled: false,
         canvas_buffer: null,
         ctx: null,
      },
      main_ref: React.createRef()
   };

   componentDidMount() {
      const {main_ref} = this.state
      const bounds = main_ref.current.getBoundingClientRect()
      this.setState({height_px: bounds.height})
      let new_setings = {}
      new_setings[KEY_COMPS_HEIGHT_PX] = Math.round(bounds.height)
      this.on_settings_changed(new_setings)
      this.load_persisted()
   }

   load_persisted = () => {
      const persist_key_names = Object.keys(PERSIST_KEYS_MAP)
      let new_settings = {}
      persist_key_names.forEach(key => {
         const setting_str = localStorage.getItem(key)
         if (setting_str) {
            switch (PERSIST_KEYS_MAP[key]) {
               case TYPE_STRING:
                  new_settings[key] = setting_str;
                  break;
               case TYPE_NUMBER:
                  new_settings[key] = parseFloat(setting_str);
                  break;
               case TYPE_OBJECT:
               case TYPE_ARRAY:
                  new_settings[key] = JSON.parse(setting_str);
                  break;
               default:
                  break;
            }
         }
      })
      console.log('on_settings_changed', new_settings)
      this.on_settings_changed(new_settings)
   }

   on_resize = (left_width_px, right_width_px, height_px) => {
      const {page_settings} = this.state;
      if (page_settings[KEY_DISABLED]) {
         return;
      }
      this.setState({
         left_width_px: Math.round(left_width_px),
         right_width_px: Math.round(right_width_px),
         height_px: Math.round(height_px),
      })
      let new_setings = {}
      new_setings[KEY_FIELD_WIDTH_PX] = left_width_px - page_settings[KEY_STEPS_WIDTH_PX]
      new_setings[KEY_LEGEND_WIDTH_PX] = left_width_px
      new_setings[KEY_COMPS_HEIGHT_PX] = Math.round(height_px)
      new_setings[KEY_COMPS_WIDTH_PX] = right_width_px
      this.on_settings_changed(new_setings)
   }

   on_settings_changed = (new_settings) => {
      let new_state = {page_settings: this.state.page_settings}
      // console.log('new_settings', new_settings)
      if (new_settings[UPPER_HEIGHT_KEY]) {
         new_state.page_settings[KEY_STEPS_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
         new_state.page_settings[KEY_FIELD_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
      }
      if (new_settings[LOWER_HEIGHT_KEY]) {
         new_state.page_settings[KEY_LEGEND_HEIGHT_PX] = Math.abs(new_settings[LOWER_HEIGHT_KEY])
      }
      if (new_settings[UPPER_LEFT_WIDTH_KEY]) {
         new_state.page_settings[KEY_STEPS_WIDTH_PX] = new_settings[UPPER_LEFT_WIDTH_KEY]
      }
      if (new_settings[UPPER_RIGHT_WIDTH_KEY]) {
         new_state.page_settings[KEY_FIELD_WIDTH_PX] = new_settings[UPPER_RIGHT_WIDTH_KEY]
      }
      if (new_settings[KEY_FOCAL_POINT]) {
         new_state.page_settings[KEY_FOCAL_POINT] =
            JSON.parse(JSON.stringify(new_settings[KEY_FOCAL_POINT]))
         new_state.page_settings[KEY_DISABLED] = true
      }
      if (new_settings[KEY_CANVAS_BUFFER]) {
         new_state.page_settings[KEY_CANVAS_BUFFER] =
            JSON.parse(JSON.stringify(new_settings[KEY_CANVAS_BUFFER]))
      }
      if (new_settings[KEY_HOVER_POINT]) {
         new_state.page_settings[KEY_HOVER_POINT] =
            JSON.parse(JSON.stringify(new_settings[KEY_HOVER_POINT]))
      }
      if (new_settings[KEY_SCOPE]) {
         new_state.page_settings[KEY_SCOPE] = new_settings[KEY_SCOPE]
         new_state.page_settings[KEY_DISABLED] = true
      }
      ALL_PANE_DIMENSIONS.forEach(dim_key => {
         if (new_settings[dim_key]) {
            new_state.page_settings[dim_key] = new_settings[dim_key]
         }
      })
      ALL_OPERATIVES.forEach(operative => {
         // console.log(`testing operative ${operative} to ${new_settings[operative]}`)
         if (new_settings[operative] !== undefined) {
            // console.log(`setting operative ${operative} to ${new_settings[operative]}`)
            new_state.page_settings[operative] = new_settings[operative]
         }
      })
      const all_new_keys = Object.keys(new_settings)
      const persist_keys = Object.keys(PERSIST_KEYS_MAP)
      persist_keys.forEach(key => {
         if (all_new_keys.includes(key)) {
            if (typeof new_settings[key] === 'string') {
               localStorage.setItem(key, new_settings[key])
            } else if (typeof new_settings[key] === 'number') {
               localStorage.setItem(key, `${new_settings[key]}`)
            } else if (typeof new_settings[key] === 'object') {
               localStorage.setItem(key, JSON.stringify(new_settings[key]))
            } else if (Array.isArray(new_settings[key])) {
               localStorage.setItem(key, JSON.stringify(new_settings[key]))
            }
         }
      })
      this.setState(new_state)
   }

   render() {
      const {app_name} = this.props
      const {left_width_px, height_px, page_settings, main_ref} = this.state
      const pane_steps = <PaneSteps
         page_settings={page_settings}
         on_settings_changed={this.on_settings_changed}
      />
      const pane_field = <PaneField
         page_settings={page_settings}
         on_settings_changed={this.on_settings_changed}
      />
      const pane_legend = <PaneLegend
         page_settings={page_settings}
         on_settings_changed={this.on_settings_changed}
      />
      const pane_comps = <PaneComps
         page_settings={page_settings}
         on_settings_changed={this.on_settings_changed}
      />
      const left_pane = <LeftPaneSplitters
         width_px={left_width_px}
         height_px={height_px}
         pane_steps={pane_steps}
         pane_field={pane_field}
         pane_legend={pane_legend}
         on_settings_changed={this.on_settings_changed}
      />
      const modal = page_settings[KEY_MODAL] || []
      return <div
         ref={main_ref}>
         <AppPageMain
            app_name={app_name}
            on_resize={this.on_resize}
            content_left={left_pane}
            content_right={pane_comps}
            page_settings={page_settings}
            on_settings_changed={this.on_settings_changed}
         />
         {modal}
      </div>
   }
}

export default PageMain;
