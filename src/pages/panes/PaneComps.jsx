import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
} from "../PageSettings";
import {CoolTabs} from "common/ui/CoolImports";
import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'

import CompAdmin from "./comps/CompAdmin";
import CompOrbitals from "./comps/CompOrbitals";
import CompCoverage from "./comps/CompCoverage";
import CompPatterns from "./comps/CompPatterns";
import CompMinibrot from "./comps/CompMinibrot";

export class PaneComps extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }
   state = {
      selected_tab: 0,
   }

   on_tab_select = (selected_tab) => {
      this.setState({selected_tab})
   }

   render() {
      const {selected_tab} = this.state
      const {page_settings, on_settings_changed} = this.props
      const tabs_width = page_settings[KEY_COMPS_WIDTH_PX] - 10
      const tabs_style = {}
      const all_tabs = [
         {
            label: 'orbitals',
            content: <CompOrbitals
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
         {
            label: 'coverage',
            content: <CompCoverage
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
         {
            label: 'patterns',
            content: <CompPatterns
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
         {
            label: 'minibrot',
            content: <CompMinibrot
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
         {
            label: 'admin',
            content: <CompAdmin
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
      ]
      const all_labels = all_tabs.map(tab => tab.label)
      const wrapper_style = {
         height: page_settings[KEY_COMPS_HEIGHT_PX] - 50,
         width: page_settings[KEY_COMPS_WIDTH_PX] - 8,
      }
      const selected_content = <styles.TabsWrapper style={wrapper_style}>
         {all_tabs[selected_tab].content}
      </styles.TabsWrapper>
      return <CoolTabs
         labels={all_labels}
         selected_content={selected_content}
         on_tab_select={this.on_tab_select}
         tab_index={selected_tab}
         width_px={tabs_width}
         style={tabs_style}
      />
   }
}

export default PaneComps
