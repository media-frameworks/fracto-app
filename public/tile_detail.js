import babel_register from "@babel/register";
import axios from "axios";
import {Buffer} from "buffer";
import {decompressSync} from "fflate";
import network from "../src/common/config/network.json" with {type: "json"};
import FractoIndexedTiles from "../src/fracto/FractoIndexedTiles.js";
import FractoTileDetail from "../src/fracto/FractoTileDetail.js";
import FractoCardioid from "../src/fracto/FractoCardioid.js";

babel_register({
   presets: ["preset-react", "preset-env"],
   extensions: [".ts,.tsx,.js,.jsx"],
})

const AXIOS_CONFIG = {
   responseType: 'arraybuffer',
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

const bounds_from_short_code = (short_code) => {
   let left = -2;
   let right = 2;
   let top = 2;
   let bottom = -2;
   let scope = 4.0;
   for (let i = 0; i < short_code.length; i++) {
      const half_scope = scope / 2;
      const digit = short_code[i];
      switch (digit) {
         case "0":
            right -= half_scope;
            bottom += half_scope;
            break;
         case "1":
            left += half_scope;
            bottom += half_scope;
            break;
         case "2":
            right -= half_scope;
            top -= half_scope;
            break;
         case "3":
            left += half_scope;
            top -= half_scope;
            break;
         default:
            debugger;
      }
      scope = half_scope;
   }
   return {
      left: left,
      right: right,
      top: top,
      bottom: bottom
   }
}

const collect_point_data = (short_code, tile) => {
   const bounds = bounds_from_short_code(short_code)
   const point_detail = FractoTileDetail.detail_point_data(bounds.left, bounds.top)
   console.log('point_detail', point_detail)
}

const generate = async (level) => {
   FractoIndexedTiles.load_short_codes('indexed', short_codes => {
      const indexed_tiles = new Array(50).fill({})
      const level_tiles = short_codes.filter(sc => {
         const code_level = sc.length
         return code_level === level
      })
      console.log('level_tiles', level_tiles)
      level_tiles.forEach(async short_code => {
         const tile = await get_tile(short_code)
         console.log(short_code)
         collect_point_data(short_code, tile)
      })
   })
}

FractoCardioid.load_rational_powers()
generate(3)