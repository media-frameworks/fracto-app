import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";

import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import PatternsOrbital from "./patterns/PatternsOrbital";

ChartJS.register(CategoryScale, BarController)

export const PATTERN_TYPE_ORBITALS = 'pattern_type_orbitals'

export class CompPatterns extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const pattern_content = <PatternsOrbital
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
      return <styles.ContentWrapper>
         {pattern_content}
      </styles.ContentWrapper>
   }
}

export default CompPatterns;
