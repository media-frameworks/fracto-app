import {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'

export class FieldHeader extends Component {
   static propTypes = {
      width_px: PropTypes.number.isRequired,
      height_px: PropTypes.number.isRequired,
   }
   render(){
      const {height_px} = this.props
      return <styles.HeaderWrapper style={{height: `${height_px}px`}} />
   }
}

export default FieldHeader
