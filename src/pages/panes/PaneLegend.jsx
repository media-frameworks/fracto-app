import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_LEGEND_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX,
   KEY_HOVER_POINT
} from "../PageSettings";

export class PaneLegend extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings} = this.props
      const {hover_point} = page_settings
      return [
         `PaneLegend ${page_settings[KEY_LEGEND_WIDTH_PX]}x${page_settings[KEY_LEGEND_HEIGHT_PX]}`,
         <br/>,
         `${hover_point ? hover_point.x : ''}x${hover_point ? hover_point.y : ''}`,

      ]
   }
}

export default PaneLegend
