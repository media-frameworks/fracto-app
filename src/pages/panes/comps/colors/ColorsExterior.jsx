import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompColorsStyles as styles} from 'styles/CompColorsStyles';

export class ColorsExterior extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   render() {
      return <styles.ContentWrapper>
         {'ColorsExterior'}
      </styles.ContentWrapper>
   }
}

export default ColorsExterior;
