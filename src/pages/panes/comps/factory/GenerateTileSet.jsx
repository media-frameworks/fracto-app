import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompFactoryStyles as styles} from 'styles/CompFactoryStyles'

export class GenerateTileSet extends Component {
   static propTypes = {
      tile_set: PropTypes.string.isRequired,
      operation_type: PropTypes.string.isRequired,
      on_tile_complete: PropTypes.func.isRequired,
      on_job_complete: PropTypes.func.isRequired
   }

   render_tile_context = () => {
      return 'render_tile_context';
   }

   render_new_tile = () => {
      return 'render_new_tile';
   }

   render_navigator = () => {
      return 'render_navigator';
   }

   render() {
      const tile_context = this.render_tile_context()
      const new_tile = this.render_new_tile()
      const navigator = this.render_navigator()
      return <styles.ContentWrapper>
         {tile_context}
         {new_tile}
         {navigator}
      </styles.ContentWrapper>
   }
}

export default GenerateTileSet
