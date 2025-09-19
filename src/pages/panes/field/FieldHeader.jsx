import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'
import {HEADER_HEIGHT_PX} from "styles/PageAppStyles";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {KEY_DISABLED, KEY_FIELD_COVERAGE, KEY_FIELD_CROSSHAIRS, KEY_SCOPE} from "settings/AppSettings";

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
      const magnifier = e.shiftKey ? 5 : 3
      const mag_factor = is_up ? magnifier : 1 / magnifier
      on_settings_changed({
         [KEY_SCOPE]: page_settings[KEY_SCOPE] * mag_factor,
         [KEY_DISABLED]: true,
      })
   }

   on_mouse_move = () => {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_FIELD_CROSSHAIRS]: false})
   }

   render() {
      const {page_settings} = this.props
      const buttonStyles = {
         cursor: page_settings[KEY_DISABLED] ? 'wait' : 'pointer',
         height: `${HEADER_HEIGHT_PX - 2}px`
      }
      const field_coverage = page_settings[KEY_FIELD_COVERAGE]
      let highest_level = '='
      if (field_coverage && field_coverage.length > 0) {
         highest_level = field_coverage[0].split(':')[0]
      }
      return <styles.HeaderWrapper onMouseMove={this.on_mouse_move}>
         <styles.HighestLevelBadge
            title={'Highest render level for this frame'}>
            {highest_level}
         </styles.HighestLevelBadge>
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
