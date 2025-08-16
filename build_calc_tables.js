import fs from 'fs'
import MegaHash from 'megahash'

const MAX_DEN = process.argv[2] || 16000
const FULLEST_MAX_LENGTH = 120000

const all_ratios = []
const all_files = []

const megahash = new MegaHash();

const ratio_has_been_used = (ratio) => {
   const key = `key_${ratio}`
   const has_key = megahash.has(key)
   if (!has_key) {
      megahash.set(key, true)
   }
   return has_key
}

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

const write_file = (file_name) => {
   const csv_contents = []
   const header = ['ratio,num,den,power_ratio.re,power_ratio.im,power_double_ratio.re,power_double_ratio.im']
   csv_contents.push(header)
   all_ratios
      .sort()
      .forEach((item) => {
         csv_contents.push(item)
      })

   console.log(file_name)
   const file_path = `./public/comp_data/${file_name}`
   fs.writeFileSync(file_path, csv_contents.join('\n'))
   all_files.push(file_name)
}

let max_length = 650
let first_den = 2
let den = 2
const negative_one = new Complex(-1, 0)
for (; den < MAX_DEN; den++) {
   // console.log(den)
   for (let num = 1; num <= den / 2; num++) {
      const ratio = num / den
      if (ratio_has_been_used(ratio)) {
         continue
      }
      const power_ratio = negative_one.pow(ratio)
      const power_double_ratio = negative_one.pow(2 * ratio)
      all_ratios.push(`${ratio},${num},${den},${power_ratio.re},${power_ratio.im},${power_double_ratio.re},${power_double_ratio.im}`)
   }
   if (all_ratios.length > max_length) {
      const file_name = `rational_powers_${first_den}-${den}.csv`
      write_file(file_name)
      first_den = den + 1
      all_ratios.splice(0, all_ratios.length);
      max_length *= 1.25
      if (max_length > FULLEST_MAX_LENGTH) {
         max_length = FULLEST_MAX_LENGTH
      }
   }
}

const file_name = `rational_powers_${first_den}-${den}.csv`
write_file(file_name)

const manifest_path = `./public/comp_data/files_manifest.json`
const file_contents = JSON.stringify(all_files)
fs.writeFileSync(manifest_path, file_contents)

console.log(`hash length: ${megahash.length()}`)
