import FractoTileCache from "./FractoTileCache";

const TILE_KEY_P_RE = 'p_re'
const TILE_KEY_P_IM = 'p_im'
const TILE_KEY_CENTER_RE = 'center_re'
const TILE_KEY_CENTER_IM = 'center_im'
const TILE_KEY_SEED_RE = 'seed_re'
const TILE_KEY_SEED_IM = 'seed_im'
const TILE_KEY_POWER_NUM = 'power_num'
const TILE_KEY_POWER_DEN = 'power_den'
const TILE_KEY_POWER_RATIO = 'power_ratio'
const TILE_KEY_CARDINALITY = 'cardinality'
const TILE_KEY_CYCLES = 'cycles'
const TILE_KEY_MAGNITUDE = 'magnitude'
const TILE_KEY_VARIANCE = 'variance'
const TILE_KEY_IN_CARDIOID = 'in_cardioid'
const TILE_KEY_ITERATIONS = 'iterations'
const TILE_KEY_ROW_INDEX = 'row_index'
const TILE_KEY_COL_INDEX = 'col_index'

const CSV_COLUMNS = {
   TILE_KEY_P_RE,
   TILE_KEY_P_IM,
   TILE_KEY_CENTER_RE,
   TILE_KEY_CENTER_IM,
   TILE_KEY_SEED_RE,
   TILE_KEY_SEED_IM,
   TILE_KEY_POWER_NUM,
   TILE_KEY_POWER_DEN,
   TILE_KEY_POWER_RATIO,
   TILE_KEY_CARDINALITY,
   TILE_KEY_CYCLES,
   TILE_KEY_MAGNITUDE,
   TILE_KEY_VARIANCE,
   TILE_KEY_IN_CARDIOID,
   TILE_KEY_ITERATIONS,
   TILE_KEY_ROW_INDEX,
   TILE_KEY_COL_INDEX,
}

export class FractoTileDetail {

   static generate = (short_code) => {
      const tile = FractoTileCache.get_tile(short_code)
      console.log(tile)
   }
}

export default FractoCardioidTile
