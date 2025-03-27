import FractoUtil from "../FractoUtil";

const MAX_PATTERN = 20000

const GREY_BASE = 90
const GREY_RANGE = (255 - GREY_BASE)

const COLOR_LUM_BASE_PCT = 55
const COLOR_LUM_BASE_RANGE_PCT = 35

export class FractoColors {

   static pattern_hues = null

   static init_pattern_hues = () => {
      FractoColors.pattern_hues = new Array(MAX_PATTERN).fill(0)
      for (let pattern = 1; pattern < MAX_PATTERN; pattern++) {
         const log2 = Math.log2(pattern);
         FractoColors.pattern_hues[pattern] = Math.floor(360 * (log2 - Math.floor(log2)))
      }
   }

   static pattern_hue = (pattern) => {
      if (!FractoColors.pattern_hues) {
         FractoColors.init_pattern_hues()
      }
      let pattern_in_range = pattern
      while (pattern_in_range > MAX_PATTERN) {
         pattern_in_range /= 2
      }
      return FractoColors.pattern_hues[pattern_in_range]
   }

   static pattern_color_hsl = (pattern, iteration) => {
      return FractoUtil.fracto_pattern_color_hsl(pattern, iteration)
   }

   static buffer_to_canvas = (canvas_buffer, ctx, scale_factor = 1) => {
      const all_not_pattern_pixels = []
      const all_pattern_pixels = []
      let total_not_pattern = 0
      const all_not_pattern_sets = {}
      for (let canvas_x = 0; canvas_x < canvas_buffer.length; canvas_x++) {
         for (let canvas_y = 0; canvas_y < canvas_buffer[canvas_x].length; canvas_y++) {
            const [pattern, iteration] = canvas_buffer[canvas_x][canvas_y]
            const key = `_${iteration}`
            if (pattern === 0) {
               if (!all_not_pattern_sets[key]) {
                  all_not_pattern_sets[key] = 0
               }
               all_not_pattern_sets[key] += 1
               total_not_pattern += 1
               all_not_pattern_pixels.push({iteration, canvas_x, canvas_y})
            } else {
               all_pattern_pixels.push({pattern, iteration, canvas_x, canvas_y})
            }
         }
      }

      const not_pattern_sets = Object.keys(all_not_pattern_sets)
         .map(key => {
            const iteration = parseInt(key.slice(1))
            return {iteration, iteration_count: all_not_pattern_sets[key]}
         })
         .sort((a, b) => {
            return a.iteration - b.iteration
         })
      let best_bin_size = total_not_pattern / GREY_RANGE
      let current_grey_tone = GREY_BASE + GREY_RANGE
      let current_bin_size = 0
      let total_pixel_count = 0
      not_pattern_sets.forEach((set, index) => {
         if (set.iteration_count > best_bin_size){
            current_grey_tone -= Math.floor(set.iteration_count / best_bin_size)
            current_bin_size = 0
         } else if (set.iteration_count + current_bin_size < best_bin_size) {
            current_bin_size += set.iteration_count
         } else {
            current_bin_size = set.iteration_count
            current_grey_tone -= 1
         }
         total_pixel_count += set.iteration_count
         set.grey_tone = current_grey_tone
         const remaining_bins = current_grey_tone - GREY_BASE + 1
         best_bin_size = (total_not_pattern - total_pixel_count) / remaining_bins
      })
      let greys_map = {}
      not_pattern_sets.forEach(set => {
         const key = `_${set.iteration}`
         greys_map[key] = set.grey_tone
      })
      all_not_pattern_pixels
         .forEach((pixel) => {
            const key = `_${pixel.iteration}`
            const grey_value = greys_map[key]
            ctx.fillStyle = `rgb(${grey_value},${grey_value},${grey_value})`
            ctx.fillRect(scale_factor * pixel.canvas_x, scale_factor * pixel.canvas_y,
               1.25 * scale_factor, 1.25 * scale_factor);
         })

      all_pattern_pixels.sort((a, b) => {
         return b.iteration - a.iteration
      }).forEach((pixel, pixel_index) => {
         const lum_factor = 1 - pixel_index / all_pattern_pixels.length
         const hue = FractoColors.pattern_hue(pixel.pattern)
         ctx.fillStyle = `hsl(${hue}, 85%, ${COLOR_LUM_BASE_PCT + lum_factor * COLOR_LUM_BASE_RANGE_PCT}%)`
         ctx.fillRect(scale_factor * pixel.canvas_x, scale_factor * pixel.canvas_y,
            1.25 * scale_factor, 1.25 * scale_factor);
      })
   }

}

export default FractoColors
