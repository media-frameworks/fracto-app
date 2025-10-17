import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'

import {
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import {
   KEY_IMAGE_WIDTH
} from "pages/settings/CompSettings";
import {fill_heat_map} from "fracto/features/FractoHeatMap";

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
      if (level_counts.length > 0) {
         level_counts.unshift({
            level: level_counts[0].level - 1,
            count: image_width * image_width
         })
      }
      this.setState({
         stored_focal_point: JSON.parse(JSON.stringify(focal_point)),
         stored_scope: scope,
         stored_image_width: image_width,
         map_ready: true,
         level_counts,
      })
   }

   render_level_counts = () => {
      const {level_counts, stored_image_width} = this.state
      console.log('level_counts', level_counts)
      const all_levels = level_counts.map(item => {
         const max_size = stored_image_width * stored_image_width
         const item_pct = Math.round((item.count * 10000) / max_size) / 100
         const level_data = `${item.level}: ${item_pct}%`
         return <styles.HeatMapLevelItem>
            {level_data}
         </styles.HeatMapLevelItem>
      })
      return <styles.HeatMapLevelWrapper>
         {all_levels}
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
