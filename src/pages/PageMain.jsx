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
import PageSettings, {
   TYPE_OBJECT,
   TYPE_ARRAY,
} from "./PageSettings";
import {
   KEY_DISABLED
} from "../settings/AppSettings";
import {
   KEY_STEPS_WIDTH_PX,
   KEY_STEPS_HEIGHT_PX,
   KEY_FIELD_WIDTH_PX,
   KEY_FIELD_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
   KEY_COMPS_HEIGHT_PX,
   KEY_LEGEND_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX
} from "../settings/PaneSettings";

const getViewportDimensions = () => {
   let viewport = {}
   if (typeof window.innerWidth != 'undefined') {
      viewport.width = window.innerWidth;
      viewport.height = window.innerHeight;
   }
   else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
      viewport.width = document.documentElement.clientWidth;
      viewport.height = document.documentElement.clientHeight;
   }
   else {
      viewport.width = document.getElementsByTagName('body')[0].clientWidth;
      viewport.height = document.getElementsByTagName('body')[0].clientHeight;
   }
   return viewport;
}

export class PageMain extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
   }

   state = {
      left_width_px: 0,
      right_width_px: 0,
      height_px: 1,
      page_settings: {},
   };

   componentDidMount() {
      const page_settings = PageSettings.initialize()
      this.setState({page_settings})
      setTimeout(() => {
         const viewport = getViewportDimensions()
         const height_px = viewport.height // Math.round(bounds.height)
         // console.log('height_px', height_px)
         if (height_px) {
            this.on_settings_changed({[KEY_COMPS_HEIGHT_PX]: height_px})
            this.setState({height_px})
         }
      }, 100)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      // const {main_ref} = this.state
      // const bounds = main_ref.current.getBoundingClientRect()
      // const height_px = Math.round(bounds.height)
      // if (height_px !== prevState.height_px && height_px) {
      //    this.on_settings_changed({[KEY_COMPS_HEIGHT_PX]: height_px})
      //    this.setState({height_px})
      // }
   }

   on_resize = (new_left_width_px, new_right_width_px, new_height_px) => {
      const {page_settings} = this.state;
      if (page_settings[KEY_DISABLED]) {
         return;
      }
      const left_width_px = Math.round(new_left_width_px)
      const right_width_px = Math.round(new_right_width_px)
      const height_px = Math.round(new_height_px)
      this.setState({left_width_px, right_width_px, height_px})
      this.on_settings_changed({
         [KEY_FIELD_WIDTH_PX]: left_width_px - page_settings[KEY_STEPS_WIDTH_PX],
         [KEY_LEGEND_WIDTH_PX]: left_width_px,
         [KEY_COMPS_HEIGHT_PX]: height_px,
         [KEY_COMPS_WIDTH_PX]: right_width_px,
      })
   }

   on_settings_changed = (new_settings) => {
      let new_state = {page_settings: this.state.page_settings}
      const new_settings_keys = Object.keys(new_settings)
      new_settings_keys.forEach((key) => {
         const key_definition = PageSettings.all_settings[key]
         if (!key_definition) {
            console.log('key_definition not found', key)
            return
         }
         console.log(`${key}=>${new_settings[key]}`)
         switch (key_definition.data_type) {
            case TYPE_ARRAY:
            case TYPE_OBJECT:
               new_state.page_settings[key] =
                  JSON.parse(JSON.stringify(new_settings[key]))
               break
            default:
               new_state.page_settings[key] = new_settings[key]
               break;
         }
      })
      // console.log('new_settings', new_settings)
      if (new_settings[UPPER_HEIGHT_KEY]) {
         new_state.page_settings[KEY_STEPS_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
         new_state.page_settings[KEY_FIELD_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
         new_settings[KEY_STEPS_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
         new_settings[KEY_FIELD_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
      }
      if (new_settings[LOWER_HEIGHT_KEY]) {
         new_state.page_settings[KEY_LEGEND_HEIGHT_PX] = Math.abs(new_settings[LOWER_HEIGHT_KEY])
         new_settings[KEY_LEGEND_HEIGHT_PX] = Math.abs(new_settings[LOWER_HEIGHT_KEY])
      }
      if (new_settings[UPPER_LEFT_WIDTH_KEY]) {
         new_state.page_settings[KEY_STEPS_WIDTH_PX] = new_settings[UPPER_LEFT_WIDTH_KEY]
         new_settings[KEY_STEPS_WIDTH_PX] = new_settings[UPPER_LEFT_WIDTH_KEY]
      }
      if (new_settings[UPPER_RIGHT_WIDTH_KEY]) {
         new_state.page_settings[KEY_FIELD_WIDTH_PX] = new_settings[UPPER_RIGHT_WIDTH_KEY]
         new_settings[KEY_FIELD_WIDTH_PX] = new_settings[UPPER_RIGHT_WIDTH_KEY]
      }
      PageSettings.persist_settings(new_settings)
      this.setState(new_state)
   }

   render() {
      const {app_name} = this.props
      const {left_width_px, height_px, page_settings} = this.state
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
      const modal = []// page_settings[KEY_MODAL] || []
      return <div>
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
