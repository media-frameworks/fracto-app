import network from "../common/config/network.json" with { type: "json" };

const URL_BASE = network['fracto-prod'];
// const SERVER_BASE = network.fracto_server_url;

export const TILE_SET_INDEXED = 'indexed'
export const TILE_SET_READY = 'ready'
export const TILE_SET_INLAND = 'inland'
export const TILE_SET_NEW = 'new'
export const TILE_SET_EMPTY = 'empty'
export const TILE_SET_UPDATED = 'updated'
const ALL_TILE_SETS = [
   TILE_SET_INDEXED,
   TILE_SET_READY,
   TILE_SET_INLAND,
   TILE_SET_NEW,
   TILE_SET_EMPTY,
   TILE_SET_UPDATED,
]

export const MAX_LEVEL = 35

export class FractoIndexedTiles {

   static tile_set = null;
   static tile_sets_loaded = [];
   static init_tile_sets = () => {
      if (FractoIndexedTiles.tile_set !== null) {
         return;
      }
      const tile_set = {};
      for (const set_name of ALL_TILE_SETS) {
         const arr = new Array(MAX_LEVEL - 2);
         for (let level = 2; level < MAX_LEVEL; level++) {
            arr[level - 2] = {
               level: level,
               tile_size: Math.pow(2, 2 - level),
               columns: []
            };
         }
         tile_set[set_name] = arr;
      }
      FractoIndexedTiles.tile_set = tile_set;
      // console.log('FractoIndexedTiles.tile_set', FractoIndexedTiles.tile_set)
   }

   static tile_set_is_loaded = (set_name) => {
      // Use Set for faster lookup if this grows large
      return FractoIndexedTiles.tile_sets_loaded.includes(set_name);
   }

   static get_set_level = (set_name, level) => {
      if (FractoIndexedTiles.tile_set === null) {
         // console.log('initializing tile sets')
         FractoIndexedTiles.init_tile_sets();
      }
      // Use direct index instead of .find for speed
      const arr = FractoIndexedTiles.tile_set[set_name];
      if (!arr) return undefined;
      return arr[level - 2];
   }

   static integrate_tile_packet = (set_name, packet_data) => {
      const level = packet_data.level;
      if (!FractoIndexedTiles.tile_sets_loaded.includes(set_name)) {
         FractoIndexedTiles.tile_sets_loaded.push(set_name);
      }
      const set_level = FractoIndexedTiles.get_set_level(set_name, level);
      if (!set_level) {
         // console.log(`problem with ${set_name}:${level}`)
         return;
      }
      if (packet_data.columns.length) {
         // Use push with spread for better perf
         set_level.columns.push(...packet_data.columns);
      }
   }

   static load_short_codes = (tile_set_name, cb) => {
      const directory_url = `${URL_BASE}/manifest/${tile_set_name}.csv`;
      fetch(directory_url)
         .then(response => response.text())
         .then(csv => {
            const lines = csv.split("\n");
            // console.log(`fetch_bin_async ${lines.length}`)
            cb(lines.slice(1));
         });
   }

   static load_no_cache = (cb) => {
      cb([])
   }

   static tiles_in_level = (level, set_name = TILE_SET_INDEXED) => {
      const set_level = FractoIndexedTiles.get_set_level(set_name, level);
      if (!set_level) {
         // console.log(`no bin for level ${level}`)
         return [];
      }
      const columns = set_level.columns;
      const short_codes = [];
      for (let i = 0; i < columns.length; i++) {
         const col = columns[i];
         const col_left = col.left;
         for (let j = 0; j < col.tiles.length; j++) {
            const tile = col.tiles[j];
            short_codes.push({
               bounds: {
                  left: col_left,
                  right: col_left + set_level.tile_size,
                  bottom: tile.bottom,
                  top: tile.bottom + set_level.tile_size
               },
               short_code: tile.short_code
            });
         }
      }
      // Use a more efficient sort if needed
      return short_codes.sort((a, b) => {
         return a.bounds.left === b.bounds.left ?
            (a.bounds.top > b.bounds.top ? -1 : 1) :
            (a.bounds.left > b.bounds.left ? 1 : -1)
      });
   }

   static tiles_in_scope = (level, focal_point, scope, aspect_ratio = 1.0, set_name = TILE_SET_INDEXED) => {
      const width_by_two = scope / 2;
      const height_by_two = width_by_two * aspect_ratio;
      const viewport = {
         left: focal_point.x - width_by_two,
         top: focal_point.y + height_by_two,
         right: focal_point.x + width_by_two,
         bottom: focal_point.y - height_by_two,
      };
      const set_level = FractoIndexedTiles.get_set_level(set_name, level);
      if (!set_level || !set_level.columns.length) {
         // console.log(`no bin/columns for level ${level} of set_name ${set_name}`)
         return [];
      }
      // Filter columns in a single pass
      const columns = [];
      for (let i = 0; i < set_level.columns.length; i++) {
         const col = set_level.columns[i];
         if (col.left > viewport.right) continue;
         if (col.left + set_level.tile_size < viewport.left) continue;
         columns.push(col);
      }
      const short_codes = [];
      const max_y = viewport.top > Math.abs(viewport.bottom)
         ? viewport.top : Math.abs(viewport.bottom);
      for (let i = 0; i < columns.length; i++) {
         const col = columns[i];
         const col_left = col.left;
         for (let j = 0; j < col.tiles.length; j++) {
            const tile = col.tiles[j];
            if (tile.bottom > max_y) continue;
            if (tile.bottom + set_level.tile_size < viewport.bottom) continue;
            short_codes.push({
               bounds: {
                  left: col_left,
                  right: col_left + set_level.tile_size,
                  bottom: tile.bottom,
                  top: tile.bottom + set_level.tile_size
               },
               short_code: tile.short_code
            });
         }
      }
      // console.log(`level ${level}, ${short_codes.length} short codes`)
      return short_codes;
   }

   static get_tile_scopes = (set_name, focal_point, scope) => {
      const level_tiles_in_scope = [];
      for (let level = 3; level < 35; level++) {
         const tiles_in_level = FractoIndexedTiles
            .tiles_in_scope(level, focal_point, scope, 1.0, set_name);
         if (!tiles_in_level.length) {
            continue;
         }
         if (tiles_in_level.length > 350) {
            continue;
         }
         level_tiles_in_scope.push({
            level: level,
            tiles: tiles_in_level
         });
      }
      return level_tiles_in_scope;
   }

}

export default FractoIndexedTiles;
