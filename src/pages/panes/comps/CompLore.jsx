import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompLoreStyles as styles} from 'styles/CompLoreStyles'
import {
   KEY_LORE_MODE,
   LORE_MODE_EDIT,
   LORE_MODE_INDEX,
   LORE_MODE_PRESENT
} from "settings/LoreSettings";
import {render_comp_modes} from "./CompUtils";
import LoreIndex from "./lore/LoreIndex";

const LORE_MODES = [
   {key: LORE_MODE_INDEX, label: 'index'},
   {key: LORE_MODE_EDIT, label: 'edit'},
   {key: LORE_MODE_PRESENT, label: 'present'},
]

export class CompLore extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   render_mode = () => {
      const {page_settings, on_settings_changed} = this.props
      switch(page_settings[KEY_LORE_MODE]) {
         case LORE_MODE_INDEX:
            return <LoreIndex
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case LORE_MODE_EDIT:
            return ('edit')
         case LORE_MODE_PRESENT:
            return ('present')
         default:
            return page_settings[KEY_LORE_MODE]
      }
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const modes = render_comp_modes(
         LORE_MODES, KEY_LORE_MODE, page_settings, on_settings_changed)
      return <styles.ContentWrapper>
         {modes}
         {this.render_mode()}
      </styles.ContentWrapper>
   }
}

export default CompLore
