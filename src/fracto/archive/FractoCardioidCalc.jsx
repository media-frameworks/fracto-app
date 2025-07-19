import BigComplex from "../../common/math/BigComplex";
import FractoNewtonsCalc from "./FractoNewtonsCalc";

const INITIAL_RUN = 20000

export class FractoCardioidCalc {

   static point_in_main_cardioid = (p) => {
      const P = new BigComplex(p.re || p.x, p.im || p.y)
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
      const P = new BigComplex(p.re || p.x, p.im || p.y)
      const negative_four_P = P.scale(-4.0)
      const under_radical = negative_four_P.offset(1, 0)
      const radical = under_radical.sqrt().scale(scalar)
      return radical.offset(1.0, 0).scale(0.5)
   }

   static magic_Q_scalar = (P, scalar = -1) => {
      const negative_P = P.scale(-1)
      const four_plus_negative_P = negative_P.offset(4, 0)
      const radical = four_plus_negative_P.sqrt()
      const scaled_radical = radical.scale(scalar)
      return scaled_radical.offset(2, 0)
   }

   static round_trip = (P, Q, Q_neg, cardinality) => {
      let Q_squared = Q.mul(Q)
      let next_Q = new BigComplex(Q.re, Q.im)
      const negative_Q_neg = Q_neg.scale(-1)
      let best_magnitude = 0
      let total_angle = 0
      let previous_angle = -1
      const path = []
      let product = new BigComplex(1, 0)
      for (let index = 0; index < cardinality; index++) {
         const two_next_Q = next_Q.scale(2)
         path.push(next_Q.toString())
         product = product.mul(two_next_Q)
         const difference = next_Q.add(negative_Q_neg)
         const magnitude = parseFloat(difference.magnitude().toString())
         if (magnitude > best_magnitude) {
            best_magnitude = magnitude
         }
         let angle = Math.atan2(difference.im, difference.re)
         while (angle < 0) {
            angle += 2 * Math.PI
         }
         if (previous_angle >= 0) {
            let angle_delta = angle - previous_angle
            while (angle_delta < 0) {
               angle_delta += Math.PI * 2
            }
            total_angle += angle_delta
         }
         previous_angle = angle
         next_Q = Q_squared.add(P)
         Q_squared = next_Q.mul(next_Q)
      }
      path.push(next_Q.toString())

      return {
         magnitude: best_magnitude * 2,
         cycles: Math.floor(total_angle / (Math.PI * 2)) + 1,
         path, product
      }
   }

   static magic_seed = (P) => {
      const P_squared = P.mul(P)
      const P_cubed = P_squared.mul(P)
      const four_P_cubed = P_cubed.scale(4)
      const one = new BigComplex(1, 0)
      const two = new BigComplex(2, 0)
      const three = new BigComplex(3, 0)
      const eighteen = new BigComplex(18, 0)
      const one_third = one.divide(three)
      const root_three = three.sqrt()
      const nine_P = P.scale(9)
      const cube_root_of_eighteen = eighteen.pow(one_third)
      const two_thirds = two.divide(three)
      const cube_root_of_two_thirds = two_thirds.pow(one_third)
      const twenty_seven_P_squared = P_squared.scale(27)

      const under_first_radical = four_P_cubed.add(twenty_seven_P_squared)
      const first_radical = under_first_radical.sqrt()
      const radical_product = root_three.mul(first_radical)
      const cube_root_sum = radical_product.add(nine_P)
      const cubed_root = cube_root_sum.pow(one_third)
      const P_times_cube_root_of_two_thirds = cube_root_of_two_thirds.mul(P)
      const negative_P_times_cube_root_of_two_thirds = P_times_cube_root_of_two_thirds.scale(-1)
      const second_term = negative_P_times_cube_root_of_two_thirds.divide(cubed_root)
      const first_term = cubed_root.divide(cube_root_of_eighteen)
      return first_term.add(second_term)
   }

