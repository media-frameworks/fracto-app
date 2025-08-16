import FractoRootsOfUnity from "../fracto/FractoRootsOfUnity.js";
import Complex from "../common/math/Complex.js";
import FractoCardioid from "./FractoCardioid.js";
import FractoFastCalc from "./FractoFastCalc.js";

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
const TILE_KEY_ITERATIVE_CARDINALITY = 'iterative_cardinality'

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
   TILE_KEY_ITERATIVE_CARDINALITY,
}

export class FractoTileDetail {

   static detail_point_data = (re, im, img_x, img_y) => {
      const P = new Complex(re, im)
      const center = FractoRootsOfUnity.Q_scalar(P)
      const in_cardioid = FractoRootsOfUnity.point_in_main_cardioid(P)
      const best_powerset = in_cardioid
         ? FractoCardioid.test_powersets(P, 0, 0.25, false)
         : {}
      const fracto_values = FractoFastCalc.calc(re, im)
      const cardinality = in_cardioid
         ? best_powerset.completion.cardinality
         : fracto_values.pattern
      const variance = in_cardioid ? best_powerset.completion.variance : -1
      const seed_re = in_cardioid
         ? best_powerset.seed.re
         : fracto_values.orbital_points ? fracto_values.orbital_points[0].x : 0
      const seed_im = in_cardioid
         ? best_powerset.seed.im
         : fracto_values.orbital_points ? fracto_values.orbital_points[0].y : 0
      return {
         [TILE_KEY_P_RE]: re,
         [TILE_KEY_P_IM]: im,
         [TILE_KEY_CENTER_RE]: center.re,
         [TILE_KEY_CENTER_IM]: center.im,
         [TILE_KEY_SEED_RE]: seed_re,
         [TILE_KEY_SEED_IM]: seed_im,
         [TILE_KEY_POWER_NUM]: in_cardioid ? best_powerset.power_set.num : 0,
         [TILE_KEY_POWER_DEN]: in_cardioid ? best_powerset.power_set.den : 0,
         [TILE_KEY_POWER_RATIO]: in_cardioid ? best_powerset.power_set.ratio : 0,
         [TILE_KEY_CARDINALITY]: cardinality,
         [TILE_KEY_CYCLES]: true,
         [TILE_KEY_MAGNITUDE]: true,
         [TILE_KEY_VARIANCE]: variance,
         [TILE_KEY_IN_CARDIOID]: in_cardioid,
         [TILE_KEY_ITERATIONS]: fracto_values.iteration,
         [TILE_KEY_ROW_INDEX]: img_y,
         [TILE_KEY_COL_INDEX]: img_x,
         [TILE_KEY_MAX_TESTED]: 15000,
         [TILE_KEY_ITERATIVE_CARDINALITY]: fracto_values.pattern,
      }
   }

   static begin = (tile, tile_points, cb) => {
      console.log('FractoTileDetail.begin tile_data', tile_points)
      const level = tile.short_code.length
      const increment = (tile.bounds.right - tile.bounds.left) / 256.0;
      for (let img_x = 0; img_x < 256; img_x++) {
         const x = tile.bounds.left + img_x * increment;
         for (let img_y = 0; img_y < 256; img_y++) {
            const y = tile.bounds.top - img_y * increment;
            const values = FractoFastCalc.calc(x, y, level)
            tile_points[img_x][img_y] = [values.pattern, values.iteration];
         }
      }
      cb(true)
   }
}

export default FractoTileDetail
