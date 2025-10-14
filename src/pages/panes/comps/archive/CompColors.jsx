import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompColorsStyles as styles} from 'styles/CompColorsStyles';
import {KEY_UPDATE_INDEX} from "pages/settings/AppSettings";
import ColorsInterior from "./colors/ColorsInterior";
import ColorsExterior from "./colors/ColorsExterior";
import {KEY_COLORATION_TYPE} from "pages/settings/CompSettings";

export const COLORS_INTERNAL = 'colors_internal'
export const COLORS_EXTERNAL = 'colors_external'

export class CompColors extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   set_coloration_type = (coloration_type) => {
      const {page_settings, on_settings_changed} = this.props
      on_settings_changed({
         [KEY_COLORATION_TYPE] : coloration_type,
         [KEY_UPDATE_INDEX]: page_settings[KEY_UPDATE_INDEX] + 1
      })
   }

   render_lit_row = () => {
      const {page_settings} = this.props
      const coloration_type = page_settings[KEY_COLORATION_TYPE] || COLORS_INTERNAL
      const unlit_style = {color: '#aaaaaa', fontWeight: 400}
      return <styles.CenteredBlock>
         <input
            type={"radio"}
            checked={coloration_type === COLORS_INTERNAL}
            onClick={() => this.set_coloration_type(COLORS_INTERNAL)}
         />
         <styles.LitPrompt
            style={coloration_type === COLORS_EXTERNAL ? unlit_style : {}}
            onClick={() => this.set_coloration_type(COLORS_INTERNAL)}
         >{'internal'}
         </styles.LitPrompt>
         <styles.Spacer/>
         <input
            type={"radio"}
            checked={coloration_type === COLORS_EXTERNAL}
            onClick={() => this.set_coloration_type(COLORS_EXTERNAL)}
         />
         <styles.LitPrompt
            style={coloration_type === COLORS_INTERNAL ? unlit_style : {}}
            onClick={() => this.set_coloration_type(COLORS_EXTERNAL)}
         >
            {'external'}
         </styles.LitPrompt>
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const lit_row = this.render_lit_row()
      const coloration_type = page_settings[KEY_COLORATION_TYPE] || COLORS_INTERNAL
      const lit_content = coloration_type === COLORS_INTERNAL
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
