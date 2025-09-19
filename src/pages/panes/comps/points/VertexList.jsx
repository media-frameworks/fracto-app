import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import FractoFastCalc from "fracto/FractoFastCalc";
import CoolTable, {
   CELL_ALIGN_LEFT,
   CELL_TYPE_NUMBER,
   CELL_TYPE_TEXT
} from "common/ui/CoolTable";
import {render_coordinates} from "fracto/styles/FractoStyles";
import Complex from "common/math/Complex";
import {discover_cardinality} from "./PointUtils";

const VERTEX_LIST_COLUMNS = [
   {
      id: "coords",
      label: "coords",
      type: CELL_TYPE_TEXT,
      width_px: 200,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "psi",
      label: "psi",
      type: CELL_TYPE_TEXT,
      width_px: 250,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "phi",
      label: "phi",
      type: CELL_TYPE_TEXT,
      width_px: 250,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "whi",
      label: "whi",
      type: CELL_TYPE_TEXT,
      width_px: 250,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "cardinality",
      label: "cardinality",
      type: CELL_TYPE_NUMBER,
      width_px: 50,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "z",
      label: "z",
      type: CELL_TYPE_TEXT,
      width_px: 250,
      align: CELL_ALIGN_LEFT,
   },
]

export class VertexList extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      width_px: 0,
      height_px: 0,
      most_recent: {
         scope: 0,
         focal_point: {x: 0, y: 0}
      },
      fracto_values: null,
   }

   componentDidMount() {
      const {page_settings} = this.props
      const {scope, focal_point} = page_settings
      this.fill_pattern_bins(scope, focal_point)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {most_recent} = this.state
      const {page_settings} = this.props
      const {scope, focal_point} = page_settings
      const mr_scope = most_recent.scope
      const mr_focal_point = most_recent.focal_point
      const scope_changed = mr_scope !== scope
      const focal_point_x_changed = mr_focal_point.x !== focal_point?.x
      const focal_point_y_changed = mr_focal_point.y !== focal_point?.y
      if (scope_changed || focal_point_x_changed || focal_point_y_changed) {
         this.fill_pattern_bins(scope, focal_point)
      }
   }

   fill_pattern_bins = (scope, focal_point) => {
      const fracto_values = FractoFastCalc.calc(focal_point.x, focal_point.y)
      this.setState({most_recent: {scope, focal_point}, fracto_values})
   }

   render() {
      const {width_px, height_px, fracto_values, most_recent} = this.state
      const content_style = {
         width: `${width_px}px`,
         height: `${height_px}px`,
      }
      const vertex_data = fracto_values && fracto_values.orbital_points
         ? fracto_values.orbital_points.map((point, index) => {
            const current_value = new Complex(point.x, point.y)
            const next_point = fracto_values.orbital_points.at(index + 1)
            const next_value = new Complex(next_point?.x || 0, next_point?.y || 0)
            const psi = next_value.divide(current_value)
            const phi = next_value.mul(current_value)
            const whi = next_value.add(current_value)
            const psi_add_phi = psi.add(phi)
            const z = psi_add_phi.scale(0.5)
            const cardinality = discover_cardinality(most_recent.focal_point, z)
            return {
               coords:render_coordinates(current_value.re, current_value.im, 6),
               psi: render_coordinates(psi.re, psi.im, 10),
               phi: render_coordinates(phi.re, phi.im, 10),
               whi: render_coordinates(whi.re, whi.im, 10),
               z: render_coordinates(z.re, z.im, 10),
               cardinality: cardinality.best_cardinality,
            }
         }) : []
      const table = fracto_values
         ? <CoolTable
            data={vertex_data}
            columns={VERTEX_LIST_COLUMNS}/>
         : []
      return <styles.VertexListContent
         style={content_style}>
         {table}
      </styles.VertexListContent>
   }
}

export default VertexList
