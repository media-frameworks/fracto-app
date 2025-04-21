import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompScriptStyles as styles} from "styles/CompScriptStyles"
import {TAB_HEIGHT_PX} from "../../PaneComps";
import {SPLITTER_WIDTH_PX} from "styles/PageAppStyles";
import {
   KEY_SCRIPT_TREE_HEIGHT_PX,
   KEY_SCRIPT_TREE_WIDTH_PX,
   KEY_SCRIPT_VIEWER_MODE
} from "settings/CompSettings";

export const SCRIPT_VIEWER_MODE_TEXT = 'script_viewer_mode_text'
export const SCRIPT_VIEWER_MODE_UI = 'script_viewer_mode_ui'

export class ScriptsViewerBar extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   set_text_mode = () => {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_SCRIPT_VIEWER_MODE]: SCRIPT_VIEWER_MODE_TEXT})
   }

   set_interactive_mode = () => {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_SCRIPT_VIEWER_MODE]: SCRIPT_VIEWER_MODE_UI})
   }

   render() {
      const {page_settings} = this.props
      const tree_width = page_settings[KEY_SCRIPT_TREE_WIDTH_PX]
      const viewer_left = tree_width + SPLITTER_WIDTH_PX - 2
      const tree_height = page_settings[KEY_SCRIPT_TREE_HEIGHT_PX]
      const wrapper_height_px = tree_height - TAB_HEIGHT_PX
      const bar_frame_styles = {
         top: `${TAB_HEIGHT_PX}px`,
         left: `${viewer_left}px`,
         height: `${wrapper_height_px}px`,
      }
      const deselected_style = {
         backgroundColor: 'transparent',
         color: '#444444',
      }
      const selected_style = {
         backgroundColor: 'white',
         color: 'black',
      }
      const is_text_mode = page_settings[KEY_SCRIPT_VIEWER_MODE] === SCRIPT_VIEWER_MODE_TEXT
      return [
         <styles.ViewerBarFrame style={bar_frame_styles}>
            <styles.SquareButton
               style={!is_text_mode ? deselected_style : selected_style}
               title={'regular text mode'}
               onClick={this.set_text_mode}
            >{'{}'}</styles.SquareButton>
            <styles.SquareButton
               style={is_text_mode ? deselected_style : selected_style}
               title={'interactive mode'}
               onClick={this.set_interactive_mode}
            >{'@'}</styles.SquareButton>
         </styles.ViewerBarFrame>,
      ]
   }
}

export default ScriptsViewerBar;
