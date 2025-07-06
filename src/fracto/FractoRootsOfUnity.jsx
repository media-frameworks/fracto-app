import Complex from "../common/math/Complex";

const INITIAL_RUN = 20000

const EPSILON = 0.0000001

const SAMPLE_SIZE = 555
const MIN_RATIO = EPSILON
const MAX_RATIO = 0.5 - EPSILON

export class FractoRootsOfUnity {

   static point_in_main_cardioid = (p) => {
      const P = new Complex(p.re || p.x, p.im || p.y)
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

   static Q_scalar = (p, scalar = -1) => {
      const P = new Complex(p.re || p.x, p.im || p.y)
      const negative_four_P = P.scale(-4.0)
      const under_radical = negative_four_P.offset(1, 0)
      const radical = under_radical.sqrt().scale(scalar)
      return radical.offset(1.0, 0).scale(0.5)
   }

   static zs_given_x = (P, x) => {
      const negative_four_P = P.scale(-4)
      const negative_one = new Complex(-1, 0)
      const two_x = x * 2
      const two_x_reciprocal = 1 / two_x
      const negative_one_to_the_two_x = negative_one.nth_root(two_x_reciprocal)
      const under_radical = negative_one_to_the_two_x.add(negative_four_P)
      const radical = under_radical.sqrt()
      const negative_radical = radical.scale(-1)
      const x_reciprocal = 1 / x
      const negative_one_to_the_x = negative_one.nth_root(x_reciprocal)
      const negative_one_to_the_x_plus_radical = negative_one_to_the_x.add(radical)
      const negative_one_to_the_x_minus_radical = negative_one_to_the_x.add(negative_radical)
      return {
         up: negative_one_to_the_x_plus_radical.scale(0.5),
         down: negative_one_to_the_x_minus_radical.scale(0.5),
      }
   }

   static propagate = (P, Q, Q_neg, cardinality) => {
      const negative_Q = new Complex(-Q.re, -Q.im)
      let best_variance_value = 2
      let best_cardinality = 0
      let next_Q = Q;
      let best_magnitude = 0.0000001
      const negative_Q_neg = Q_neg.scale(-1)
      let Q_squared = Q.mul(Q)
      for (let i = 0; i < cardinality * 2; i++) {
         next_Q = Q_squared.add(P)
         const difference = next_Q.add(negative_Q_neg)
         const magnitude = parseFloat(difference.magnitude().toString())
         if (magnitude > best_magnitude) {
            best_magnitude = magnitude
         }
         const diff = next_Q.add(negative_Q)
         const variance = diff.magnitude() / best_magnitude
         if (variance > 0 && variance < best_variance_value) {
            best_cardinality = i + 1
            best_variance_value = variance
         }
         Q_squared = next_Q.mul(next_Q)
      }
      return {
         cardinality: best_cardinality,
         variance: best_variance_value,
         magnitude: best_magnitude
      }
   }

   static get_cycles = (x) => {
      let current_result = 0
      let best_result = 2
      let best_result_index = 0
      for (let i = 0; i < INITIAL_RUN; i++) {
         current_result += x
         if (current_result < 1) {
            continue
         }
         const floor_result = Math.floor(current_result)
         const variance = current_result - floor_result
         if (variance < best_result) {
            best_result = variance
            best_result_index = i
         }
      }
      return best_result_index
   }

   static test_best_ratio = (P, center, radius, Q_neg, cardinality, counter = 150) => {
      let leftmost = center - radius
      if (leftmost <= MIN_RATIO) {
         leftmost = MIN_RATIO
      }
      let rightmost = center + radius
      if (rightmost >= MAX_RATIO) {
         rightmost = MAX_RATIO
      }
      // console.log('leftmost, rightmost', leftmost, rightmost)
      const increment = (rightmost - leftmost) / SAMPLE_SIZE
      let best_variance_value = 2
      let best_variance_center = -1
      let best_magnitude = -1
      for (let ratio_index = 1; ratio_index < SAMPLE_SIZE; ratio_index++) {
         const x = leftmost + ratio_index * increment
         const zs = FractoRootsOfUnity.zs_given_x(P, x)
         const round_trip_down = FractoRootsOfUnity.propagate(P, zs.down, Q_neg, cardinality)
         if (round_trip_down.variance < best_variance_value && round_trip_down.variance >= 0) {
            best_variance_value = round_trip_down.variance
            best_variance_center = x
            best_magnitude = round_trip_down.magnitude
         }
         const round_trip_up = FractoRootsOfUnity.propagate(P, zs.up, Q_neg, cardinality)
         if (round_trip_up.variance < best_variance_value && round_trip_up.variance >= 0) {
            best_variance_value = round_trip_up.variance
            best_variance_center = x
            best_magnitude = round_trip_up.magnitude
         }
      }
      if (counter === 0) {
         const cycles = FractoRootsOfUnity.get_cycles(best_variance_center)
         return {
            best_variance_value,
            best_variance_center,
            best_magnitude,
            cycles
         }
      }
      // console.log('best variance at best_variance_center', best_variance_value, best_variance_center)
      return FractoRootsOfUnity.test_best_ratio(
         P,
         best_variance_center,
         radius / 1.618,
         Q_neg,
         cardinality,
         counter - 1)
   }

   static calc = (p) => {
      const P_x = p.re || p.x
      const P_y = p.im || p.y
      let Q_x_squared = 0
      let Q_y_squared = 0
      let Q_x = 0
      let Q_y = 0
      let iteration = 1
      let cardinality = 0
      let closest_pass = 4
      for (; iteration < INITIAL_RUN; iteration++) {
         Q_y = 2 * Q_x * Q_y + P_y;
         Q_x = Q_x_squared - Q_y_squared + P_x;
         Q_x_squared = Q_x * Q_x
         Q_y_squared = Q_y * Q_y
         const magnitude = Q_x_squared + Q_y_squared
         if (magnitude < closest_pass) {
            closest_pass = magnitude
            cardinality = iteration
         }
      }
      const P = new Complex(p.re || p.x, p.im || p.y)
      const Q_neg = FractoRootsOfUnity.Q_scalar(P, -1)
      const result_neg = FractoRootsOfUnity.test_best_ratio(
         P,
         0.25,
         1 / 6,
         Q_neg,
         cardinality)
      const Q_pos = FractoRootsOfUnity.Q_scalar(P, 1)
      const result_pos = FractoRootsOfUnity.test_best_ratio(
         P,
         0.25,
         1 / 6,
         Q_pos,
         cardinality)
      console.log('find_angular_ratio cardinality, result_neg', cardinality, result_neg)
      console.log('find_angular_ratio cardinality, result_pos', cardinality, result_pos)
      return [result_neg, result_pos]
   }
}

export default FractoRootsOfUnity