   static magic_seeds = (P) => {
      const i = new BigComplex(0, 1)
      const two = new BigComplex(2, 0)
      const root_two = two.sqrt()
      const two_root_two = root_two.scale(2)
      const three = new BigComplex(3, 0)
      const four = new BigComplex(4, 0)
      const root_three = three.sqrt()
      const i_root_three = i.mul(root_three)
      const i_root_three_by_four = i_root_three.divide(four)
      const negative_i_root_three_by_four = i_root_three_by_four.scale(-1)
      const negative_eight_P = P.scale(-8)
      const negative_eight_P_minus_one = negative_eight_P.offset(-1, 0)
      const negative_i_root_three = i_root_three.scale(-1)
      const under_radical_positive = negative_eight_P_minus_one.add(i_root_three)
      const under_radical_negative = negative_eight_P_minus_one.add(negative_i_root_three)
      const radical_positive = under_radical_positive.sqrt()
      const radical_negative = under_radical_negative.sqrt()
      const negative_radical_positive = radical_positive.scale(-1)
      const negative_radical_negative = radical_negative.scale(-1)
      const radical_positive_by_two_root_two = radical_positive.divide(two_root_two)
      const radical_negative_by_two_root_two = radical_negative.divide(two_root_two)
      const negative_radical_positive_by_two_root_two = negative_radical_positive.divide(two_root_two)
      const negative_radical_negative_by_two_root_two = negative_radical_negative.divide(two_root_two)
      const seed_1 = radical_positive_by_two_root_two.offset(-0.25, 0)
      const seed_2 = radical_negative_by_two_root_two.offset(-0.25, 0)
      const seed_3 = negative_radical_positive_by_two_root_two.offset(-0.25, 0)
      const seed_4 = negative_radical_negative_by_two_root_two.offset(-0.25, 0)
      return [
         seed_1.add(negative_i_root_three_by_four),
         seed_2.add(i_root_three_by_four),
         seed_3.add(negative_i_root_three_by_four),
         seed_4.add(i_root_three_by_four),
      ]
   }

   static discriminant = (P) => {
      const P_squared = P.mul(P)
      const P_cubed = P_squared.mul(P)
      const three = new BigComplex(3, 0)
      const root_three = three.sqrt()
      const four_P_cubed = P_cubed.scale(4)
      const twenty_seven_P_squared = P_squared.scale(27)
      const under_radical = four_P_cubed.add(twenty_seven_P_squared)
      const radical = under_radical.sqrt()
      const radical_times_root_three = radical.scale(root_three.re)
      const nine_P = P.scale(9)
      const under_cube_root = radical_times_root_three.add(nine_P)
      return under_cube_root.cube_root()
   }

