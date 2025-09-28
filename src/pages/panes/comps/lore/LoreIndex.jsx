import {Component} from "react";
import PropTypes from "prop-types";

export class LoreIndex extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
   }

   render(){
      return 'LoreIndex'
   }
}

export default LoreIndex
