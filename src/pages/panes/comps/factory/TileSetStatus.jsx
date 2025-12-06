import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompFactoryStyles as styles} from 'styles/CompFactoryStyles'

export class TileSetStatus extends Component {
   static propTypes = {
      status_data: PropTypes.object.isRequired,
   }

   render() {
      return <styles.ContentWrapper>
         {'TileSetStatus'}
      </styles.ContentWrapper>
   }
}

export default TileSetStatus