   static recursive_constants = (P) => {
      const discriminant = FractoCardioidCalc.discriminant(P)

      const two = new BigComplex(2, 0)
      const three = new BigComplex(3, 0)
      const eighteen = new BigComplex(18, 0)
      const cube_root_of_eighteen = eighteen.cube_root()
      const cube_root_of_two = two.cube_root()
      const cube_root_of_three = three.cube_root()
      const cube_root_of_two_by_cube_root_of_three = cube_root_of_two.divide(cube_root_of_three)
      const P_times_cube_root_of_two_by_cube_root_of_three = P.mul(cube_root_of_two_by_cube_root_of_three)
      const P_times_cube_root_of_two_by_cube_root_of_three_by_discriminant =
         P_times_cube_root_of_two_by_cube_root_of_three.divide(discriminant)
      const negative_P_times_cube_root_of_two_by_cube_root_of_three_by_discriminant =
         P_times_cube_root_of_two_by_cube_root_of_three_by_discriminant.scale(-1)
      const discriminant_by_cube_root_of_eighteen = discriminant.divide(cube_root_of_eighteen)
      let result_1 = discriminant_by_cube_root_of_eighteen
         .add(negative_P_times_cube_root_of_two_by_cube_root_of_three_by_discriminant)

      const root_three = three.sqrt()
      const two_times_cube_root_of_eighteen = cube_root_of_eighteen.scale(2)
      const i_root_three = new BigComplex(0, root_three.re)
      const negative_i_root_three = i_root_three.scale(-1)
      const one_plus_i_root_three = i_root_three.offset(1, 0)
      const one_plus_negative_i_root_three = negative_i_root_three.offset(1, 0)
      const two_times_cube_root_of_eighteen_times_discriminant =
         two_times_cube_root_of_eighteen.mul(discriminant)
      const P_times_one_plus_i_root_three = one_plus_i_root_three.mul(P)
      const P_times_one_plus_i_root_three_by_two_times_cube_root_of_eighteen_times_discriminant =
         P_times_one_plus_i_root_three.divide(two_times_cube_root_of_eighteen_times_discriminant)
      const one_plus_negative_i_root_three_times_discriminant =
         one_plus_negative_i_root_three.mul(discriminant)
      const negative_one_plus_negative_i_root_three_times_discriminant =
         one_plus_negative_i_root_three_times_discriminant.scale(-1)
      const negative_one_plus_negative_i_root_three_times_discriminant_by_two_times_cube_root_of_eighteen
         = negative_one_plus_negative_i_root_three_times_discriminant.divide(two_times_cube_root_of_eighteen)
      let result_2 = P_times_one_plus_i_root_three_by_two_times_cube_root_of_eighteen_times_discriminant
         .add(negative_one_plus_negative_i_root_three_times_discriminant_by_two_times_cube_root_of_eighteen)

      const P_times_one_plus_negative_i_root_three = one_plus_negative_i_root_three.mul(P)
      const one_plus_i_root_three_times_discriminant = one_plus_i_root_three.mul(discriminant)
      const negative_one_plus_i_root_three_times_discriminant =
         one_plus_i_root_three_times_discriminant.scale(-1)
      const negative_one_plus_i_root_three_times_discriminant_by_cube_root_of_eighteen =
         negative_one_plus_i_root_three_times_discriminant.divide(two_times_cube_root_of_eighteen)
      const P_times_one_plus_negative_i_root_three_by_two_times_cube_root_of_eighteen_times_discriminant
         = P_times_one_plus_negative_i_root_three.divide(two_times_cube_root_of_eighteen_times_discriminant)
      let result_3 = P_times_one_plus_negative_i_root_three_by_two_times_cube_root_of_eighteen_times_discriminant
         .add(negative_one_plus_i_root_three_times_discriminant_by_cube_root_of_eighteen)

      return [result_1, result_2, result_3]
   }

   static zs_from_R_c = (R_c, P) => {
      const R_c_squared = R_c.mul(R_c)
      const negative_four_P = P.scale(-4)
      const R_c_squared_plus_negative_four_P = R_c_squared.add(negative_four_P)
      const radical = R_c_squared_plus_negative_four_P.sqrt()
      const negative_radical = radical.scale(-1)
      const R_c_plus_radical = R_c.add(radical)
      const R_c_plus_negative_radical = R_c.add(negative_radical)
      return [
         R_c_plus_radical.scale(0.5),
         R_c_plus_negative_radical.scale(0.5),
      ]
   }

