import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompScriptStyles as styles, TREE_TEXT_COLOR} from "styles/CompScriptStyles"
import {
   KEY_SCRIPT_EXPANDED_KEYS,
   KEY_SCRIPT_SELECTED_KEYS,
   KEY_SCRIPT_SELECTED_NODE,
   KEY_SELECTED_SCRIPT_DATA
} from "settings/CompSettings";
import CoolTree from "common/ui/CoolTree";

import {
   faGear,
   faCircleQuestion,
   faArrowRight,
   faCode,
   faCodeBranch,
   faBullhorn,
   faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import {
   faComment
} from "@fortawesome/free-regular-svg-icons"

const DATA_KEY_ROOT = 'root'
const DATA_KEY_IMPORTS = 'imports'
const DATA_KEY_INPUTS = 'inputs'
const DATA_KEY_COMMENT = 'comment'
const DATA_KEY_CALL = 'call'
const DATA_KEY_INDEXED = 'indexed'
const DATA_KEY_DECLARES = 'declares'
const DATA_KEY_STEPS = 'steps'

export class ScriptViewerTree extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      current_node: {},
      current_data: {},
      selected_keys: [],
      expanded_keys: [],
   }

   componentDidMount() {
      this.initialize()
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const previous_data_str = JSON.stringify(prevState.current_data)
      const current_data_str = JSON.stringify(page_settings[KEY_SELECTED_SCRIPT_DATA])
      const current_data_changed = previous_data_str !== current_data_str
      const current_node_changed =
         prevState.current_node?.script_path !== page_settings[KEY_SCRIPT_SELECTED_NODE]?.script_path
      if (current_node_changed || current_data_changed) {
         // console.log('ScriptViewerTree componentDidUpdate', page_settings[KEY_SCRIPT_SELECTED_NODE]?.script_path)
         this.initialize()
      }
   }

   initialize = () => {
      const {page_settings} = this.props
      if (!page_settings[KEY_SCRIPT_SELECTED_NODE] || !page_settings[KEY_SELECTED_SCRIPT_DATA]) {
         return
      }
      const current_node = JSON.parse(JSON.stringify(page_settings[KEY_SCRIPT_SELECTED_NODE]))
      const current_data = JSON.parse(JSON.stringify(page_settings[KEY_SELECTED_SCRIPT_DATA]))
      const script_expanded_keys = page_settings[KEY_SCRIPT_EXPANDED_KEYS] || {}
      const script_selected_keys = page_settings[KEY_SCRIPT_SELECTED_KEYS] || {}
      const expanded_keys = script_expanded_keys[current_node?.script_path] || ['base']
      const selected_keys = script_selected_keys[current_node?.script_path] || ['base']
      this.setState({current_node, current_data, expanded_keys, selected_keys})
   }

   select_item = (selected_keys, event) => {
      const {page_settings, on_settings_changed} = this.props
      const script_selected_keys = page_settings[KEY_SCRIPT_SELECTED_KEYS] || {}
      const selected_node = page_settings[KEY_SCRIPT_SELECTED_NODE]
      script_selected_keys[selected_node.script_path] = selected_keys
      on_settings_changed({[KEY_SCRIPT_SELECTED_KEYS]: script_selected_keys})
      this.setState({selected_keys})
   }

   expand_item = (expanded_keys, event) => {
      const {page_settings, on_settings_changed} = this.props
      const script_expanded_keys = page_settings[KEY_SCRIPT_EXPANDED_KEYS] || {}
      const selected_node = page_settings[KEY_SCRIPT_SELECTED_NODE]
      script_expanded_keys[selected_node.script_path] = expanded_keys
      on_settings_changed({[KEY_SCRIPT_EXPANDED_KEYS]: script_expanded_keys})
      this.setState({expanded_keys})
   }

   icon_from_key = (key) => {
      switch (key) {
         case DATA_KEY_IMPORTS:
            return <styles.TreeIcon icon={faCode}/>
         case DATA_KEY_INPUTS:
            return <styles.TreeIcon icon={faArrowRight}/>
         case DATA_KEY_COMMENT:
            return <styles.TreeIcon icon={faComment}/>
         case DATA_KEY_CALL:
            return <styles.TreeIcon icon={faCodeBranch}/>
         case DATA_KEY_DECLARES:
            return <styles.TreeIcon icon={faBullhorn}/>
         case DATA_KEY_STEPS:
            return <styles.TreeIcon icon={faPersonWalking}/>
         default:
            return <styles.TreeIcon icon={faCircleQuestion}/>
      }
   }

   render_simple_title = (item, data_key, item_key) => {
      const {selected_keys} = this.state
      const is_selected = selected_keys.includes(item_key)
      const simple_style = {
         color: is_selected ? 'maroon' : TREE_TEXT_COLOR,
      }
      if (typeof item === 'string') {
         switch (data_key) {
            case DATA_KEY_COMMENT:
               simple_style.fontStyle = 'italic'
               simple_style.fontWeight = 'normal'
               break
            default:
               break
         }
         return <styles.TreeTitleText
            style={simple_style}>
            {item}
         </styles.TreeTitleText>
      }
      if (typeof item === 'number') {
         return <styles.TreeTitleNumber
            style={simple_style}>
            {item}
         </styles.TreeTitleNumber>
      }
   }

   node_click = (e) => {
      console.log('node_click', e)
   }

   build_tree = (data, data_type, key_path) => {
      const branch = []
      const node_style = {
         height: '22px',
         lineHeight: '22px',
         verticalAlign: 'top',
      }
      if (Array.isArray(data)) {
         data.forEach((item, i) => {
            const simple_type = typeof item === 'string' || typeof item === 'number'
            const new_key = `${key_path}-${i}`
            if (simple_type) {
               branch.push({
                  key: new_key,
                  title: this.render_simple_title(item, data_type, new_key),
                  icon: this.icon_from_key(data_type),
                  style: node_style,
                  children: []
               })
            } else {
               branch.push({
                  key: new_key,
                  title: this.render_simple_title(`#${i + 1}`, DATA_KEY_INDEXED, new_key),
                  style: node_style,
                  children: this.build_tree(item, DATA_KEY_INDEXED, new_key)
               })
            }
         })
      } else if (typeof data === "object") {
         const keys = Object.keys(data)
         keys.forEach(key => {
            const new_key = `${key_path}-${key}`
            const simple_type = typeof data[key] === 'string' || typeof data[key] === 'number'
            const title = simple_type
               ? this.render_simple_title(`${key}: ${data[key]}`, key, new_key)
               : this.render_simple_title(key, DATA_KEY_INDEXED, new_key)
            branch.push({
               key: new_key,
               title: title,
               style: node_style,
               children: this.build_tree(data[key], key, new_key),
               icon: this.icon_from_key(key),
            })
         })
      }
      return branch
   }

   render() {
      const {
         expanded_keys,
         selected_keys,
         current_node,
         current_data
      } = this.state
      const title = current_node?.script_path || 'loading...'
      const tree_data = {
         title: title,
         key: 'base',
         children: this.build_tree(current_data || [], DATA_KEY_ROOT, 'base'),
         icon: <styles.TreeIcon icon={faGear}/>
      }
      return <CoolTree
         data={tree_data}
         expanded_keys={expanded_keys}
         selected_keys={selected_keys}
         on_select={this.select_item}
         on_expand={this.expand_item}
      />
   }
}

export default ScriptViewerTree;
