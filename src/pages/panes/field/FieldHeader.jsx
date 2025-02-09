import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {KEY_DISABLED, KEY_SCOPE} from "../../PageSettings";

export class FieldHeader extends Component {
   static propTypes = {
      width_px: PropTypes.number.isRequired,
      height_px: PropTypes.number.isRequired,
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
      const {height_px, page_settings} = this.props
      const buttonStyles = {
         cursor: page_settings[KEY_DISABLED] ? 'wait' : 'pointer',
         height: `${height_px - 5}px`
      }
      return <styles.HeaderWrapper style={{height: `${height_px}px`}}>
         <styles.MagnifyButton
            style={buttonStyles}
            title={'zoom out (boost w/shift)'}
            onClick={e => this.on_magnify(e, true)}>
            <styles.ButtonCaret icon={faCaretUp}/>
         </styles.MagnifyButton>
         <styles.MagnifyButton
            style={buttonStyles}
            title={'zoom in (boost w/shift)'}
            onClick={e => this.on_magnify(e, false)}>
            <styles.ButtonCaret icon={faCaretDown}/>
         </styles.MagnifyButton>
      </styles.HeaderWrapper>
   }
}

export default FieldHeader
