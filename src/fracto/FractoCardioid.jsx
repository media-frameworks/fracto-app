import Complex from "common/math/Complex";

export class FractoCardioid {

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

   static z_from_ratio = (P, ratio) => {
      const negative_four_P = P.scale(-4)
      const negative_one = new Complex(-1, 0)
      const negative_one_to_the_two_ratio = negative_one.pow(ratio * 2)
      const under_radical = negative_one_to_the_two_ratio.add(negative_four_P)
      const radical = under_radical.sqrt()
      const negative_radical = radical.scale(-1)
      const negative_one_to_the_ratio = negative_one.pow(ratio)
      const negative_one_to_the_ratio_minus_radical = negative_one_to_the_ratio.add(negative_radical)
      return  negative_one_to_the_ratio_minus_radical.scale(0.5)
   }


   static calc = (x0, y0) => {
      if (!FractoCardioid.point_in_cardioid(x0, y0)) {
         return {error: 'not in cardioid'}
      }
   }

}

export default FractoCardioid
