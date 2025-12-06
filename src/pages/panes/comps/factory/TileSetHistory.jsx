import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompFactoryStyles as styles} from 'styles/CompFactoryStyles'

export class TileSetHistory extends Component {
   static propTypes = {
      history_data: PropTypes.object.isRequired,
   }

   render() {
      return <styles.ContentWrapper>
         {'TileSetHistory'}
      </styles.ContentWrapper>
   }
}

export default TileSetHistory