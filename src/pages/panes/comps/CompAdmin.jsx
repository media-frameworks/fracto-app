import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import {KEY_ADMIN_TYPE} from "pages/settings/CompSettings";

import AdminSettings from "./admin/AdminSettings";
import AdminInventory from "./admin/AdminInventory";
import {render_comp_modes} from "./CompUtils";

export const ADMIN_TYPE_SETTINGS = 'admin_type_settings'
export const ADMIN_TYPE_INVENTORY = 'admin_type_inventory'

const ADMIN_MODES = [
   {key: ADMIN_TYPE_SETTINGS, label: 'settings'},
   {key: ADMIN_TYPE_INVENTORY, label: 'inventory'},
]

export class CompAdmin extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
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
      const modes = render_comp_modes(
         ADMIN_MODES, KEY_ADMIN_TYPE, page_settings, on_settings_changed)
      return <styles.ContentWrapper>
         {modes}
         {content}
      </styles.ContentWrapper>

   }
}

export default CompAdmin
