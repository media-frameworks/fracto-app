import axios from "axios";
import network from "common/config/network.json";
import {
   CALLBACK_BASIS,
   fill_canvas_buffer,
   init_canvas_buffer
} from "fracto/FractoTileData";

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
   const update_status = CALLBACK_BASIS
   // const canvas_buffer = init_canvas_buffer(size, 1.0);
   // await fill_canvas_buffer(
   //    canvas_buffer,
   //    size,
   //    focal_point,
   //    scope, 1.0,
   //    update_callback,
   //    update_status
   // )
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
