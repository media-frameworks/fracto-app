import React, {Component} from "react";
import PropTypes from "prop-types";

import {CompOrbitalStyles as styles} from 'styles/CompOrbitalStyles'
import {KEY_COMPS_HEIGHT_PX, KEY_COMPS_WIDTH_PX} from "../../../../settings/PaneSettings";
import {collect_orbitals} from "fracto/CanvasBufferUtils";
import {color_wheel} from "../../../../fracto/ColorWheelUtils";
import FractoUtil from "../../../../fracto/FractoUtil";

export class OrbitalsFamilySpan extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }
   state = {
      wrapper_width_px: 0,
      wrapper_height_px: 0,
      canvas_buffer_width: 0,
      most_recent: {
         scope: 0,
         focal_point: {x: 0, y: 0}
      },
      canvas_ref: React.createRef(),
      orbital_bins: {},
      families: {},
      highest_family_count: 0,
   };

   componentDidMount() {
      this.initialize()
      setTimeout(() => {
         this.fill_pattern_bins()
      }, 250)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {most_recent, wrapper_width_px} = this.state
      const {page_settings} = this.props
      const {scope, focal_point, canvas_buffer} = page_settings
      const mr_scope = most_recent.scope
      const mr_focal_point = most_recent.focal_point
      const scope_changed = mr_scope !== scope
      const focal_point_x_changed = mr_focal_point.x !== focal_point?.x
      const focal_point_y_changed = mr_focal_point.y !== focal_point?.y
      const canvas_buffer_changed = canvas_buffer && canvas_buffer.length !== prevState.canvas_buffer_width
      const width_px = page_settings[KEY_COMPS_WIDTH_PX] - 100
      const wrapper_width_changed = width_px !== wrapper_width_px
      if (scope_changed || focal_point_x_changed || focal_point_y_changed) {
         this.setState({most_recent: {scope, focal_point}})
         this.fill_pattern_bins()
      } else if (wrapper_width_changed) {
         this.initialize()
      } else if (canvas_buffer_changed) {
         this.fill_pattern_bins()
      }
   }

   initialize() {
      const {wrapper_width_px} = this.state
      const {page_settings} = this.props
      const width_px = page_settings[KEY_COMPS_WIDTH_PX] - 100
      if (width_px !== wrapper_width_px) {
         const height_px = width_px / Math.exp(1)
         this.setState({
            wrapper_width_px: Math.round(width_px),
            wrapper_height_px: Math.round(height_px)
         })
      }
   }

   fill_pattern_bins = () => {
      const {canvas_ref, wrapper_width_px, wrapper_height_px} = this.state
      const {page_settings} = this.props
      const {canvas_buffer} = page_settings
      if (!canvas_buffer) {
         return false;
      }
      const canvas = canvas_ref.current
      if (!canvas) {
         return false
      }
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8f8f8'
      ctx.fillRect(0, 0, wrapper_width_px, wrapper_height_px);

      const orbital_bins = collect_orbitals(canvas_buffer)
      // console.log('fill_pattern_bins', orbital_bins)
      const families = {}
      Object.keys(orbital_bins).forEach(key => {
         if (key.indexOf('orbital_') < 0) {
            return
         }
         const family = FractoUtil.fracto_pattern_family(orbital_bins[key].orbital)
         const family_key = `family_${family}`
         if (!families[family_key]) {
            families[family_key] = {
               base: family,
               members: [],
               total_count: 0
            }
         }
         families[family_key].members.push(orbital_bins[key])
         families[family_key].total_count += orbital_bins[key].bin_count
      })
      let highest_family_count = 0
      Object.keys(families).forEach(key => {
         if (families[key].total_count < 5) {
            delete families[key]
         } else {
            if (highest_family_count < families[key].total_count) {
               highest_family_count = families[key].total_count
            }
         }
      })
      console.log('families, highest_family_count', families, highest_family_count)
      const log_highest_count = Math.log(highest_family_count) * 2
      Object.keys(families).forEach(key => {
         const family = families[key]
         const leftmost = family.base === 1 ? 0
            : Math.round(
               wrapper_width_px * (Math.log2(family.base) - Math.floor(Math.log2(family.base)))
            )
         let base_y = wrapper_height_px
         ctx.fillStyle = FractoUtil.fracto_pattern_color(family.base)
         family.members.sort((a, b) => a.orbital - b.orbital).forEach((member) => {
            const height_px = 0.45 * wrapper_height_px * Math.log(member.bin_count) / log_highest_count
            base_y -= height_px
            let width_px = 50 - 7 * Math.log(member.orbital)
            if (width_px < 1) {
               width_px = 1
            }
            ctx.fillRect(leftmost, base_y, width_px + 1, height_px + 1)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 1
            ctx.strokeRect(leftmost, base_y, width_px + 1, height_px + 1)
            if (height_px > 15 && width_px > 15) {
               const font_size = Math.min(width_px - 12, height_px)
               ctx.font = `lighter ${font_size}px Courier, monospace`;
               ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
               ctx.strokeOpacity = 0.5
               ctx.textAlign = 'top';
               const text_pos_x = leftmost + 1
               const text_pos_y = base_y + font_size + 1
               ctx.strokeText(`${member.orbital}`, text_pos_x, text_pos_y);
            }
         })
         console.log('family', family, leftmost, wrapper_height_px)
      })


      setTimeout(() => {
         this.setState({
            orbital_bins,
            families,
            highest_family_count,
            canvas_buffer_width: canvas_buffer.length
         })
      }, 150)
      return true
   }

   render() {
      const {canvas_ref, wrapper_height_px, wrapper_width_px} = this.state
      const wrapper_style = {width: wrapper_width_px, height: wrapper_height_px};
      return <styles.ContentWrapper style={wrapper_style}>
         <styles.FamilySpanCanvas
            ref={canvas_ref}
            width={wrapper_width_px}
            height={wrapper_height_px}
         />
      </styles.ContentWrapper>
   }
}

export default OrbitalsFamilySpan;
