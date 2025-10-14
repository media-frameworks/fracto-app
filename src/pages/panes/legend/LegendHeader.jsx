import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_LEGEND_WIDTH_PX,
} from "pages/settings/PaneSettings";
import {PaneLegendStyles as styles} from 'styles/PaneLegendStyles';

export class LegendHeader extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   componentDidMount() {
   }

   render() {
      const {page_settings} = this.props
      const extraStyle = {
         width: `${page_settings[KEY_LEGEND_WIDTH_PX]}px`
      }
      return <styles.LegendHeaderContent style={extraStyle}>
         <styles.LegendTitle>{'legend'}</styles.LegendTitle>
      </styles.LegendHeaderContent>
   }
}

export default LegendHeader
