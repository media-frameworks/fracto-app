import axios from "axios";
import {Buffer} from "buffer";
import {decompressSync} from "fflate";
import network from "./src/common/config/network.json"  with { type: "json" };

const AXIOS_CONFIG = {
   responseType: 'blob',
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

const get_tile_url = async (url) => {
   try {
      const response = await axios.get(url, AXIOS_CONFIG);
      const blob = new Blob([response.data], {type: 'application/gzip'});
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer, 'base64')
      const decompressed = decompressSync(buffer);
      const ascii = Buffer.from(decompressed, 'ascii');
      return JSON.parse(ascii.toString());
   } catch (error) {
      console.log('get_tile_url', error)
      return null
   }
}

const get_tile = async (short_code) => {
   const level = short_code.length
   const naught = level < 10 ? '0' : ''
   const url = `${network["fracto-prod"]}/L${naught}${level}/${short_code}.gz`
   try {
      return get_tile_url(url)
   } catch (e) {
      console.error(`get_tile error ${short_code}`, e.message)
      return null
   }
}

const generate = async (short_code) => {
   const tile = await get_tile(short_code)
   console.log(tile)
}

generate('011')