import {Component} from 'react';
import PropTypes from 'prop-types';

import {NumberSpan, render_coordinates} from "fracto/styles/FractoStyles";
import {KEY_IMAGE_WIDTH} from 'settings/CompSettings'
import {
   KEY_CACHE_SIZE,
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
   KEY_SCOPE
} from 'settings/AppSettings'
import {
   KEY_FIELD_WIDTH_PX,
   KEY_LEGEND_HEIGHT_PX,
   KEY_LEGEND_WIDTH_PX,
} from 'settings/PaneSettings'
import {
   PaneLegendStyles as styles,
   THUMBNAIL_WIDTH_PX,
   LABEL_WIDTH_PX,
   HEADER_HEIGHT_PX
} from 'styles/PaneLegendStyles'
import {get_tiles} from "fracto/FractoRasterImage";
import CoolStyles from "common/ui/styles/CoolStyles";
import {LS_INDEXED_TILE_COUNT} from "fracto/FractoTilesLoaderProgress";
import FractoTileCache from "fracto/FractoTileCache";
import BailiwickList from "fracto/bailiwick/BailiwickList";

export class LegendTabStats extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {}

   componentDidMount() {
   }

   reduce_cache = (amount_ms = 30 * 1000) => {
      FractoTileCache.trim_cache(amount_ms);
   }

   render_stats = () => {
      const {page_settings} = this.props
      const focal_point_x = page_settings[KEY_FOCAL_POINT]?.x || 0.0
      const focal_point_y = page_settings[KEY_FOCAL_POINT]?.y || 0.0
      const hover_point_x = page_settings[KEY_HOVER_POINT]?.x || null
      const hover_point_y = page_settings[KEY_HOVER_POINT]?.y || null
      const coverage_data = get_tiles(
         page_settings[KEY_FIELD_WIDTH_PX],
         page_settings[KEY_FOCAL_POINT],
         page_settings[KEY_SCOPE],
         1.0)
      // console.log('coverage_data', coverage_data)
      const coverage_str = coverage_data
         .sort((a, b) => b.level - a.level)
         .slice(0, 8)
         .map((item) => {
            return `${item.level}:${item.level_tiles.length}`
         }).join(', ')
      const mode = page_settings[KEY_DISABLED]
         ? <styles.WaitSpan>loading...</styles.WaitSpan>
         : <styles.ReadySpan>ready</styles.ReadySpan>
      const tile_count = localStorage.getItem(LS_INDEXED_TILE_COUNT);
      let tile_count_str = '?'
      if (tile_count) {
         tile_count_str = parseInt(tile_count, 10).toLocaleString()
      }
      const scope_value = [
         BailiwickList.render_magnitude(page_settings[KEY_SCOPE]),
         ` (${page_settings[KEY_SCOPE]})`
      ]
      const tab_content = [
         {
            label: 'mode',
            content: mode,
         },
         {
            label: 'focal point',
            content: render_coordinates(focal_point_x, focal_point_y),
         },
         {
            label: 'cursor position',
            content: hover_point_x || hover_point_y
               ? render_coordinates(hover_point_x, hover_point_y) : '-',
         },
         {
            label: 'scope',
            content: <NumberSpan>{scope_value}</NumberSpan>,
         },
         {
            label: 'coverage',
            content: <NumberSpan>{coverage_str}</NumberSpan>,
         },
         {
            label: 'image width',
            content: <NumberSpan>{page_settings[KEY_IMAGE_WIDTH]}px</NumberSpan>,
         },
         {
            label: 'available tiles',
            content: <NumberSpan>{tile_count_str}</NumberSpan>,
         },
         {
            label: 'tiles in cache',
            content: <NumberSpan onClick={this.reduce_cache}>{page_settings[KEY_CACHE_SIZE]}</NumberSpan>,
         },
      ].map((stat, i) => {
         const content_style = {
            width: `${page_settings[KEY_LEGEND_WIDTH_PX] - THUMBNAIL_WIDTH_PX - LABEL_WIDTH_PX - 25}px`,
         }
         return <styles.TabsContentWrapper>
            <CoolStyles.InlineBlock>
               <styles.StatsLabel>{`${stat.label}: `}</styles.StatsLabel>
            </CoolStyles.InlineBlock>
            <styles.StatsContent style={content_style}>
               {stat.content}
            </styles.StatsContent>
         </styles.TabsContentWrapper>
      })
      const wrapper_style = {
         height: `${page_settings[KEY_LEGEND_HEIGHT_PX] - HEADER_HEIGHT_PX}px`,
         backgroundColor: 'white'
      }
      return <CoolStyles.Block style={wrapper_style}>{tab_content}</CoolStyles.Block>
   }

   render() {
      return this.render_stats()
   }
}

export default LegendTabStats
