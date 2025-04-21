import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'
import {HEADER_HEIGHT_PX} from "styles/PageAppStyles";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {KEY_DISABLED, KEY_SCOPE} from "settings/AppSettings";

export class FieldHeader extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   on_magnify = (e, is_up) => {
      const {page_settings, on_settings_changed} = this.props
      if (page_settings[KEY_DISABLED]) {
         return;
      }
      let new_settings = {}
      const magnifier = e.shiftKey ? 2 : 1.618
      const mag_factor = is_up ? magnifier : 1 / magnifier
      new_settings[KEY_SCOPE] = page_settings[KEY_SCOPE] * mag_factor
      on_settings_changed(new_settings)
   }

   render() {
      const {page_settings} = this.props
      const buttonStyles = {
         cursor: page_settings[KEY_DISABLED] ? 'wait' : 'pointer',
         height: `${HEADER_HEIGHT_PX - 2}px`
      }
      return <styles.HeaderWrapper>
         <styles.MagnifyButton
            style={buttonStyles}
            title={'zoom out (boost w/shift)'}
            onClick={e => this.on_magnify(e, true)}>
            <styles.ButtonCaretUp icon={faCaretUp}/>
         </styles.MagnifyButton>
         <styles.MagnifyButton
            style={buttonStyles}
            title={'zoom in (boost w/shift)'}
            onClick={e => this.on_magnify(e, false)}>
            <styles.ButtonCaretDown icon={faCaretDown}/>
         </styles.MagnifyButton>
      </styles.HeaderWrapper>
   }
}

export default FieldHeader
