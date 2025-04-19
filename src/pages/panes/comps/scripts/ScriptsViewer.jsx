import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompScriptStyles as styles, VIEWER_BAR_WIDTH_PX} from "styles/CompScriptStyles"
import {
   KEY_SCRIPT_SELECTED_NODE,
   KEY_SCRIPT_TREE_HEIGHT_PX,
   KEY_SCRIPT_TREE_WIDTH_PX,
   KEY_SCRIPT_VIEWER_MODE,
   KEY_SELECTED_SCRIPT_DATA,
} from "pages/PageSettings";
import {SPLITTER_WIDTH_PX} from "styles/PageAppStyles";
import {TAB_HEIGHT_PX} from "pages/panes/PaneComps";
import ScriptsViewerBar, {SCRIPT_VIEWER_MODE_TEXT} from "./ScriptsViewerBar";
import ScriptViewerTree from "./ScriptViewerTree";

export class ScriptsViewer extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      script_data: null,
      script_path: null,
   }

   componentDidMount() {
      this.load_script_file()
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {script_data} = this.state
      const {page_settings} = this.props
      const selected_node = page_settings[KEY_SCRIPT_SELECTED_NODE]
      if (!selected_node || !script_data) {
         return
      }
      if (selected_node.script_path !== prevState.script_path) {
         // console.log('ScriptsViewer componentDidUpdate', script_path, selected_node.script_path)
         this.load_script_file()
      }
   }

   load_script_file = async () => {
      const {page_settings, on_settings_changed} = this.props
      const selected_node = page_settings[KEY_SCRIPT_SELECTED_NODE]
      if (!selected_node || !selected_node.script_path) {
         return
      }
      const url = `/script/${selected_node.script_path}`
      try {
         const script_data = await fetch(url).then(res => res.json())
         on_settings_changed({[KEY_SELECTED_SCRIPT_DATA]: script_data})
         this.setState({
            script_data,
            script_path: selected_node.script_path
         })
      } catch (error) {
         console.error(`Error loading module ${url}:`, error);
         return null;
      }
   }

   render() {
      const {script_data} = this.state
      const {page_settings, on_settings_changed} = this.props
      const tree_height = page_settings[KEY_SCRIPT_TREE_HEIGHT_PX]
      const tree_width = page_settings[KEY_SCRIPT_TREE_WIDTH_PX]
      const wrapper_height_px = tree_height - TAB_HEIGHT_PX
      const viewer_left = tree_width + SPLITTER_WIDTH_PX - 1
      const text_mode = page_settings[KEY_SCRIPT_VIEWER_MODE] === SCRIPT_VIEWER_MODE_TEXT
      const script_view = text_mode
         ? <styles.ScriptJsonText>
            {JSON.stringify(script_data, null, 2)}
         </styles.ScriptJsonText>
         : <ScriptViewerTree
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />
      return [
         <ScriptsViewerBar
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />,
         <styles.ViewWrapper
            style={{
               top: `${TAB_HEIGHT_PX}px`,
               left: `${viewer_left + VIEWER_BAR_WIDTH_PX}px`,
               height: `${wrapper_height_px}px`,
               right: '10px'
            }}>
            {script_view}
         </styles.ViewWrapper>,
      ]
   }
}

export default ScriptsViewer;
