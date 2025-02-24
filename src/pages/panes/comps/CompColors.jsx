import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompColorsStyles as styles} from 'styles/CompColorsStyles';
import {KEY_COMPS_HEIGHT_PX, KEY_COMPS_WIDTH_PX, KEY_LIT_TYPE, KEY_UPDATE_INDEX} from "../../PageSettings";
import FractoColorWheel from 'fracto/FractoColorWheel';

export const LIT_TYPE_INSIDE = 'lit_type_inside'
export const LIT_TYPE_OUTSIDE = 'lit_type_outside'

export class CompColors extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   set_lit_type = (lit_type) => {
      const {page_settings, on_settings_changed} = this.props
      let new_settings = {}
      new_settings[KEY_LIT_TYPE] = lit_type
      new_settings[KEY_UPDATE_INDEX] = page_settings[KEY_UPDATE_INDEX] + 1
      on_settings_changed(new_settings)
   }

   render_lit_row = () => {
      const {page_settings} = this.props
      const lit_type = page_settings[KEY_LIT_TYPE] || LIT_TYPE_INSIDE
      const unlit_style = {color: '#aaaaaa', fontWeight: 400}
      return <styles.CenteredBlock>
         <input
            type={"radio"}
            checked={lit_type === LIT_TYPE_INSIDE}
            onClick={() => this.set_lit_type(LIT_TYPE_INSIDE)}
         />
         <styles.LitPrompt
            style={lit_type === LIT_TYPE_OUTSIDE ? unlit_style : {}}
            onClick={() => this.set_lit_type(LIT_TYPE_INSIDE)}
         >{'lit on the inside'}
         </styles.LitPrompt>
         <styles.Spacer/>
         <input
            type={"radio"}
            checked={lit_type === LIT_TYPE_OUTSIDE}
            onClick={() => this.set_lit_type(LIT_TYPE_OUTSIDE)}
         />
         <styles.LitPrompt
            style={lit_type === LIT_TYPE_INSIDE ? unlit_style : {}}
            onClick={() => this.set_lit_type(LIT_TYPE_OUTSIDE)}
         >
            {'lit on the outside'}
         </styles.LitPrompt>
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const max_size_px = Math.min(
         page_settings[KEY_COMPS_WIDTH_PX],
         page_settings[KEY_COMPS_HEIGHT_PX] - 80)
      const lit_row = this.render_lit_row()
      const color_wheel = <FractoColorWheel
         width_px={500}
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
      return <styles.ContentWrapper>
         {lit_row}
         {color_wheel}
      </styles.ContentWrapper>
   }
}

export default CompColors;
