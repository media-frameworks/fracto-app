import {Component} from 'react';
import PropTypes from 'prop-types';

export class LegendTabReports extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   componentDidMount() {
   }

   render() {
      const {page_settings} = this.props
      return 'LegendTabReports'
   }
}

export default LegendTabReports
