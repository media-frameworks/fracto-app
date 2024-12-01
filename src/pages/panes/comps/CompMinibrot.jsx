import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "../../PageSettings";

export class CompMinibrot extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings} = this.props
      return `CompMinibrot ${page_settings[KEY_COMPS_WIDTH_PX]}x${page_settings[KEY_COMPS_HEIGHT_PX]}`
   }
}

export default CompMinibrot
