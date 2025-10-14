import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';
import {
   BAILIWICK_MODE_FREEFORM,
   BAILIWICK_MODE_INLINE,
   BAILIWICK_MODE_NODAL,
   KEY_BAILIWICK_MODE
} from "pages/settings/BailiwickSettings";
import {render_comp_modes} from "./CompUtils";
import BailiwicksFreeform from "./bailiwicks/BailiwicksFreeform";
import BailiwicksInline from "./bailiwicks/BailiwicksInline";
import BailiwicksNodal from "./bailiwicks/BailiwicksNodal";

const BAILIWICK_MODES = [
   {key: BAILIWICK_MODE_FREEFORM, label: 'freeform'},
   {key: BAILIWICK_MODE_INLINE, label: 'inline'},
   {key: BAILIWICK_MODE_NODAL, label: 'nodal'},
]

export class CompBailiwicks extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
   }

   render_bailiwick_mode = () => {
      const {page_settings, on_settings_changed} = this.props
      return render_comp_modes(
         BAILIWICK_MODES, KEY_BAILIWICK_MODE, page_settings, on_settings_changed)
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      let content = []
      switch (page_settings[KEY_BAILIWICK_MODE]) {
         case BAILIWICK_MODE_FREEFORM:
            content = <BailiwicksFreeform
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}/>
            break;
         case BAILIWICK_MODE_INLINE:
            content = <BailiwicksInline
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}/>
            break;
         case BAILIWICK_MODE_NODAL:
            content = <BailiwicksNodal
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}/>
            break;
         default:
            content = [page_settings[KEY_BAILIWICK_MODE]]
            break
      }
      const modes = this.render_bailiwick_mode()
      return [
         <styles.BailiwickModes>{modes}</styles.BailiwickModes>,
         <styles.BailiwicksContent>{content}</styles.BailiwicksContent>
      ]
   }
}

export default CompBailiwicks
