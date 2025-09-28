import React, {Component} from 'react';
import PropTypes from 'prop-types';
import network from "common/config/network.json";

import ReactTimeAgo from "react-time-ago";

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import {CoolStyles} from "common/ui/CoolImports";
import LatestTileBlock from "./latest/LatestTileBlock";
import {NumberInline, SmallNumberInline} from "fracto/styles/FractoStyles";
import {KEY_MODAL} from "settings/AppSettings";
import LatestTileDetail from "./latest/TileDetailModal";
import {KEY_COMPS_WIDTH_PX} from 'settings/PaneSettings'

const TILE_COUNT = 17;
const PAGE_REFRESH_TIME_MS = 3000;

export class CompNursery extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      new_tiles: [],
      updated_tiles: [],
      interval: null,
      tile_blocks: {},
   }

   componentDidMount() {
      this.get_recents()
   }

   get_recents = async () => {
      const {tile_blocks} = this.state
      let url = `${network["fracto-prod"]}/recent_tiles.php`
      try {
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
         })
      } catch (e) {
         console.log(e)
      }
      setTimeout(() => {
         this.get_recents()
      }, PAGE_REFRESH_TIME_MS)
   }

   tile_detail = (short_code) => {
      const {on_settings_changed} = this.props
      on_settings_changed({
         [KEY_MODAL]: <LatestTileDetail
            short_code={short_code}
            on_settings_changed={on_settings_changed}
         />
      })
   }

   render() {
      const {tile_blocks} = this.state
      const {page_settings, on_settings_changed} = this.props
      const frame_width = page_settings[KEY_COMPS_WIDTH_PX] - 25
      const margin = frame_width / 80
      const large_width = (frame_width - 4 * margin) / 3.125
      const small_width = (frame_width - 8 * margin) / 7.5
      const item_keys = Object.keys(tile_blocks)
      const new_tile_list = item_keys
         .sort((a, b) => tile_blocks[b] - tile_blocks[a])
         .slice(0, TILE_COUNT)
         .map((short_code, i) => {
            const date = new Date(tile_blocks[short_code] * 1000);
            const top_row = i < 3
            const title = top_row
               ? <NumberInline style={{width: `${large_width}px`}}>{short_code}</NumberInline>
               : <SmallNumberInline style={{width: `${small_width}px`}}>{short_code}</SmallNumberInline>
            return <styles.TileBlockWrapper
               style={{marginLeft: `${margin}px`}}
               key={`recent-${short_code}`}
               onClick={() => this.tile_detail(short_code)}>
               <LatestTileBlock
                  short_code={short_code}
                  size_px={top_row ? large_width : small_width}
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
      const preamble = 'New tiles added moments ago at Fracto HQ'
      return <styles.ContentWrapper>
         <styles.PreambleWrapper>{preamble}</styles.PreambleWrapper>
         {new_tile_list}
      </styles.ContentWrapper>
   }
}

export default CompNursery
