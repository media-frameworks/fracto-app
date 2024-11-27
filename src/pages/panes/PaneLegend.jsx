import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_LEGEND_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX
} from "../PageSettings";

export class PaneLegend extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render(){
      const {page_settings} = this.props
      return `PaneLegend ${page_settings[KEY_LEGEND_WIDTH_PX]}x${page_settings[KEY_LEGEND_HEIGHT_PX]}`
   }
}

export default PaneLegend
