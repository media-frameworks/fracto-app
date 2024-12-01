import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_STEPS_HEIGHT_PX,
   KEY_STEPS_WIDTH_PX
} from "../../PageSettings";

export class StepsList extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      scope_delta_factor: 1.618,
   }

   render(){
      const {page_settings} = this.props
      return ['StepsList']
   }
}

export default StepsList
