import {Component} from 'react';
import PropTypes from 'prop-types';

import FieldHeader from "./field/FieldHeader";
import FieldImage from "./field/FieldImage";
import {
   KEY_FIELD_WIDTH_PX
} from "../PageSettings";

const HEADER_HEIGHT_PX = 24

export class PaneField extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {on_settings_changed, page_settings} = this.props
      return [
         <FieldHeader
            width_px={page_settings[KEY_FIELD_WIDTH_PX]}
            height_px={HEADER_HEIGHT_PX}/>,
         <FieldImage
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />,
      ]
   }
}

export default PaneField
