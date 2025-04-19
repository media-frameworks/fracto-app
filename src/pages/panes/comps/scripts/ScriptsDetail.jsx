import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class ScriptsDetail extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
   }

   componentDidMount() {
   }

   render() {
      return 'ScriptsDetail'
   }
}

export default ScriptsDetail;
