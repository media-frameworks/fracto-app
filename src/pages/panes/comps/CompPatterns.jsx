import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import {KEY_PATTERN_TYPE} from "settings/CompSettings";
import PatternsOrbital from "./patterns/PatternsOrbital";
import PatternsMeridian from "./patterns/PatternsMeridian";

ChartJS.register(CategoryScale, BarController)

export const PATTERN_TYPE_ORBITALS = 'pattern_type_orbitals'
export const PATTERN_TYPE_MERIDIANS = 'pattern_type_meridians'

export class CompPatterns extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   set_pattern_type = (pattern_type) => {
      const {on_settings_changed} = this.props
      on_settings_changed({[KEY_PATTERN_TYPE]: pattern_type,})
   }

   render_pattern_type = () => {
      const {page_settings} = this.props
      const pattern_type = page_settings[KEY_PATTERN_TYPE] || PATTERN_TYPE_ORBITALS
      const deselected_style = {color: '#aaaaaa', fontWeight: 400}
      return <styles.CenteredBlock>
         <input
            type={"radio"}
            checked={pattern_type === PATTERN_TYPE_ORBITALS}
            onClick={() => this.set_pattern_type(PATTERN_TYPE_ORBITALS)}
         />
         <styles.PatternTypePrompt
            style={pattern_type === PATTERN_TYPE_MERIDIANS ? deselected_style : {}}
            onClick={() => this.set_pattern_type(PATTERN_TYPE_ORBITALS)}
         >{'orbital'}
         </styles.PatternTypePrompt>
         <styles.Spacer/>
         <input
            type={"radio"}
            checked={pattern_type === PATTERN_TYPE_MERIDIANS}
            onClick={() => this.set_pattern_type(PATTERN_TYPE_MERIDIANS)}
         />
         <styles.PatternTypePrompt
            style={pattern_type === PATTERN_TYPE_ORBITALS ? deselected_style : {}}
            onClick={() => this.set_pattern_type(PATTERN_TYPE_MERIDIANS)}
         >
            {'meridian'}
         </styles.PatternTypePrompt>
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const pattern_content = page_settings[KEY_PATTERN_TYPE] === PATTERN_TYPE_ORBITALS
         ? <PatternsOrbital
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />
         : <PatternsMeridian
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />
      return <styles.ContentWrapper>
         {this.render_pattern_type()}
         {pattern_content}
      </styles.ContentWrapper>
   }
}

export default CompPatterns;
