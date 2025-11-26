import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompFactoryStyles as styles} from 'styles/CompFactoryStyles'
import {render_comp_modes} from "./CompUtils";
import {KEY_FACTORY_TYPE} from "../../settings/CompSettings";
import FactoryAuditor from "./factory/FactoryAuditor";
import FactoryGenerator from "./factory/FactoryGenerator";

export const FACTORY_TYPE_AUDITOR = 'factory_type_auditor'
export const FACTORY_TYPE_GENERATOR = 'factory_type_generator'

const FACTORY_MODES = [
   {key: FACTORY_TYPE_AUDITOR, label: 'auditor'},
   {key: FACTORY_TYPE_GENERATOR, label: 'generator'},
]

export class CompFactory extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
   }

   componentDidMount() {
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const modes = render_comp_modes(
         FACTORY_MODES, KEY_FACTORY_TYPE, page_settings, on_settings_changed)
      let content = []
      switch (page_settings[KEY_FACTORY_TYPE]) {
         case FACTORY_TYPE_AUDITOR:
            content = <FactoryAuditor
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break
         case FACTORY_TYPE_GENERATOR:
            content = <FactoryGenerator
               page_settings={page_settings}
               on_settings_changed={on_settings_changed}
            />
            break;
         default:
            break
      }
      return <styles.CompWrapper>
         {modes}
         {content}
      </styles.CompWrapper>
   }
}

export default CompFactory
