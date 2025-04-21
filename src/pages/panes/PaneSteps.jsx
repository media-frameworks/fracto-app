import {Component} from 'react';
import PropTypes from 'prop-types';

import StepsList from "./steps/StepsList";
import StepsHeader from "./steps/StepsHeader";
import {PaneStepsStyles as styles, HEADER_HEIGHT_PX} from "../../styles/PaneStepsStyles"
import {KEY_STEPS_HEIGHT_PX} from "settings/PaneSettings";

export class PaneSteps extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const steps_header = <StepsHeader
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
      const steps_list = <StepsList
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
      const list_height_px = page_settings[KEY_STEPS_HEIGHT_PX] - HEADER_HEIGHT_PX
      return [
         <styles.HeaderWrapper style={{height: HEADER_HEIGHT_PX}}>
            {steps_header}
         </styles.HeaderWrapper>,
         <styles.StepsListWrapper style={{height: list_height_px}}>
            {steps_list}
         </styles.StepsListWrapper>,
      ]
   }
}

export default PaneSteps
