import network from "common/config/network.json";
import {decompressSync} from "fflate";
import {Buffer} from "buffer";
import axios from "axios";

export var CACHED_TILES = {}

export class FractoTileCache {

   static get_tile = async (short_code) => {
      if (CACHED_TILES[short_code]) {
         CACHED_TILES[short_code].last_access = Date.now()
         CACHED_TILES[short_code].access_count++
         return CACHED_TILES[short_code].uncompressed;
      }
      const level = short_code.length
      const naught = level < 10 ? '0' : ''
      const url = `${network["fracto-prod"]}/L${naught}${level}/${short_code}.gz`
      try {
         const response = await axios.get(url, {
            responseType: 'blob',
            headers: {
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Expose-Headers': 'Access-Control-*',
               'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            mode: 'no-cors',
            crossdomain: true,
         });
         const blob = new Blob([response.data], {type: 'application/gzip'});
         const arrayBuffer = await blob.arrayBuffer();
         const buffer = Buffer.from(arrayBuffer);
         // console.log('buffer', buffer)

         const decompressed = decompressSync(buffer);
         const ascii = Buffer.from(decompressed, 'ascii');
         const uncompressed = JSON.parse(ascii.toString());
         if (uncompressed) {
            CACHED_TILES[short_code] = {
               uncompressed: uncompressed,
               last_access: Date.now(),
               access_count: 1,
            }
         } else {
            console.error('failed to decompress');
         }
         return uncompressed
      } catch (e) {
         console.error(`get_tile error ${short_code}`, e.message)
         return null
      }
   }

}

export default FractoTileCache