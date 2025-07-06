import BigComplex from "../common/math/BigComplex";

const INITIAL_RUN = 20000

export class FractoNewtonsCalc {

   static zs_from_R_c = (P, R_c) => {
      const R_c_squared = R_c.mul(R_c)
      const negative_four_P = P.scale(-4)
      const under_radical = R_c_squared.add(negative_four_P)
      const radical = under_radical.sqrt()
      const negative_radical = radical.scale(-1)
      const result_1 = R_c.add(negative_radical)
      const result_2 = R_c.add(radical)
      return {
         down: result_1.scale(0.5),
         up: result_2.scale(0.5)
      }
   }

   static calc = (p) => {
      const P = new BigComplex(p.re || p.x, p.im || p.y)
      let Q = new BigComplex(0, 0)
      let Q_squared = new BigComplex(0, 0)
      let reference_Q = new BigComplex(0, 0)
      let reference_iterations = 0
      let next_check = INITIAL_RUN
      let previous_magnitude = 0
      let cardinality = 0
      let closest_pass = new BigComplex(2, 2)
      const start = performance.now()
      let seed_z = new BigComplex(0, 0)
      for (let iterations = 1; iterations < INITIAL_RUN; iterations++) { // 2 billion
         Q = Q_squared.add(P)
         Q_squared = Q.mul(Q)
         const magnitude = Q.magnitude()
         if (magnitude < closest_pass) {
            closest_pass = magnitude
            cardinality = iterations
            seed_z = new BigComplex(Q.re, Q.im)
            console.log(`seed_z=${seed_z.toString()}`)
         } else if (iterations % cardinality === 0) {
            seed_z = new BigComplex(Q.re, Q.im)
            console.log(`seed_z=${seed_z.toString()}`)
         }
      }
      console.log(`FractoNewtonsCalc cardinality=${cardinality} in ${performance.now() - start}ms`)
      const negative_P = P.scale(-1)
      let R_c = null
      let current_R_c_string = ''
      while (true) {
         const z = new BigComplex(seed_z.re, seed_z.im)
         const z_squared = z.mul(z)
         const z_squared_plus_P = z_squared.add(P)
         const z_squared_plus_negative_P = z_squared.add(negative_P)
         const z_times_z_squared_plus_P = z.mul(z_squared_plus_P)
         const quotient = z_times_z_squared_plus_P.divide(z_squared_plus_negative_P)
         const negative_quotient = quotient.scale(-1)
         if (R_c !== null) {
            R_c = R_c.add(negative_quotient)
         } else {
            R_c = new BigComplex(negative_quotient.re, negative_quotient.im)
         }
         const R_c_string = R_c.toString()
         if (R_c_string === current_R_c_string) {
            console.log('found it!')
            return
         }
         current_R_c_string = R_c_string
         const {down, up} = FractoNewtonsCalc.zs_from_R_c(P, R_c)
         seed_z = up
         console.log(`current_R_c_string=${current_R_c_string}`)
         console.log(`seed_z=${seed_z.toString()}`)
      }
   }

}

export default FractoNewtonsCalc
