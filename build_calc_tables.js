import fs from 'fs'

const ROUNDING_FACTOR = 1000000000
const MAX_DEN = 5000
let all_ratios = {}
let past_ratios = {}

class Complex {

   constructor(re, im) {
      this.re = re;
      this.im = im;
   }

   magnitude = () => {
      if (isNaN(this.re) || isNaN(this.im)) {
         return -1;
      }
      return Math.sqrt(this.re * this.re + this.im * this.im)
   }

   pow = (n) => {
      const r = this.magnitude()
      const r_to_n = Math.pow(r, n);
      const n_times_theta = n * Math.atan2(this.im, this.re)
      return new Complex(
         r_to_n * Math.cos(n_times_theta),
         r_to_n * Math.sin(n_times_theta)
      )
   }

}
const all_files = []

const write_file = (all_keys, file_name) => {
   const csv_contents = []
   all_keys
      .sort((a, b) => all_ratios[a].ratio - all_ratios[b].ratio)
      .forEach((key) => {
         csv_contents.push(all_ratios[key].text)
      })
   const header = ['num,den,ratio,power_ratio.re,power_ratio.im,power_double_ratio.re,power_double_ratio.im']
   csv_contents.unshift(header)

   const file_path = `./public/comp_data/${file_name}`
   fs.writeFileSync(file_path, csv_contents.join('\n'))
   all_files.push(file_name)
}

let max_length = 100
let first_den = 2
let den = 2
for (; den < MAX_DEN; den++) {
   console.log(den)
   for (let num = 1; num <= den / 2; num++) {
      const ratio_slug = Math.round(num * ROUNDING_FACTOR / den) / ROUNDING_FACTOR
      const ratio_key = `ratio_${ratio_slug}`
      if (past_ratios[ratio_key]) {
         continue
      }
      past_ratios[ratio_key] = true
      const ratio = num / den
      const negative_one = new Complex(-1, 0)
      const power_ratio = negative_one.pow(ratio)
      const power_double_ratio = negative_one.pow(2 * ratio)
      all_ratios[ratio_key] = {
         ratio,
         text: `${num},${den},${ratio},${power_ratio.re},${power_ratio.im},${power_double_ratio.re},${power_double_ratio.im}`
      }
   }
   const all_keys = Object.keys(all_ratios)
   if (all_keys.length > max_length) {
      const file_name = `rational_powers_${first_den}-${den}.csv`
      write_file(all_keys, file_name)
      first_den = den + 1
      all_ratios = {}
      max_length *= 1.5
   }
}

const file_name = `rational_powers_${first_den}-${den}.csv`
const all_keys = Object.keys(all_ratios)
write_file(all_keys, file_name)

const manifest_path = `./public/comp_data/files_manifest.json`
const file_contents = JSON.stringify(all_files)
fs.writeFileSync(manifest_path, file_contents)
