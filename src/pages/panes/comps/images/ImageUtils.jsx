import React from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-regular-svg-icons";

import network from "common/config/network.json";
import {CompImagesStyles as styles} from 'styles/CompImagesStyles'

import {render_coordinates} from "fracto/styles/FractoStyles";
import ReactTimeAgo from "react-time-ago";

const AXIOS_CONFIG = {
   headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

export const render_image = async (
   focal_point, scope, size, collection, update_callback) => {
   let visitor_email = 'unknown'
   let visitor_name = 'unknown'
   const visitor_str = localStorage.getItem('visitor')
   if (visitor_str) {
      const visitor = JSON.parse(visitor_str)
      visitor_email = visitor.email
      visitor_name = visitor.name
   }
   const created = Date.now()
   const params = [
      {key: 'collection', value: collection},
      {key: 're', value: focal_point.x},
      {key: 'im', value: focal_point.y},
      {key: 'scope', value: scope},
      {key: 'width_px', value: size},
      {key: 'aspect_ratio', value: 1.0},
      {key: 'artist_email', value: visitor_email },
      {key: 'artist_name', value: visitor_name },
      {key: 'created', value: created },
   ].map(item => {
      return `${item.key}=${item.value}`
   }).join('&')
   const url = `${network.image_server_url}/render_image?${params}`
   return await axios.post(
      url,
      JSON.stringify({}),
      AXIOS_CONFIG
   )
}

export const render_focal_point = (focal_point) => {
   return focal_point
      ? render_coordinates(focal_point.x, focal_point.y, 9)
      : '-'
}

export const render_scope = (scope) => {
   const rounded = Math.round(scope * 100000000) / 100
   const mu = <i>{'\u03BC'}</i>
   return scope
      ? <div title={`${scope}`}>{rounded}{mu}</div>
      : '-'
}

export const render_view = (url) => {
   const icon_style = {color: 'darkcyan'};
   return <styles.LinkSpan
      style={icon_style}
      title={'view in tab'}
      onClick={e =>
         window.open(url, '_blank', 'noopener,noreferrer')
      }>
      <FontAwesomeIcon icon={faEye}/>
   </styles.LinkSpan>
}

export const render_timeago = (date)=> {
   console.log('render_timeago', date)
   return <ReactTimeAgo
      date={date}
   />;
}