   static z_values = (n, P, Q_neg) => {
      const negative_one = new BigComplex(-1, 0)
      const negative_four_P = P.scale(-4)
      const results = []
      for (let m = 0; m < n; m++) {
         const m_by_n = new BigComplex(m / n, 0)
         const two_m_by_n = m_by_n.scale(2)
         const negative_one_to_the_m_by_n = negative_one.pow(m_by_n)
         const negative_one_to_the_two_m_by_n = negative_one.pow(two_m_by_n)
         const under_radical = negative_one_to_the_two_m_by_n.add(negative_four_P)
         const radical = under_radical.sqrt()
         const negative_radical = radical.scale(-1)
         const partial_result_1 = negative_one_to_the_m_by_n.add(radical)
         const z_1 = partial_result_1.scale(0.5)
         const z_1_squared = z_1.mul(z_1)
         const z_1_squared_plus_P = z_1_squared.add(P)
         const R_c_1 = z_1_squared_plus_P.divide(z_1)
         const round_trip_1 = FractoCardioidCalc.round_trip(P, z_1, Q_neg, n)
         if (round_trip_1.magnitude && round_trip_1.magnitude < 2) {
            results.push({
               m,
               orientation: 'up',
               z: z_1.toString(),
               R_c: R_c_1.toString(),
               cycles: round_trip_1.cycles,
               magnitude: round_trip_1.magnitude,
               path: round_trip_1.path,
               product: round_trip_1.product.toString(),
            })
         }
         const partial_result_2 = negative_one_to_the_m_by_n.add(negative_radical)
         const z_2 = partial_result_2.scale(0.5)
         const z_2_squared = z_2.mul(z_2)
         const z_2_squared_plus_P = z_2_squared.add(P)
         const R_c_2 = z_2_squared_plus_P.divide(z_2)
         const round_trip_2 = FractoCardioidCalc.round_trip(P, z_2, Q_neg, n)
         if (round_trip_2.magnitude && round_trip_2.magnitude < 2) {
            results.push({
               m,
               orientation: 'down',
               z: z_2.toString(),
               R_c: R_c_2.toString(),
               cycles: round_trip_2.cycles,
               magnitude: round_trip_2.magnitude,
               path: round_trip_2.path,
               product: round_trip_2.product.toString(),
            })
         }
      }
      return results
   }

   static calc = (p) => {
      const P = new BigComplex(p.re || p.x, p.im || p.y)
      const Q_neg = FractoCardioidCalc.Q_scalar(p, -1)
      const negative_Q_neg = Q_neg.scale(-1)
      let Q = new BigComplex(0, 0)
      let Q_squared = new BigComplex(0, 0)
      let reference_Q = new BigComplex(0, 0)
      let reference_iterations = 0
      let cardinality = 0
      let next_check = INITIAL_RUN
      let previous_magnitude = 0
      const start = performance.now()
      for (let iterations = 0; iterations < 2000000000; iterations++) { // 2 billion
         Q = Q_squared.add(P)
         Q_squared = Q.mul(Q)
         if (iterations < INITIAL_RUN) {
            continue
         }
         if (Q.compare(reference_Q)) {
            const elapsed_ms = performance.now() - start
            cardinality = iterations - reference_iterations
            const {cycles, magnitude} =
               FractoCardioidCalc.round_trip(P, Q, Q_neg, cardinality)
            const Q_next = Q_squared.add(P)
            const current_constant = Q_next.divide(Q)
            const z_values = FractoCardioidCalc.z_values(cardinality, P, Q_neg)
            return {
               cardinality,
               cycles,
               magnitude,
               z_values,
               current_constant: current_constant.toString(),
               seed: Q.toString(),
               Q_neg: Q_neg.toString(),
               P: P.toString(),
               elapsed_ms,
               iterations,
            }
         }
         if (iterations === next_check) {
            next_check = Math.round(next_check + INITIAL_RUN)
            const next_Q = Q_squared.add(P)
            const new_ratio = next_Q.divide(Q)
            const new_ratio_magnitude = new_ratio.magnitude().toString()
            reference_Q = new BigComplex(Q.re, Q.im)
            reference_iterations = iterations
            const difference = Q.add(negative_Q_neg)
            const magnitude = parseFloat(difference.magnitude().toString())
            const delta = Math.abs(previous_magnitude - magnitude)
            const ratio = magnitude / delta
            console.log('iterations, magnitude, delta, ratio',
               `${iterations / 1000000}M`, magnitude, delta, ratio, new_ratio_magnitude)
            previous_magnitude = magnitude
         }
      }
   }
}

export default FractoCardioidCalc
