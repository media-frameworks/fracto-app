import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompScriptStyles as styles} from "styles/CompScriptStyles"
import CoolSplitter, {
   SPLITTER_TYPE_HORIZONTAL,
   SPLITTER_TYPE_VERTICAL,
} from "common/ui/CoolSplitter";
import {SPLITTER_WIDTH_PX} from "styles/PageAppStyles";
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
   KEY_SCRIPT_TREE_HEIGHT_PX,
   KEY_SCRIPT_TREE_WIDTH_PX,
} from "pages/PageSettings";
import ScriptsTree from "./scripts/ScriptsTree";

const REFRESH_INTEVAL_MS = 1500

export class CompScript extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      wrapper_ref: React.createRef(),
      upper_pane_position: 250,
      left_pane_position: 250,
      refresh_interval: null,
   }

   componentDidMount() {
      const {page_settings, on_settings_changed} = this.props
      let prev_upper_pos = this.state.upper_pane_position
      let prev_left_pos = this.state.left_pane_position
      const refresh_interval = setInterval(() => {
         if (prev_upper_pos !== this.state.upper_pane_position) {
            let new_settings = {}
            new_settings[KEY_SCRIPT_TREE_HEIGHT_PX] = this.state.upper_pane_position
            on_settings_changed(new_settings)
         }
         if (prev_left_pos !== this.state.left_pane_position) {
            let new_settings = {}
            new_settings[KEY_SCRIPT_TREE_WIDTH_PX] = this.state.left_pane_position
            on_settings_changed(new_settings)
         }
      }, REFRESH_INTEVAL_MS)
      this.setState({
         refresh_interval,
         upper_pane_position: page_settings[KEY_SCRIPT_TREE_HEIGHT_PX] || 200,
         left_pane_position: page_settings[KEY_SCRIPT_TREE_WIDTH_PX] || 200,
      })
   }

   componentWillUnmount() {
      const {refresh_interval} = this.state
      clearInterval(refresh_interval)
   }

   change_upper_pane_position = (new_position) => {
      this.setState({upper_pane_position: new_position})
   }

   change_left_pane_position = (new_position) => {
      this.setState({left_pane_position: new_position})
   }

   render_horz_splitter = () => {
      const {upper_pane_position} = this.state
      const {page_settings} = this.props
      const container_bounds = {
         left: 0, top: 0,
         width: page_settings[KEY_COMPS_WIDTH_PX],
         height: page_settings[KEY_COMPS_HEIGHT_PX]
      }
      return <CoolSplitter
         key={'main-splitter-bar'}
         type={SPLITTER_TYPE_HORIZONTAL}
         name={'main-splitter-bar'}
         bar_width_px={SPLITTER_WIDTH_PX}
         container_bounds={container_bounds}
         position={upper_pane_position}
         on_change={this.change_upper_pane_position}
      />
   }

   render_vert_splitter = () => {
      const {
         wrapper_ref, upper_pane_position, left_pane_position
      } = this.state
      const {page_settings} = this.props
      let top = 0
      let splitter_height = upper_pane_position
      if (wrapper_ref.current) {
         const bounds = wrapper_ref.current.getBoundingClientRect()
         top = bounds.top - 20
      }
      splitter_height -= top
      const upper_container_bounds = {
         left: left_pane_position, top,
         width: page_settings[KEY_COMPS_WIDTH_PX] - left_pane_position,
         height: splitter_height
      }
      return <CoolSplitter
         key={'upper-pane-splitter-bar'}
         type={SPLITTER_TYPE_VERTICAL}
         name={'upper-pane-splitter-bar'}
         bar_width_px={SPLITTER_WIDTH_PX}
         container_bounds={upper_container_bounds}
         position={left_pane_position}
         on_change={this.change_left_pane_position}
      />
   }

   render() {
      const {wrapper_ref} = this.state
      const {page_settings, on_settings_changed} = this.props
      return <styles.ContentWrapper ref={wrapper_ref}>
         <ScriptsTree
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />
         {this.render_vert_splitter()}
         {this.render_horz_splitter()}
      </styles.ContentWrapper>
   }
}

export default CompScript;
