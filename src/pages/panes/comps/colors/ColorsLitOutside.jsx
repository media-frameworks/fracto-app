import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompColorsStyles as styles} from 'styles/CompColorsStyles';
import {KEY_COMPS_HEIGHT_PX, KEY_COMPS_WIDTH_PX} from "pages/PageSettings";

export class ColorsLitOutside extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   render() {
      const {page_settings} = this.props
      const max_size_px = Math.min(
         page_settings[KEY_COMPS_WIDTH_PX],
         page_settings[KEY_COMPS_HEIGHT_PX] - 80)
      return <styles.ContentWrapper>
         {'ColorsLitOutside'}
      </styles.ContentWrapper>
   }
}

export default ColorsLitOutside;
