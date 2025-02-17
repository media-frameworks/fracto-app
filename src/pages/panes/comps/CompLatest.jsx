import React, {Component} from 'react';
import PropTypes from 'prop-types';
import network from "common/config/network.json";

import ReactTimeAgo from "react-time-ago";

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import {CoolStyles} from "common/ui/CoolImports";
import LatestTileBlock from "./latest/LatestTileBlock";
import {NumberSpan, SmallNumberSpan} from "fracto/styles/FractoStyles";
import {KEY_MODAL} from "../../PageSettings";
import LatestTileDetail from "./latest/TileDetailModal";

const TILE_COUNT = 25;

export class CompLatest extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      new_tiles: [],
      updated_tiles: [],
      interval: null,
      tile_blocks: {},
      update_counter: 0,
   }

   componentDidMount() {
      this.get_recents()
   }

   get_recents = async () => {
      const {tile_blocks, update_counter} = this.state
      let url = `${network["fracto-prod"]}/recent_tiles.php`
      const fetched = await fetch(url)
      const recent_tiles = await fetched.json()
      const item_keys = Object.keys(recent_tiles.new)
      item_keys.forEach(key => {
         const short_code = key.slice(0, key.lastIndexOf("."));
         tile_blocks[short_code] = recent_tiles.new[key]
      })
      this.setState({
         new_tiles: recent_tiles.new,
         updated_tiles: recent_tiles.updated,
         tile_blocks,
         update_counter: update_counter + 1
      })
      setTimeout(() => {
         this.get_recents()
      }, 15000)
   }

   tile_detail = (short_code) => {
      const {on_settings_changed} = this.props
      let new_settings = {}
      new_settings[KEY_MODAL] = <LatestTileDetail
         short_code={short_code}
         on_settings_changed={on_settings_changed}
      />
      on_settings_changed(new_settings)
   }

   render() {
      const {tile_blocks, update_counter} = this.state
      const {on_settings_changed} = this.props
      const item_keys = Object.keys(tile_blocks)
      const new_tile_list = item_keys
         .sort((a, b) => tile_blocks[b] - tile_blocks[a])
         .slice(0, TILE_COUNT)
         .map((short_code, i) => {
            const date = new Date(tile_blocks[short_code] * 1000);
            const title = i === 0
               ? <NumberSpan>{short_code}</NumberSpan>
               : <SmallNumberSpan>{short_code}</SmallNumberSpan>
            return <styles.TileBlockWrapper
               onClick={()=>this.tile_detail(short_code)}>
               <LatestTileBlock
                  key={`recent-${short_code}`}
                  short_code={short_code}
                  size_px={i === 0 ? 300 : 128}
                  timecode={tile_blocks[short_code]}
                  on_settings_changed={on_settings_changed}
               />
               <CoolStyles.Block
                  style={{textAlign: 'center'}}>
                  {title}
               </CoolStyles.Block>
               <CoolStyles.Block
                  style={{textAlign: 'center'}}>
                  <styles.DateWrapper>
                     <ReactTimeAgo date={date}/>
                  </styles.DateWrapper>
               </CoolStyles.Block>
            </styles.TileBlockWrapper>
         })
      const preamble = 'Let\'s give a hearty welcome to the latest members of the Tile Matrix family!'
      const sub_preamble = "new tiles will be integrated twice daily -- click on any tile for more info"
      return <styles.ContentWrapper key={`wrapper-${update_counter}`}>
         <styles.PreambleWrapper>{preamble}</styles.PreambleWrapper>
         <styles.SubPreambleWrapper>{sub_preamble}</styles.SubPreambleWrapper>
         {new_tile_list}
      </styles.ContentWrapper>
   }
}

export default CompLatest
