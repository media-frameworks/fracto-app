import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import {
   CELL_ALIGN_CENTER, CELL_TYPE_CALLBACK,
   CELL_TYPE_NUMBER, CELL_TYPE_TEXT, CoolTable, NumericSpan
} from "common/ui/CoolTable";

import {
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import {
   KEY_IMAGE_WIDTH
} from "pages/settings/CompSettings";
import {fill_heat_map} from "fracto/features/FractoHeatMap";

const TABLE_COLUMNS = [
   {
      id: "color",
      label: "shade",
      type: CELL_TYPE_CALLBACK,
      width_px: 60,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "level",
      label: "level",
      type: CELL_TYPE_NUMBER,
      width_px: 40,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "percent",
      label: "coverage",
      type: CELL_TYPE_TEXT,
      width_px: 80,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "tile_count",
      label: "# tiles",
      type: CELL_TYPE_NUMBER,
      width_px: 60,
      align: CELL_ALIGN_CENTER,
   },
]

export class ImagesHeatMap extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      level_counts: [],
      stored_focal_point: {},
      stored_scope: 0,
      stored_image_width: 0,
      canvas_ref: React.createRef(),
      map_ready: false,
   }

   componentDidMount() {
      this.fill_map()
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {stored_focal_point, map_ready} = this.state
      const {page_settings} = this.props;
      const image_width = page_settings[KEY_IMAGE_WIDTH];
      const scope = page_settings[KEY_SCOPE]
      const focal_point = page_settings[KEY_FOCAL_POINT];
      const image_width_changed = image_width !== prevState.stored_image_width;
      const scope_changed = scope !== prevState.stored_scope;
      const focal_point_x_changed = focal_point.x !== stored_focal_point.x
      const focal_point_y_changed = focal_point.y !== stored_focal_point.y
      if (map_ready &&
         (image_width_changed || scope_changed || focal_point_x_changed || focal_point_y_changed)) {
         this.setState({map_ready: false})
         setTimeout(this.fill_map, 50);
      }
   }

   fill_map = () => {
      const {canvas_ref} = this.state
      const {page_settings} = this.props;
      const image_width = page_settings[KEY_IMAGE_WIDTH];
      const scope = page_settings[KEY_SCOPE]
      const focal_point = page_settings[KEY_FOCAL_POINT];
      const canvas = canvas_ref.current;
      if (!canvas) {
         console.log('no canvas');
         return;
      }
      const ctx = canvas.getContext('2d');
      const level_counts = fill_heat_map(ctx, image_width, scope, focal_point);
      this.setState({
         stored_focal_point: JSON.parse(JSON.stringify(focal_point)),
         stored_scope: scope,
         stored_image_width: image_width,
         map_ready: true,
         level_counts,
      })
   }
   render_color = (item) => {
      return <div style={{
         backgroundColor: item.color,
         color: item.color,
      }}>.</div>
   }

   render_level_counts = () => {
      const {level_counts, stored_image_width} = this.state
      console.log('level_counts', level_counts)
      const table_data = []
      const max_size = stored_image_width * stored_image_width
      level_counts.forEach((item) => {
         const item_copy = JSON.parse(JSON.stringify(item))
         const percent = Math.round((item.count * 10000) / max_size) / 100
         table_data.push({
            level: item.level,
            percent: <NumericSpan>{`${percent}%`}</NumericSpan>,
            tile_count: item.tile_count,
            color: [this.render_color, item_copy],
         })
      })
      const level_count_table = <CoolTable
         columns={TABLE_COLUMNS}
         data={table_data}
      />
      return <styles.HeatMapLevelWrapper>
         {level_count_table}
      </styles.HeatMapLevelWrapper>
   }

   render() {
      const {canvas_ref, map_ready, stored_image_width} = this.state
      const canvas_style = {
         cursor: !map_ready ? "wait" : "crosshair"
      }
      const level_count_list = this.render_level_counts()
      return [
         <styles.HeatMapCanvas
            key={'heat-map-canvas'}
            ref={canvas_ref}
            style={canvas_style}
            width={stored_image_width}
            height={stored_image_width}
         />,
         level_count_list
      ]
   }
}

export default ImagesHeatMap
