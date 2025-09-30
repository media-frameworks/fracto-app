import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
} from "settings/PaneSettings";
import {CoolTabs} from "common/ui/CoolImports";
import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'
import CoolStyles from "common/ui/styles/CoolStyles";

import CompAdmin from "./comps/CompAdmin";
import CompOrbitals from "./comps/CompOrbitals";
import CompNursery from "./comps/CompNursery";
import CompPoints from "./comps/CompPoints";
import CompImages from "./comps/CompImages";
import CompMinibrot from "./comps/CompMinibrot";
import CompBailiwicks from "./comps/CompBailiwicks";

export const TAB_HEIGHT_PX = 20

const COMP_KEY_POINTS = 'comp_key_points'
const COMP_KEY_IMAGE = 'comp_key_image'
const COMP_KEY_ORBITALS = 'comp_key_orbitals'
const COMP_KEY_MINIBROT = 'comp_key_minibrot'
const COMP_KEY_BAILIWICKS = 'comp_key_bailiwicks'
const COMP_KEY_NURSERY = 'comp_key_nursery'
const COMP_KEY_ADMIN = 'comp_key_admin'

const ACTIVE_COMPS = [
   COMP_KEY_POINTS,
   COMP_KEY_IMAGE,
   COMP_KEY_ORBITALS,
   COMP_KEY_MINIBROT,
   COMP_KEY_BAILIWICKS,
   COMP_KEY_NURSERY,
   COMP_KEY_ADMIN,
]

export class PaneComps extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      selected_tab_key: COMP_KEY_ADMIN,
   }

   on_tab_select = (selected_tab_index) => {
      this.setState({selected_tab_key: ACTIVE_COMPS[selected_tab_index]})
   }

   render_tab_content = (tab_key) => {
      const {page_settings, on_settings_changed} = this.props
      switch (tab_key) {
         case COMP_KEY_POINTS:
            return <CompPoints
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case COMP_KEY_IMAGE:
            return <CompImages
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case COMP_KEY_ORBITALS:
            return <CompOrbitals
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case COMP_KEY_NURSERY:
            return <CompNursery
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case COMP_KEY_MINIBROT:
            return <CompMinibrot
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case COMP_KEY_BAILIWICKS:
            return <CompBailiwicks
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         case COMP_KEY_ADMIN:
            return <CompAdmin
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         default:
            return `unknown: ${tab_key}`
      }
   }

   render_tab_label = (tab_key) => {
      switch (tab_key) {
         case COMP_KEY_POINTS:
            return 'points'
         case COMP_KEY_IMAGE:
            return 'images'
         case COMP_KEY_ORBITALS:
            return 'orbitals'
         case COMP_KEY_MINIBROT:
            return 'minibrot'
         case COMP_KEY_BAILIWICKS:
            return 'bailiwicks'
         case COMP_KEY_NURSERY:
            return 'factory'
         case COMP_KEY_ADMIN:
            return 'admin'
         default:
            return tab_key
      }
   }

   render() {
      const {selected_tab_key} = this.state
      const {page_settings} = this.props
      const tabs_width = page_settings[KEY_COMPS_WIDTH_PX] - 20
      const tabs_style = {
         height: `${TAB_HEIGHT_PX}px`,
      }
      const labelStyle = {
         padding: `4px 12px`,
      }
      const all_labels = ACTIVE_COMPS.map(key => {
         return <CoolStyles.InlineBlock style={labelStyle}>
            {this.render_tab_label(key)}
         </CoolStyles.InlineBlock>
      })
      const wrapper_style = {
         height: page_settings[KEY_COMPS_HEIGHT_PX] - 52,
         width: page_settings[KEY_COMPS_WIDTH_PX] - 8,
      }
      const selected_tab_index = ACTIVE_COMPS.indexOf(selected_tab_key)
      const selected_content = <styles.TabsWrapper style={wrapper_style}>
         {this.render_tab_content(selected_tab_key)}
      </styles.TabsWrapper>
      return <CoolTabs
         labels={all_labels}
         selected_content={selected_content}
         on_tab_select={this.on_tab_select}
         tab_index={selected_tab_index}
         width_px={tabs_width}
         style={tabs_style}
      />
   }
}

export default PaneComps
