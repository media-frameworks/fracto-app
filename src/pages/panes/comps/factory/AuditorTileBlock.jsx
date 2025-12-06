import React, {Component} from 'react';
import PropTypes from 'prop-types';
import network from "common/config/network.json";

import FractoTileCache from "fracto/FractoTileCache";
import FractoTileRender from "fracto/FractoTileRender";
import FractoUtil from "fracto/FractoUtil";
import CoolStyles from "common/ui/styles/CoolStyles";

export class AuditorTileBlock extends Component {
   static propTypes = {
      short_code: PropTypes.string.isRequired,
      timecode: PropTypes.number.isRequired,
      size_px: PropTypes.number.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      tile_data: [],
   }

   componentDidMount() {
      this.get_tile_data()
   }

   get_tile_data = async () => {
      const {short_code} = this.props
      const url = `${network["fracto-prod"]}/new/${short_code}.gz`
      const tile_data = await FractoTileCache.get_tile_url(url)
      this.setState({tile_data})
   }

   render() {
      const {tile_data} = this.state
      const {short_code, size_px} = this.props
      const tile = {
         short_code: short_code,
         bounds: FractoUtil.bounds_from_short_code(short_code)
      }
      return <CoolStyles.InlineBlock
         style={{cursor: "pointer"}}>
         <FractoTileRender
            width_px={size_px}
            tile_data={tile_data}
            tile={tile}
         />
      </CoolStyles.InlineBlock>
   }
}

export default AuditorTileBlock
