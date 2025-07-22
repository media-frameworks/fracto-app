import Complex from "common/math/Complex";

const FETCH_JSON_HEADERS = {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
}
const FETCH_CSV_HEADERS = {
   'Content-Type': 'text/javascript',
   'Accept': 'text/javascript'
}

const TEST_RANGE = 25
const MAX_CARDINALITY = 1200

export class FractoCardioid {

   static rational_powers = []
   static power_sets = []
   static vertex_sums = new Array(MAX_CARDINALITY + 1).fill({x: 0, y: 0})

   static process_power_set = (string_list) => {
      const header = string_list.shift()
      const key_list = header.split(',')
      const power_set = string_list.map((item) => {
         const result = {}
         const item_list = item.split(',')
         key_list.forEach((key, index) => {
            result[key] = key === 'num' || key === 'dem'
               ? parseInt(item_list.at(index))
               : parseFloat(item_list.at(index))
         })
         return result
      })
      FractoCardioid.power_sets.push(power_set)
   }

   static load_power_sets = (set_list) => {
      if (!set_list.length) {
         console.log('power sets are loaded', FractoCardioid.power_sets)
         return
      }
      const item = set_list.shift()
      const filename = `comp_data/${item}`
      console.log(filename)
      fetch(filename, FETCH_CSV_HEADERS)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
         })
         .then(textData => {
            FractoCardioid.process_power_set(textData.split('\n'))
            FractoCardioid.load_power_sets(set_list)
         })
         .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
         });
   }

   static load_rational_powers = async () => {
      if (FractoCardioid.power_sets.length) {
         return
      }
      const manifest_url = 'comp_data/files_manifest.json'
      fetch(manifest_url, FETCH_JSON_HEADERS)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
         })
         .then(jsonData => {
            console.log('files_manifest', jsonData);
            FractoCardioid.rational_powers = jsonData
            FractoCardioid.load_power_sets(jsonData)
         })
         .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
         });
   }

   static point_in_cardioid = (x0, y0) => {
      const P = new Complex(x0, y0)
      const negative_four_P = P.scale(-4)
      const one_minus_four_p = negative_four_P.offset(1, 0)
      const sqrt_one_minus_four_p = one_minus_four_p.sqrt()
      const negative_sqrt_one_minus_four_p = sqrt_one_minus_four_p.scale(-1)
      const one_minus_sqrt_one_minus_four_p = negative_sqrt_one_minus_four_p.offset(1, 0)
      const magnitude = one_minus_sqrt_one_minus_four_p.magnitude()
      if (magnitude < 0) {
         return false
      }
      return magnitude <= 1;
   }

   static seek_closest_powerset_index = (arr, targetValue) => {
      let low = 0;
      let high = arr.length - 1;
      while (low <= high) {
         let mid = Math.floor((low + high) / 2);
         let guess = arr[mid];
         const guess_next = arr[mid + 1];
         const guess_previous = arr[mid - 1];
         if (guess.ratio < targetValue && guess_next.ratio > targetValue) {
            return mid
         }
         if (guess.ratio > targetValue && guess_previous.ratio < targetValue) {
            return mid
         }
         if (guess.ratio === targetValue) {
            return mid; // Return the index if found
         }

         if (guess.ratio < targetValue) {
            low = mid + 1;
         } else {
            high = mid - 1;
         }
      }
      return -1; // Return -1 if not found
   }

   static reduce_powerset = (powerset_index, center) => {
      const full_powerset = FractoCardioid.power_sets.at(powerset_index)
      if (powerset_index === 0) {
         return full_powerset
      }
      const center_index = FractoCardioid.seek_closest_powerset_index(full_powerset, center)
      // console.log('center_index, full_powerset.length', center_index, full_powerset.length)
      let first_index = center_index - TEST_RANGE
      let final_index = center_index + TEST_RANGE
      if (first_index < 0) {
         first_index = 0
      }
      if (final_index >= full_powerset.length) {
         final_index = full_powerset.length - 1
      }
      return full_powerset.slice(first_index, final_index)
   }

   static get_variance = (P, Q) => {
      const P_x = P.re
      const P_y = P.im
      let Q_x = Q.re
      let Q_y = Q.im
      let Q_x_squared = Q_x * Q_x
      let Q_y_squared = Q_y * Q_y
      for (let i = 0; i <= MAX_CARDINALITY; i++) {
         Q_y = 2 * Q_x * Q_y + P_y;
         Q_x = Q_x_squared - Q_y_squared + P_x;
         FractoCardioid.vertex_sums[i].x = Q_x
         FractoCardioid.vertex_sums[i].y = Q_y
         if (i > 0) {
            FractoCardioid.vertex_sums[i - 1].x += Q_x
            FractoCardioid.vertex_sums[i - 1].y += Q_y
         }
         Q_x_squared = Q_x * Q_x
         Q_y_squared = Q_y * Q_y
         const sum_squares = Q_x_squared + Q_y_squared
         if (sum_squares > 4) {
            return {cardinality: 0, variance: -1}
         }
      }
      let least_variance = 1000
      let cardinality = 0
      let product_x = 1
      let product_y = 0
      for (let i = 1; i <= MAX_CARDINALITY; i++) {
         const sum_x = FractoCardioid.vertex_sums[i].x
         const sum_y = FractoCardioid.vertex_sums[i].y
         const new_product_x = product_x * sum_x - product_y * sum_y
         const new_product_y = product_x * sum_y + product_y * sum_x
         const product_x_minus_one = new_product_x - 1
         product_x = new_product_x
         product_y = new_product_y
         const variance = Math.sqrt(
            product_x_minus_one * product_x_minus_one
            + product_y * product_y)
         if (variance < least_variance) {
            least_variance = variance
            cardinality = i
         }
      }
      return {cardinality, variance: least_variance}
   }

   static test_powersets = (P, powerset_index, center) => {
      const negative_four_P = P.scale(-4)
      const test_set = FractoCardioid.reduce_powerset(powerset_index, center)
      let best_variance = 1000
      let best_variance_set = null
      test_set.forEach(set => {
         const power_double_ratio = new Complex(
            set['power_double_ratio.re'],
            set['power_double_ratio.im'])
         const under_radical = power_double_ratio.add(negative_four_P)
         const radical = under_radical.sqrt()
         const negative_radical = radical.scale(-1)
         const power_ratio = new Complex(
            set['power_ratio.re'],
            set['power_ratio.im'])
         const negative_radical_plus_power_ratio = negative_radical.add(power_ratio)
         const z = negative_radical_plus_power_ratio.scale(0.5)
         const completion = FractoCardioid.get_variance(P, z)
         if (completion.variance > 0 && completion.variance < best_variance) {
            best_variance = completion.variance
            best_variance_set = {completion, power_set: set}
         }
      })
      if (!best_variance_set) {
         return null
      }
      if (powerset_index + 1 < FractoCardioid.power_sets.length) {
         const further_testing = FractoCardioid.test_powersets(
            P,
            powerset_index + 1,
            best_variance_set.power_set.ratio)
         if (!further_testing) {
            return best_variance_set
         }
         if (further_testing.completion.variance < best_variance_set.completion.variance) {
            return further_testing
         }
      }
      return best_variance_set
   }

   static calc = (x0, y0) => {
      if (!FractoCardioid.point_in_cardioid(x0, y0)) {
         return {error: 'not in cardioid'}
      }
      const P = new Complex(x0, y0)
      const best_powerset = FractoCardioid.test_powersets(P, 0, 0.25)
      console.log('best_powerset', best_powerset)
   }

}

export default FractoCardioid
