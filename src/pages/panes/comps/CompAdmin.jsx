import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import {KEY_ADMIN_TYPE} from "settings/CompSettings";

import AdminSettings from "./admin/AdminSettings";
import AdminInventory from "./admin/AdminInventory";

export const ADMIN_TYPE_SETTINGS = 'admin_type_settings'
export const ADMIN_TYPE_INVENTORY = 'admin_type_inventory'

export class CompAdmin extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   set_admin_type = (admin_type) => {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_ADMIN_TYPE]: admin_type,})
   }

   render_pattern_type = () => {
      const {page_settings} = this.props
      const admin_type = page_settings[KEY_ADMIN_TYPE] || ADMIN_TYPE_SETTINGS
      const deselected_style = {color: '#aaaaaa', fontWeight: 400}
      return <styles.CenteredBlock>
         <input
            type={"radio"}
            checked={admin_type === ADMIN_TYPE_SETTINGS}
            onClick={() => this.set_admin_type(ADMIN_TYPE_SETTINGS)}
         />
         <styles.PatternTypePrompt
            style={admin_type === ADMIN_TYPE_INVENTORY ? deselected_style : {}}
            onClick={() => this.set_admin_type(ADMIN_TYPE_SETTINGS)}
         >{'settings'}
         </styles.PatternTypePrompt>
         <styles.Spacer/>
         <input
            type={"radio"}
            checked={admin_type === ADMIN_TYPE_INVENTORY}
            onClick={() => this.set_admin_type(ADMIN_TYPE_INVENTORY)}
         />
         <styles.PatternTypePrompt
            style={admin_type === ADMIN_TYPE_SETTINGS ? deselected_style : {}}
            onClick={() => this.set_admin_type(ADMIN_TYPE_INVENTORY)}
         >
            {'inventory'}
         </styles.PatternTypePrompt>
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      let content = []
      switch (page_settings[KEY_ADMIN_TYPE]) {
         case ADMIN_TYPE_INVENTORY:
            content = <AdminInventory
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break
         case ADMIN_TYPE_SETTINGS:
            content = <AdminSettings
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         default:
            break
      }
      return <styles.ContentWrapper>
         {this.render_pattern_type()}
         {content}
      </styles.ContentWrapper>

   }
}

export default CompAdmin
