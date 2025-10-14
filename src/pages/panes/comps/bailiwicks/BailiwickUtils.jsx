import React from "react";
import axios from "axios";
import network from "common/config/network.json" with {type: "json"}

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';

import {
   BAILIWICK_MODE_FREEFORM,
   BAILIWICK_MODE_INLINE,
   BAILIWICK_MODE_NODAL,
   COLUMN_ID_MODIFIED,
   COLUMN_ID_NAME,
   COLUMN_ID_PATTERN,
   COLUMN_ID_SIZE
} from "pages/settings/BailiwickSettings";
import { render_pattern_block} from "fracto/styles/FractoStyles";
import ReactTimeAgo from "react-time-ago";

const FRACTO_PROD = network["fracto-prod"]

const AXIOS_CONFIG = {
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

export const fetch_bailiwicks = async (bailiwick_mode) => {
   const url = `${FRACTO_PROD}/manifest/all_bailiwicks.json`
   const bailiwick_data = await axios.get(url, AXIOS_CONFIG)
   switch (bailiwick_mode) {
      case BAILIWICK_MODE_FREEFORM:
         return bailiwick_data.data.filter(data => !data.is_inline && !data.is_node)
      case BAILIWICK_MODE_INLINE:
         return bailiwick_data.data.filter(data => data.is_inline)
      case BAILIWICK_MODE_NODAL:
         return bailiwick_data.data.filter(data => data.is_nodal)
      default:
         console.log('unknown bailiwick_mode', bailiwick_mode)
         return []
   }
}

export const render_pattern = (pattern) => {
   return render_pattern_block(pattern, 12)
}

export const render_size = (size) => {
   let scalar = 1
   if (size < 100) {
      scalar = 100
   }
   if (size < 10) {
      scalar = 1000
   }
   const rounded = Math.round(size * 100000000 * scalar) / (100 * scalar)
   const mu = <i>{'\u03BC'}</i>
   return size
      ? <styles.NameSpan title={`${size}`}>{rounded}{mu}</styles.NameSpan>
      : '-'
}

export const render_time_ago = (date) => {
   return <styles.TimeAgoText>
      <ReactTimeAgo date={Date.parse(date.toString())}/>
   </styles.TimeAgoText>
}

export const compare_bailiwicks = (a, b, sort_column_id, sort_ascending) => {
   switch (sort_column_id) {
      case COLUMN_ID_SIZE:
         return sort_ascending
            ? a.magnitude - b.magnitude
            : b.magnitude - a.magnitude
      case COLUMN_ID_PATTERN:
         if (a.pattern === b.pattern) {
            return sort_ascending
               ? b.magnitude - a.magnitude
               : a.magnitude - b.magnitude
         }
         return sort_ascending
            ? a.pattern - b.pattern
            : b.pattern - a.pattern
      case COLUMN_ID_NAME:
         return sort_ascending
            ? a.name > b.name ? -1 : 1
            : a.name > b.name ? 1 : -1
      case COLUMN_ID_MODIFIED:
         return sort_ascending
            ? a.updated_at > b.updated_at ? -1 : 1
            : a.updated_at > b.updated_at ? 1 : -1
      default:
         console.log('compare_bailiwicks sort_column_id', sort_column_id)
         return 0;
   }
}
