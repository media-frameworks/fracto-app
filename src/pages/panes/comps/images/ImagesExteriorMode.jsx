import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'

export class ImagesExteriorMode extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render(){
      return <styles.ContentWrapper>
         ImagesExteriorMode
      </styles.ContentWrapper>
   }
}

export default ImagesExteriorMode
