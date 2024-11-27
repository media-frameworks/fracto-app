import {Component} from 'react';
import PropTypes from 'prop-types';

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
      const {page_settings} = this.props
      return `PaneSteps ${page_settings[KEY_STEPS_WIDTH_PX]}x${page_settings[KEY_STEPS_HEIGHT_PX]}`
   }
}

export default PaneSteps
