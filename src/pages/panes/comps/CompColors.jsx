import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompColorsStyles as styles} from 'styles/CompColorsStyles';
import {KEY_LIT_TYPE, KEY_UPDATE_INDEX} from "../../PageSettings";
import ColorsInterior from "./colors/ColorsInterior";
import ColorsExterior from "./colors/ColorsExterior";

export const COLORS_INTERNAL = 'colors_internal'
export const COLORS_EXTERNAL = 'colors_external'

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
      const lit_type = page_settings[KEY_LIT_TYPE] || COLORS_INTERNAL
      const unlit_style = {color: '#aaaaaa', fontWeight: 400}
      return <styles.CenteredBlock>
         <input
            type={"radio"}
            checked={lit_type === COLORS_INTERNAL}
            onClick={() => this.set_lit_type(COLORS_INTERNAL)}
         />
         <styles.LitPrompt
            style={lit_type === COLORS_EXTERNAL ? unlit_style : {}}
            onClick={() => this.set_lit_type(COLORS_INTERNAL)}
         >{'internal'}
         </styles.LitPrompt>
         <styles.Spacer/>
         <input
            type={"radio"}
            checked={lit_type === COLORS_EXTERNAL}
            onClick={() => this.set_lit_type(COLORS_EXTERNAL)}
         />
         <styles.LitPrompt
            style={lit_type === COLORS_INTERNAL ? unlit_style : {}}
            onClick={() => this.set_lit_type(COLORS_EXTERNAL)}
         >
            {'external'}
         </styles.LitPrompt>
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const lit_row = this.render_lit_row()
      const lit_type = page_settings[KEY_LIT_TYPE] || COLORS_INTERNAL
      const lit_content = lit_type === COLORS_INTERNAL
         ? <ColorsInterior
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>
         : <ColorsExterior
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}/>
      return <styles.ContentWrapper>
         {lit_row}
         {lit_content}
      </styles.ContentWrapper>
   }
}

export default CompColors;
