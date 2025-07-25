import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
} from "../../settings/PaneSettings";
import {CoolTabs} from "common/ui/CoolImports";
import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'

import CompAdmin from "./comps/CompAdmin";
import CompOrbitals from "./comps/CompOrbitals";
import CompPatterns from "./comps/CompPatterns";
// import CompMinibrot from "./comps/CompMinibrot";
import CompNursery from "./comps/CompNursery";
import CompInspect from "./comps/CompInspect";
// import CompColors from "./comps/CompColors";
import CompScript from "./comps/CompScript";
import CompPoints from "./comps/CompPoints";
import CoolStyles from "../../common/ui/styles/CoolStyles";

export const TAB_HEIGHT_PX = 20

export class PaneComps extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      selected_tab: 5,
   }

   on_tab_select = (selected_tab) => {
      this.setState({selected_tab})
   }

   render() {
      const {selected_tab} = this.state
      const {page_settings, on_settings_changed} = this.props
      const tabs_width = page_settings[KEY_COMPS_WIDTH_PX] - 20
      const tabs_style = {
         height: `${TAB_HEIGHT_PX}px`,
      }
      const all_tabs = [
         {
            label: 'points',
            content: <CompPoints
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
         {
            label: 'orbitals',
            content: <CompOrbitals
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
            label: 'inspect',
            content: <CompInspect
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
         // {
         //    label: 'minibrot',
         //    content: <CompMinibrot
         //       page_settings={page_settings}
         //       on_settings_changed={on_settings_changed}
         //    />
         // },
         // {
         //    label: 'colors',
         //    content: <CompColors
         //       page_settings={page_settings}
         //       on_settings_changed={on_settings_changed}
         //    />
         // },
         {
            label: 'nursery',
            content: <CompNursery
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
         {
            label: 'script',
            content: <CompScript
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
         },
      ].map(tab => {
         const labelStyle = {
            fontSize: `${tabs_width / 75}px`,
            padding: `${TAB_HEIGHT_PX / 5}px ${tabs_width / 60}px`,
            // height: `${TAB_HEIGHT_PX}px`,
         }
         return {
            label: <CoolStyles.InlineBlock style={labelStyle}>
               {tab.label}
            </CoolStyles.InlineBlock>,
            content: tab.content
         }
      })
      const all_labels = all_tabs.map(tab => tab.label)
      const wrapper_style = {
         height: page_settings[KEY_COMPS_HEIGHT_PX] - 52,
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
