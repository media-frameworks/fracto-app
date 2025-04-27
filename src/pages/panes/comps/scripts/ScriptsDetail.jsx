import {Component} from 'react';
import PropTypes from 'prop-types';
import {KEY_SCRIPT_SELECTED_DATA} from "settings/CompSettings";

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
      const {page_settings} = this.props
      const data_key = `${page_settings[KEY_SCRIPT_SELECTED_DATA]?.key}`
      return data_key
   }
}

export default ScriptsDetail;
