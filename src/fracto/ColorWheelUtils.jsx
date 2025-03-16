import FractoUtil from "fracto/FractoUtil";

export const TWO_PI = 2 * Math.PI;
const PI_BY_2 = Math.PI / 2

const draw_region = (ctx, canvas_width_px, radius1, radius2, angle1, angle2, pattern, color_phase = 0) => {
   const size_by_two = canvas_width_px / 2
   ctx.beginPath();
   ctx.strokeStyle = 'black'
   ctx.arc(size_by_two, size_by_two, radius1, angle1, angle2, false);
   ctx.arc(size_by_two, size_by_two, radius2, angle2, angle1, true);
   ctx.closePath();

   const [h, s, l] = FractoUtil.fracto_pattern_color_hsl(pattern, 500)
   ctx.fillStyle = `hsl(${h + color_phase}, ${s}%, ${l}%)`
   ctx.fill();
   ctx.stroke();

   if (pattern < 64) {
      const text_pos_x =
         size_by_two + (radius2 + radius1) / 2 * Math.cos((angle1 + angle2) / 2);
      const text_pos_y =
         size_by_two + (radius2 + radius1) / 2 * Math.sin((angle1 + angle2) / 2);

      ctx.font = `lighter ${Math.round(canvas_width_px / 40)}px Courier, monospace`;
      ctx.strokeStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(`${pattern}`, text_pos_x, text_pos_y);
   }
}

export const draw_circle = (ctx, x, y, radius, color) => {
   ctx.beginPath();
   ctx.strokeStyle = 'black'
   ctx.fillStyle = color
   ctx.arc(x, y, radius, 0, 359.9, false);
   ctx.fill();
   ctx.stroke();
   ctx.closePath();
}

export const color_wheel = (canvas_ref, radius, ring_count = 5, color_phase = 0) => {
   const canvas = canvas_ref.current
   if (!canvas) {
      return
   }
   const ctx = canvas.getContext('2d');
   ctx.lineWidth = radius / 250;

   const bounds = canvas.getBoundingClientRect();
   const width_px = bounds.width;

   const radii = [];
   for (let i = 1; i <= ring_count; i++) {
      radii.push(i * radius / ring_count );
   }

   let angle = -PI_BY_2
   let pattern = 2
   for (let ring = 1; ring <= ring_count; ring++) {
      const limit = Math.pow(2, ring + 1) - 1
      const angle_increment = Math.PI / Math.pow(2, ring - 1)
      for (; pattern <= limit; pattern++) {
         draw_region(ctx, width_px, radii[ring - 1], radii[ring], angle, angle + angle_increment, pattern, color_phase)
         angle += angle_increment
      }
   }

   const size_by_two = width_px / 2
   let [h, s, l] = FractoUtil.fracto_pattern_color_hsl(1, 500)
   draw_circle(ctx, size_by_two, size_by_two, radii[0],
      `hsl(${h + color_phase}, ${s}%, ${l}%)`)
   ctx.strokeStyle = 'white';
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';
   ctx.strokeText(`1`, size_by_two, size_by_two);
}