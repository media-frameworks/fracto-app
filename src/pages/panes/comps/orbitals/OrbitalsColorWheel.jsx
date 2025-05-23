import React, {Component} from "react";
import PropTypes from "prop-types";

import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'
import {KEY_COMPS_HEIGHT_PX} from "settings/PaneSettings";
import {collect_orbitals} from "fracto/CanvasBufferUtils";
import {color_wheel} from "fracto/ColorWheelUtils";

export class OrbitalsColorWheel extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      most_recent: {
         scope: 0,
         focal_point: {x: 0, y: 0}
      },
      canvas_ref: React.createRef(),
      dimension_px: 0,
   }

   componentDidMount() {
      const interval = setInterval(() => {
         if (this.fill_pattern_bins()) {
            clearInterval(interval)
         }
      }, 500)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {most_recent} = this.state
      const {page_settings} = this.props
      const {scope, focal_point, canvas_buffer} = page_settings
      const mr_scope = most_recent.scope
      const mr_focal_point = most_recent.focal_point
      const scope_changed = mr_scope !== scope
      const focal_point_x_changed = mr_focal_point.x !== focal_point?.x
      const focal_point_y_changed = mr_focal_point.y !== focal_point?.y
      const canvas_buffer_changed = canvas_buffer && !prevProps.canvas_buffer
      if (scope_changed || focal_point_x_changed || focal_point_y_changed) {
         this.setState({most_recent: {scope, focal_point}})
         this.fill_pattern_bins()
      } else if (canvas_buffer_changed) {
         // this.fill_pattern_bins()
      }
   }

   fill_pattern_bins = () => {
      const {canvas_ref} = this.state
      const {page_settings} = this.props
      const {canvas_buffer} = page_settings
      if (!canvas_buffer) {
         return false;
      }
      const dimension_px = page_settings[KEY_COMPS_HEIGHT_PX] * 0.40
      const orbital_bins = collect_orbitals(canvas_buffer)
      setTimeout(() => {
         this.setState({dimension_px})
      }, 100)
      const radius = dimension_px / 2 - 10
      if (radius > 0) {
         color_wheel(canvas_ref, radius, 8, 0, orbital_bins)
      }
      return true
   }

   render() {
      const {canvas_ref, dimension_px} = this.state
      const wheelStyle = {
         height: `${dimension_px}px`, width: `${dimension_px}px`
      }
      return <styles.ColorWheelWrapper style={wheelStyle}>
         <styles.ColorWheelCanvas
            ref={canvas_ref}
            width={dimension_px}
            height={dimension_px}
         />
      </styles.ColorWheelWrapper>
   }
}

export default OrbitalsColorWheel
