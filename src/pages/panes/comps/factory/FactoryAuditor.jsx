import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from "react-time-ago";

import network from "common/config/network.json";

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import LatestTileBlock from "./LatestTileBlock";
import {NumberInline, SmallNumberInline} from "fracto/styles/FractoStyles";
import {KEY_COMPS_WIDTH_PX} from 'pages/settings/PaneSettings'
import {KEY_FACTORY_AUDIT_TYPE} from "../../../settings/CompSettings";

const TILE_COUNT = 17;
const PAGE_REFRESH_TIME_MS = 3000;

export const AUDIT_NEW_TILES = 'audit_new_tiles'
export const AUDIT_UPDATED_TILES = 'audit_updated_tiles'

export class FactoryAuditor extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      new_tiles: [],
      updated_tiles: [],
      tile_blocks: {},
   }

   componentDidMount() {
      this.get_recents()
   }

   get_recents = async () => {
      const {page_settings} = this.props
      const {tile_blocks} = this.state
      let url = `${network["fracto-prod"]}/recent_tiles.php`
      const audit_type = page_settings[KEY_FACTORY_AUDIT_TYPE] === AUDIT_UPDATED_TILES
         ? 'updated'
         : 'new'
      try {
         const fetched = await fetch(url)
         const recent_tiles = await fetched.json()
         const item_keys = Object.keys(recent_tiles[audit_type])
         item_keys.forEach(key => {
            const short_code = key.slice(0, key.lastIndexOf("."));
            tile_blocks[short_code] = recent_tiles[audit_type][key]
         })
         this.setState({
            new_tiles: recent_tiles.new,
            updated_tiles: recent_tiles.updated,
            tile_blocks,
         })
      } catch (e) {
         console.log(e)
         return;
      }
      setTimeout(() => {
         this.get_recents()
      }, PAGE_REFRESH_TIME_MS)
   }

   set_audit_type = (new_type) => {
      const {on_settings_changed} = this.props
      on_settings_changed({
         [KEY_FACTORY_AUDIT_TYPE]: new_type
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
               key={`recent-${i}`}>
               <LatestTileBlock
                  short_code={short_code}
                  size_px={top_row ? large_width : small_width}
                  timecode={tile_blocks[short_code]}
                  on_settings_changed={on_settings_changed}
               />
               <styles.CenteredBlock>{title}</styles.CenteredBlock>
               <styles.CenteredBlock>
                  <styles.DateWrapper><ReactTimeAgo date={date}/></styles.DateWrapper>
               </styles.CenteredBlock>
            </styles.TileBlockWrapper>
         })
      const switch_link = page_settings[KEY_FACTORY_AUDIT_TYPE] === AUDIT_NEW_TILES
         ? <styles.TitleLink
            title={'click to view updated tiles'}
            onClick={() => this.set_audit_type(AUDIT_UPDATED_TILES)}>
            new
         </styles.TitleLink>
         : <styles.TitleLink
            title={'click to view new tiles'}
            onClick={() => this.set_audit_type(AUDIT_NEW_TILES)}>
            updated
         </styles.TitleLink>
      const preamble = [
         switch_link,
         ' tiles added moments ago at Fracto HQ'
      ]
      return <styles.ContentWrapper>
         <styles.PreambleWrapper>{preamble}</styles.PreambleWrapper>
         {new_tile_list}
      </styles.ContentWrapper>
   }
}

export default FactoryAuditor
