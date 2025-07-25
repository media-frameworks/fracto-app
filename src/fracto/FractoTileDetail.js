import FractoRootsOfUnity from "../fracto/FractoRootsOfUnity.js";
import Complex from "../common/math/Complex.js";
import FractoCardioid from "./FractoCardioid.js";

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
const TILE_KEY_MAX_TESTED = 'max_tested' // highest orbital cardinality attempted

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
   TILE_KEY_MAX_TESTED,
}

export class FractoTileDetail {

   static detail_point_data = (re, im) => {
      const P = new Complex(re, im)
      const center = FractoRootsOfUnity.Q_scalar(P)
      const in_cardioid = FractoRootsOfUnity.point_in_main_cardioid(P)
      const best_powerset = in_cardioid
         ? FractoCardioid.test_powersets(P, 0, 0.25)
         : {}
      console.log('best_powerset', best_powerset)
      return {
         [TILE_KEY_P_RE]: re,
         [TILE_KEY_P_IM]: im,
         [TILE_KEY_CENTER_RE]: center.re,
         [TILE_KEY_CENTER_IM]: center.im,
         [TILE_KEY_SEED_RE]: true,
         [TILE_KEY_SEED_IM]: true,
         [TILE_KEY_POWER_NUM]: true,
         [TILE_KEY_POWER_DEN]: true,
         [TILE_KEY_POWER_RATIO]: true,
         [TILE_KEY_CARDINALITY]: true,
         [TILE_KEY_CYCLES]: true,
         [TILE_KEY_MAGNITUDE]: true,
         [TILE_KEY_VARIANCE]: true,
         [TILE_KEY_IN_CARDIOID]: in_cardioid,
         [TILE_KEY_ITERATIONS]: true,
         [TILE_KEY_ROW_INDEX]: true,
         [TILE_KEY_COL_INDEX]: true,
         [TILE_KEY_MAX_TESTED]: true
      }
   }
}

export default FractoTileDetail
