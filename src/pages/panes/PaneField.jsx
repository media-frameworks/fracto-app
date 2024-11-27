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
      on_hover: PropTypes.func,
   }

   render() {
      const {on_hover, on_settings_changed, page_settings} = this.props
      return [
         <FieldHeader
            width_px={page_settings[KEY_FIELD_WIDTH_PX]}
            height_px={HEADER_HEIGHT_PX}/>,
         <FieldImage
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
            on_hover={on_hover}
         />,
      ]
   }
}

export default PaneField
