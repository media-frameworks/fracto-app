import {Component} from 'react';
import PropTypes from 'prop-types';

import StepsList from "./steps/StepsList";

import {
   KEY_STEPS_HEIGHT_PX,
   KEY_STEPS_WIDTH_PX
} from "../PageSettings";

export class PaneSteps extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render(){
      const {page_settings, on_settings_changed} = this.props
      return <StepsList
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
   }
}

export default PaneSteps
