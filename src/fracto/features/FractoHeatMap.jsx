import {tiles_in_scope} from "fracto/FractoTileData.js";

const MAX_LEVELS = 30

export const fill_heat_map = (ctx, image_width, scope, focal_point) => {
   const level_counts = new Array(MAX_LEVELS).fill(0);
   const increment = scope / image_width
   const leftmost = focal_point.x - scope / 2
   const topmost = focal_point.y + scope / 2
   for (let level = 3; level < MAX_LEVELS; level++) {
      ctx.fillStyle = `hsl(0, 0%, ${(100 * (MAX_LEVELS - level)) / MAX_LEVELS}%)`;
      const tiles = tiles_in_scope(level, focal_point, scope, 1.0);
      tiles.forEach((tile, i) => {
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
            }
         }
      })
   }
}
