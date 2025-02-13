import {Component} from 'react';
import PropTypes from 'prop-types';

import FieldHeader from "./field/FieldHeader";
import FieldImage from "./field/FieldImage";

export class PaneField extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {on_settings_changed, page_settings} = this.props
      return [
         <FieldHeader
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />,
         <FieldImage
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />,
      ]
   }
}

export default PaneField
