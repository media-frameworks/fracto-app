import {tiles_in_scope} from "fracto/FractoTileData.js";

const MAX_LEVELS = 30

export const fill_heat_map = (ctx, image_width, scope, focal_point) => {
   const level_counts = new Array(MAX_LEVELS).fill(0);
   const tile_counts = new Array(MAX_LEVELS).fill(0);
   const level_colors = new Array(MAX_LEVELS).fill(0);
   const increment = scope / image_width
   const leftmost = focal_point.x - scope / 2
   const topmost = focal_point.y + scope / 2
   let max_level = 0
   for (let level = 3; level < MAX_LEVELS; level++) {
      const color = `hsl(0, 0%, ${(100 * (MAX_LEVELS - level)) / MAX_LEVELS}%)`;
      ctx.fillStyle = color
      level_colors[level] = color
      const tiles = tiles_in_scope(level, focal_point, scope, 1.0);
      tile_counts[level] = tiles.length
      tiles.forEach(tile => {
         for (let col = 0; col < image_width; col++) {
            const x = leftmost + col * increment
            if (x < tile.bounds.left || x > tile.bounds.right) {
               continue
            }
            for (let row = 0; row < image_width; row++) {
               const y = Math.abs(topmost - row * increment)
               if (y > tile.bounds.top || y < tile.bounds.bottom) {
                  continue
               }
               ctx.fillRect(col, row, 1, 1);
               level_counts[level] += 1
               max_level = level
            }
         }
      })
   }
   const max_count = image_width * image_width
   const result = level_counts.map((count, level) => {
      return {
         level,
         count,
         tile_count: tile_counts[level],
         color: level_colors[level],
      }
   })
      .filter(obj => obj.count && obj.count !== max_count)
   if (result.length === 0) {
      result.push({
         level: max_level,
         count: max_count,
         tile_count: tile_counts[max_level],
         color: level_colors[max_level],
      })
   } else {
      const previous_level = result[0].level - 1
      result.unshift({
         level: previous_level,
         count: max_count,
         tile_count: tile_counts[previous_level],
         color: level_colors[previous_level],
      })
   }
   return result
}
