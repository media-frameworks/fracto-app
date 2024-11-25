import {Component} from 'react';
import PropTypes from 'prop-types';

export class PaneComps extends Component {
   static propTypes = {
      width_px: PropTypes.number.isRequired,
      height_px: PropTypes.number.isRequired,
   }
   render(){
      const {width_px, height_px} = this.props
      return `PaneComps ${width_px}x${height_px}`
   }
}

export default PaneComps
