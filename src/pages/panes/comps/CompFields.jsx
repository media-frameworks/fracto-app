import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompOrbitalStyles as styles} from "styles/CompOrbitalStyles"
import PageSettings from "pages/PageSettings";
import {
   KEY_CANVAS_BUFFER,
   KEY_UPDATE_INDEX
} from "pages/settings/AppSettings";
import {KEY_FIELDS_TYPE} from "pages/settings/CompSettings";

import {render_comp_modes} from "./CompUtils";
import FieldsHistogram from "./fields/FieldsHistogram";
import FieldsColorWheel from "./fields/FieldsColorWheel";
import FieldsFamilySpan from "./fields/FieldsFamilySpan";
import FieldsColorChart from "./fields/FieldsColorChart";

export const FIELDS_TYPE_SEPARATIONS = 'fields_type_separations'
export const FIELDS_TYPE_PROFILES = 'fields_type_profiles'

const FIELDS_MODES = [
   {key: FIELDS_TYPE_SEPARATIONS, label: 'separations'},
   {key: FIELDS_TYPE_PROFILES, label: 'profiles'},
]

export class CompFields extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      stored_values: {},
   }

   componentDidMount() {
      const {page_settings, on_settings_changed} = this.props
      const {update_index} = page_settings;
      on_settings_changed({[KEY_UPDATE_INDEX]: update_index + 1})
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {stored_values} = this.state
      const {page_settings, on_settings_changed} = this.props
      const settings_changed = PageSettings.test_update_settings(
         [KEY_CANVAS_BUFFER], this.props, stored_values)
      const {update_index} = page_settings;
      if (settings_changed) {
         on_settings_changed({[KEY_UPDATE_INDEX]: update_index + 1})
      }
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const modes = render_comp_modes(
         FIELDS_MODES, KEY_FIELDS_TYPE, page_settings, on_settings_changed)
      let content = []
      switch (page_settings[KEY_FIELDS_TYPE]) {
         case FIELDS_TYPE_SEPARATIONS:
            content = [
               <FieldsColorWheel
                  page_settings={page_settings}
                  on_settings_changed={on_settings_changed}
               />,
               <FieldsFamilySpan
                  page_settings={page_settings}
                  on_settings_changed={on_settings_changed}
               />,
               <FieldsColorChart
                  page_settings={page_settings}
                  on_settings_changed={on_settings_changed}
               />,
               <FieldsHistogram
                  page_settings={page_settings}
                  on_settings_changed={on_settings_changed}
               />,
            ]
            break
         case FIELDS_TYPE_PROFILES:
            content = 'profiles here'
            break;
         default:
            break
      }
      return [
         <styles.ContentWrapper>
            {modes}
            {content}
         </styles.ContentWrapper>
      ]
   }
}

export default CompFields
