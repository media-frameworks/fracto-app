import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FractoFastCalc from "fracto/FractoFastCalc";

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import PageSettings from "pages/PageSettings";
import {
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
   KEY_SCOPE,
   KEY_UPDATE_INDEX
} from "pages/settings/AppSettings";
import CoolTable, {
   CELL_ALIGN_CENTER,
   CELL_ALIGN_LEFT,
   CELL_TYPE_NUMBER,
   CELL_TYPE_TEXT
} from "common/ui/CoolTable";
import {render_coordinates} from "fracto/styles/FractoStyles";
import {get_escape_points, verify_roots} from "./PointUtils";

const VERTEX_LIST_COLUMNS = [
   {
      id: "index",
      label: "#",
      type: CELL_TYPE_NUMBER,
      width_px: 20,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "coords",
      label: "point coordinates",
      type: CELL_TYPE_TEXT,
      width_px: 350,
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
      stored_values: {},
      fracto_values: null,
   }

   componentDidMount() {
      const {page_settings} = this.props
      const {scope, focal_point} = page_settings
      this.calc_hover_data(scope, focal_point)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {stored_values} = this.state
      const {page_settings} = this.props
      const settings_changed = PageSettings.test_update_settings(
         [
            KEY_UPDATE_INDEX,
            KEY_SCOPE,
            KEY_FOCAL_POINT,
            KEY_HOVER_POINT,
         ], page_settings, stored_values)
      if (settings_changed) {
         setTimeout(() => {
            const {field_crosshairs} = page_settings;
            this.calc_hover_data(field_crosshairs
               ? stored_values.hover_point
               : stored_values.focal_point)
         }, 50)
      }
   }

   calc_hover_data = (focal_point) => {
      if (!focal_point.x) {
         return
      }
      const fracto_values = FractoFastCalc.calc(focal_point.x, focal_point.y)
      if (!fracto_values.orbital_points) {
         fracto_values.orbital_points = get_escape_points(focal_point)
      }
      this.setState({fracto_values})
      if (fracto_values.pattern) {
         const Q_core_neg = FractoFastCalc.calculate_cardioid_Q(focal_point.x, focal_point.y, -1)
         verify_roots(fracto_values.orbital_points, fracto_values.pattern, Q_core_neg)
      }
   }

   render() {
      const {width_px, height_px, fracto_values} = this.state
      const content_style = {
         width: `${width_px}px`,
         height: `${height_px}px`,
      }
      const vertex_data = fracto_values && fracto_values.orbital_points
         ? fracto_values.orbital_points
            .slice(0, -1)
            .map((point, index) => {
               return {
                  index: index + 1,
                  coords: render_coordinates(point.x, point.y, 15),
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
