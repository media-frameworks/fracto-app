import React, {Component} from 'react';
import PropTypes from 'prop-types';

import network from "common/config/network.json";
import {CoolStyles, CoolModal} from "common/ui/CoolImports";
import {KEY_MODAL} from "pages/PageSettings";

import FractoTileContext from "fracto/FractoTileContext";
import FractoUtil from "fracto/FractoUtil";
import FractoTileRender from "fracto/FractoTileRender";
import FractoTileCache from "fracto/FractoTileCache";

export class TileDetailModal extends Component {
   static propTypes = {
      short_code: PropTypes.string.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {tile_data: []}

   componentDidMount() {
      this.get_tile_data()
   }

   get_tile_data = async () => {
      const {short_code} = this.props
      const url = `${network["fracto-prod"]}/new/${short_code}.gz`
      const tile_data = await FractoTileCache.get_tile_url(url)
      this.setState({tile_data})
   }

   handle_response = (r) => {
      const {on_settings_changed} = this.props
      if (!r) {
         let new_settings = {};
         new_settings[KEY_MODAL] = null
         on_settings_changed(new_settings)
      }
   }

   render() {
      const {tile_data} = this.state
      const {short_code} = this.props
      const tile = {
         short_code,
         bounds: FractoUtil.bounds_from_short_code(short_code)
      }
      const modal_content = [
         <FractoTileContext tile={tile} width_px={350}/>,
         <FractoTileRender width_px={350} tile={tile} tile_data={tile_data}/>,
      ]
      return <CoolModal
         contents={<CoolStyles.Block>{modal_content}</CoolStyles.Block>}
         width={"80rem"}
         response={this.handle_response}
         title_text={`tile detail`}
      />
   }
}

export default TileDetailModal
