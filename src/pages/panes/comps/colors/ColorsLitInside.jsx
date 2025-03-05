import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompColorsStyles as styles} from 'styles/CompColorsStyles';
import {KEY_COMPS_HEIGHT_PX, KEY_COMPS_WIDTH_PX} from "pages/PageSettings";
import FractoColorWheel from 'fracto/FractoColorWheel';

export class ColorsLitInside extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   render() {
      const {page_settings, on_settings_changed} = this.props
      const max_size_px = Math.min(
         page_settings[KEY_COMPS_WIDTH_PX],
         page_settings[KEY_COMPS_HEIGHT_PX] - 80)
      const color_wheel = <FractoColorWheel
         width_px={500}
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
      return <styles.ContentWrapper>
         {color_wheel}
      </styles.ContentWrapper>
   }
}

export default ColorsLitInside;
