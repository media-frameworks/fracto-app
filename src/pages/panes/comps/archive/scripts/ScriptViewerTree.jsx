import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {faGear} from "@fortawesome/free-solid-svg-icons";

import CoolTree from "common/ui/CoolTree";
import {
   CompScriptStyles as styles,
   TREE_TEXT_COLOR
} from "styles/CompScriptStyles"
import {
   KEY_SCRIPT_EXPANDED_KEYS,
   KEY_SCRIPT_SELECTED_DATA,
   KEY_SCRIPT_SELECTED_KEYS,
   KEY_SCRIPT_SELECTED_NODE,
   KEY_SELECTED_SCRIPT_DATA
} from "pages/settings/CompSettings";
import {
   node_type_from_key,
   icon_from_key,
   NODE_TYPE_ARRAY_ELEMENT,
   NODE_TYPE_FILE,
} from "scripts/ScriptTypes";

const DATA_KEY_ROOT = 'root'
const DATA_KEY_COMMENT = 'comment'
const DATA_KEY_INDEXED = 'indexed'

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
      tree_data: [],
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

   static node_key_map = {}

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
      ScriptViewerTree.node_key_map = {}
      const tree_data = this.build_tree(current_data, DATA_KEY_ROOT, 'base')
      // console.log('ScriptViewerTree.node_key_map', ScriptViewerTree.node_key_map)
      this.setState({
         current_node,
         current_data,
         expanded_keys,
         selected_keys,
         tree_data,
      })
   }

   select_item = (selected_keys, event) => {
      const {page_settings, on_settings_changed} = this.props
      const script_selected_keys = page_settings[KEY_SCRIPT_SELECTED_KEYS] || {}
      const selected_node = page_settings[KEY_SCRIPT_SELECTED_NODE]
      script_selected_keys[selected_node.script_path] = selected_keys
      on_settings_changed({
         [KEY_SCRIPT_SELECTED_KEYS]: script_selected_keys,
         [KEY_SCRIPT_SELECTED_DATA]: ScriptViewerTree.node_key_map[event?.node?.key || 'base'],
      })
      // console.log('selected_keys, event', selected_keys, event)
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
               const new_branch = {
                  key: new_key,
                  title: this.render_simple_title(item, data_type, new_key),
                  icon: icon_from_key(data_type),
                  node_type: node_type_from_key(item),
                  style: node_style,
                  parent: JSON.parse(JSON.stringify(data)),
                  children: []
               }
               ScriptViewerTree.node_key_map[new_key] = new_branch
               branch.push(new_branch)
            } else {
               const new_branch = {
                  key: new_key,
                  title: this.render_simple_title(`#${i + 1}`, DATA_KEY_INDEXED, new_key),
                  style: node_style,
                  node_type: NODE_TYPE_ARRAY_ELEMENT,
                  parent: JSON.parse(JSON.stringify(data)),
                  children: this.build_tree(item, DATA_KEY_INDEXED, new_key)
               }
               ScriptViewerTree.node_key_map[new_key] = new_branch
               branch.push(new_branch)
            }
         })
      } else if (typeof data === "object") {
         const keys = Object.keys(data)
         keys.forEach(key => {
            const new_key = `${key_path}-${key}`
            const simple_type = typeof data[key] === 'string' || typeof data[key] === 'number'
            const title = simple_type
               ? this.render_simple_title(`${data[key]}`, key, new_key)
               : this.render_simple_title(key, DATA_KEY_INDEXED, new_key)
            const new_branch = {
               key: new_key,
               title: title,
               style: node_style,
               icon: icon_from_key(key),
               node_type: node_type_from_key(key),
               parent: JSON.parse(JSON.stringify(data)),
               children: this.build_tree(data[key], key, new_key)
            }
            ScriptViewerTree.node_key_map[new_key] = new_branch
            branch.push(new_branch)
         })
      }
      return branch
   }

   render() {
      const {
         expanded_keys,
         selected_keys,
         current_node,
         tree_data,
      } = this.state
      const title = current_node?.script_path || 'loading...'
      const full_tree_data = {
         title: title,
         key: 'base',
         children: tree_data,
         node_type: NODE_TYPE_FILE,
         icon: <styles.TreeIcon icon={faGear}/>
      }
      return <CoolTree
         data={full_tree_data}
         expanded_keys={expanded_keys}
         selected_keys={selected_keys}
         on_select={this.select_item}
         on_expand={this.expand_item}
      />
   }
}

export default ScriptViewerTree;
