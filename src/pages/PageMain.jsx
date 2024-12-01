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
   KEY_HOVER_POINT, KEY_CTX, KEY_CANVAS_BUFFER,
} from "./PageSettings";

const ALL_PANE_DIMENSIONS = [
   KEY_STEPS_WIDTH_PX,
   KEY_STEPS_HEIGHT_PX,
   KEY_FIELD_WIDTH_PX,
   KEY_FIELD_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
   KEY_COMPS_HEIGHT_PX,
   KEY_LEGEND_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX,
]

const ALL_OPERATIVES = [
   KEY_FOCAL_POINT,
   KEY_SCOPE,
   KEY_DISABLED,
   KEY_HOVER_POINT,
   KEY_CTX,
   KEY_CANVAS_BUFFER,
]

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
   }

   on_resize = (left_width_px, right_width_px, height_px) => {
      const {page_settings} = this.state;
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
      console.log('new_settings', new_settings)
      if (new_settings[UPPER_HEIGHT_KEY]) {
         new_state.page_settings[KEY_STEPS_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
         new_state.page_settings[KEY_FIELD_HEIGHT_PX] = new_settings[UPPER_HEIGHT_KEY]
      }
      if (new_settings[LOWER_HEIGHT_KEY]) {
         new_state.page_settings[KEY_LEGEND_HEIGHT_PX] = new_settings[LOWER_HEIGHT_KEY]
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
         if (new_settings[operative] !== undefined) {
            new_state.page_settings[operative] = new_settings[operative]
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
      return <div
         ref={main_ref}>
         <AppPageMain
            app_name={app_name}
            on_resize={this.on_resize}
            content_left={left_pane}
            content_right={pane_comps}
         />
      </div>
   }
}

export default PageMain;
