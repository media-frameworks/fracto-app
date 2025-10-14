import React, {Component} from 'react';
import PropTypes from 'prop-types';

import all_scripts from 'all_scripts.json';

import {CompScriptStyles as styles} from "styles/CompScriptStyles"
import CoolTree from "common/ui/CoolTree";
import {
   KEY_SCRIPT_TREE_WIDTH_PX,
   KEY_SCRIPT_TREE_HEIGHT_PX,
   KEY_SCRIPT_TREE_EXPANDED,
   KEY_SCRIPT_TREE_SELECTED,
   KEY_SCRIPT_SELECTED_NODE
} from "pages/settings/CompSettings";
import {TAB_HEIGHT_PX} from "../../../PaneComps";

export class ScriptsTree extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      script_data: {},
      selected_keys: [],
      expanded_keys: [],
   }

   componentDidMount() {
      const {page_settings} = this.props
      this.init_script_data()
      this.setState({
         selected_keys: page_settings[KEY_SCRIPT_TREE_SELECTED].length
            ? page_settings[KEY_SCRIPT_TREE_SELECTED]
            : ['0'],
         expanded_keys: page_settings[KEY_SCRIPT_TREE_EXPANDED].length
            ? page_settings[KEY_SCRIPT_TREE_EXPANDED]
            : ['0'],
      })
   }

   init_script_data = () => {
      let key = 0
      const script_data = {title: "scripts", key: `${key++}`, expanded: true, children: []}
      all_scripts.forEach((script, i) => {
         const path_list = script.split('/')
         let path_node = script_data
         path_list.forEach(path_folder => {
            const next_node = path_node.children.find(c => c.title === path_folder)
            if (!next_node) {
               const new_node = {
                  title: path_folder,
                  key: `${key++}`,
                  children: [],
                  script_path: `${script}.fs`
               }
               path_node.children.push(new_node)
               path_node = new_node
            } else {
               path_node = next_node
            }
         })
      })
      // console.log('script_data', script_data)
      this.setState({script_data})
   }

   select_script = (selected_keys, event) => {
      const {on_settings_changed} = this.props
      // console.log('select_script selected_keys, event', selected_keys, event)
      this.setState({selected_keys})
      on_settings_changed({
         [KEY_SCRIPT_TREE_SELECTED]: selected_keys,
         [KEY_SCRIPT_SELECTED_NODE]: event.node
      })
   }

   expand_folder = (expanded_keys, event) => {
      const {on_settings_changed} = this.props
      this.setState({expanded_keys})
      setTimeout(() => {
         on_settings_changed({[KEY_SCRIPT_TREE_EXPANDED]: expanded_keys})
      }, 50)
   }

   render() {
      const {expanded_keys, selected_keys, script_data} = this.state
      const {page_settings} = this.props
      const wrapper_style = {
         width: page_settings[KEY_SCRIPT_TREE_WIDTH_PX],
         height: page_settings[KEY_SCRIPT_TREE_HEIGHT_PX] - TAB_HEIGHT_PX,
         backgroundColor: "#f8f8f8"
      }
      // console.log('script_data', script_data)
      return <styles.TreeWrapper
         style={wrapper_style}>
         <CoolTree
            data={script_data}
            on_select={this.select_script}
            on_expand={this.expand_folder}
            expanded_keys={expanded_keys}
            selected_keys={selected_keys}
         />
      </styles.TreeWrapper>
   }
}

export default ScriptsTree;
