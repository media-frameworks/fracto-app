import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class GenerateTileSet extends Component {
   static propTypes = {
      tile_set: PropTypes.string.isRequired,
      operation_type: PropTypes.string.isRequired,
      on_tile_complete: PropTypes.func.isRequired,
      on_job_complete: PropTypes.func.isRequired
   }

   render() {
      return 'GenerateTileSet'
   }
}

export default GenerateTileSet
