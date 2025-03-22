import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {BailiwickStyles as styles} from '../styles/BailiwickStyles'
import {CoolStyles, CoolTable} from 'common/ui/CoolImports';
import FractoUtil from "fracto/FractoUtil";
import {render_big_pattern_block, render_coordinates} from "fracto/styles/FractoStyles";
import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, BarController} from "chart.js/auto";
import FractoFastCalc from "../FractoFastCalc";
import FractoTileContext from "../FractoTileContext";
import {
   CELL_ALIGN_CENTER,
   CELL_TYPE_NUMBER,
   CELL_TYPE_TEXT
} from "common/ui/CoolTable";

ChartJS.register(CategoryScale, BarController)

const GRID_CONFIG = {
   color: function (context) {
      return context.tick.value === 0 ? '#aaaaaa' : '#dddddd'
   },
   lineWidth: function (context) {
      return context.tick.value === 0 ? 1.5 : 1
   }
};

const EXPANSION_FACTOR = 1.08
const CONTRACTION_FACTOR = 1 / EXPANSION_FACTOR
const MIN_CONTEXT_SCOPE = 1.5
const ZOOM_REFRESH_MS = 50
const ZOOM_REFRESH_PAUSE_MS = 3000

const QUADRANTS_COLUMNS = [
   {
      id: "quadrant",
      label: "quadrant",
      type: CELL_TYPE_TEXT,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "point_count",
      label: "points",
      type: CELL_TYPE_NUMBER,
      align: CELL_ALIGN_CENTER
   },
]

export class BailiwickDetails extends Component {

   static propTypes = {
      width_px: PropTypes.number.isRequired,
      selected_bailiwick: PropTypes.object.isRequired,
      highest_level: PropTypes.number.isRequired,
      freeform_index: PropTypes.number.isRequired,
      on_close: PropTypes.func.isRequired
   }

   state = {
      details_ref: React.createRef(),
      context_scope: 6,
      scope_factor: CONTRACTION_FACTOR,
      display_settings: null,
      core_point: null,
      fracto_values: null,
   }

   componentDidMount() {
      const {details_ref} = this.state
      const {selected_bailiwick} = this.props
      details_ref.current.scrollIntoView({behavior: "smooth", block: "start"})
      const display_settings = typeof selected_bailiwick.display_settings === 'string'
         ? JSON.parse(selected_bailiwick.display_settings)
         : selected_bailiwick.display_settings
      let core_point = typeof selected_bailiwick.core_point === 'string'
         ? JSON.parse(selected_bailiwick.core_point)
         : selected_bailiwick.core_point
      if (core_point.y < 0.00001) {
         core_point.y = 0
      }
      const fracto_values = FractoFastCalc.calc(core_point.x, core_point.y)
      this.setState({display_settings, core_point, fracto_values})
   }

   render_magnitude = () => {
      const {selected_bailiwick} = this.props;
      const rounded = Math.round(selected_bailiwick.magnitude * 100000000) / 100
      const mu = <i>{'\u03BC'}</i>
      return <CoolStyles.Block>
         <styles.StatLabel>magnitude:</styles.StatLabel>
         <styles.BigStatValue>{rounded}{mu}</styles.BigStatValue>
         <styles.InlineWrapper>
            <styles.StatValue>{` (${selected_bailiwick.magnitude})`}</styles.StatValue>
         </styles.InlineWrapper>
      </CoolStyles.Block>
   }

   render_core_point = () => {
      const {core_point} = this.state;
      if (!core_point) {
         return []
      }
      const core_point_rendered = render_coordinates(core_point.x, core_point.y);
      return <CoolStyles.Block>
         <styles.StatValue>{core_point_rendered}</styles.StatValue>
      </CoolStyles.Block>
   }

   click_point_chart = () => {
      const {fracto_values} = this.state;
      if (!fracto_values) {
         return []
      }
      const set1 = fracto_values.orbital_points
      const options = {
         scales: {
            x: {grid: GRID_CONFIG},
            y: {grid: GRID_CONFIG}
         },
         animation: true,
      }
      const cardinality = set1?.length - 1 || 0
      const data_dataset = {
         datasets: [
            {
               Id: 1,
               label: `${cardinality || '?'}-point orbital`,
               data: set1,
               backgroundColor: FractoUtil.fracto_pattern_color(cardinality || 0),
               showLine: true
            },
         ]
      }
      return [
         <Scatter
            datasetIdKey='id1'
            data={data_dataset} options={options}
         />
      ]
   }

   on_context_rendered = () => {
      const {context_scope, display_settings} = this.state
      const tile_scope = display_settings.scope
      const refresh_time_ms =
         context_scope < MIN_CONTEXT_SCOPE || context_scope * tile_scope > 3
            ? ZOOM_REFRESH_PAUSE_MS : ZOOM_REFRESH_MS
      setTimeout(() => {
         const {context_scope, scope_factor} = this.state
         if (tile_scope) {
            if (context_scope < MIN_CONTEXT_SCOPE) {
               this.setState({
                  context_scope: MIN_CONTEXT_SCOPE,
                  scope_factor: EXPANSION_FACTOR,
               })
            } else if (context_scope * tile_scope > 3) {
               this.setState({
                  context_scope: 3 / tile_scope,
                  scope_factor: CONTRACTION_FACTOR,
               })
            } else {
               this.setState({
                  context_scope: context_scope * scope_factor,
               })
            }
         }
      }, refresh_time_ms)
   }

   render_quadrants_table = () => {
      const {fracto_values} = this.state
      // console.log('fracto_values', fracto_values)
      if (!fracto_values) {
         return []
      }
      const quad_counts = [0, 0, 0, 0]
      fracto_values.orbital_points
         .forEach((point, index) => {
            if (index === 0) {
               return
            }
            if (Math.sqrt(point.x * point.x + point.y * point.y) < 0.0001) {
               return
            }
            if (point.x > 0 && point.y > 0) {
               quad_counts[0] += 1
            } else if (point.x < 0 && point.y > 0) {
               quad_counts[1] += 1
            } else if (point.x < 0 && point.y < 0) {
               quad_counts[2] += 1
            } else if (point.x > 0 && point.y < 0) {
               quad_counts[3] += 1
            }
         })
      const quadrants_data = [
         {quadrant: 'I', point_count: quad_counts[0]},
         {quadrant: 'II', point_count: quad_counts[1]},
         {quadrant: 'III', point_count: quad_counts[2]},
         {quadrant: 'IV', point_count: quad_counts[3]}
      ]
      return <CoolTable
         data={quadrants_data}
         columns={QUADRANTS_COLUMNS}
      />
   }

   render() {
      const {details_ref, context_scope, display_settings} = this.state
      const {selected_bailiwick, on_close, width_px} = this.props;
      const bailiwick_name = selected_bailiwick?.name || ''
      const close_btn = <styles.CloseButton onClick={on_close}>X</styles.CloseButton>
      const width_chart_px = Math.round(0.72 * width_px)
      const width_context_px = Math.round(0.20 * width_px)
      let context_zoom = []
      if (display_settings) {
         const {focal_point, scope} = display_settings
         const tile_bounds = focal_point ? {
            left: focal_point.x - scope / 2,
            right: focal_point.x + scope / 2,
            top: focal_point.y + scope / 2,
            bottom: focal_point.y - scope / 2,
         } : null
         context_zoom = focal_point ? <FractoTileContext
            tile={{scope: context_scope, bounds: tile_bounds}}
            width_px={width_context_px}
            on_context_rendered={this.on_context_rendered}
            scope_factor={context_scope}
         /> : ''
      }
      return [
         <CoolStyles.Block style={{margin: '0.25rem'}} ref={details_ref}>
            {close_btn}
            {render_big_pattern_block(selected_bailiwick?.pattern)}
            <styles.BailiwickNameBlock>
               <styles.BailiwickNameSpan>{bailiwick_name}</styles.BailiwickNameSpan>
               <styles.StatsWrapper>{this.render_core_point()}</styles.StatsWrapper>
            </styles.BailiwickNameBlock>
         </CoolStyles.Block>,
         <styles.LowerWrapper>
            {this.render_magnitude()}
         </styles.LowerWrapper>,
         <styles.ChartWrapper style={{width: `${width_chart_px}px`}}>
            {this.click_point_chart(selected_bailiwick.core_point)}
         </styles.ChartWrapper>,
         <styles.SideWrapper style={{width: `${width_context_px}px`}}>
            {context_zoom}
            <styles.QuadrantsWrapper>
               {this.render_quadrants_table()}
            </styles.QuadrantsWrapper>
         </styles.SideWrapper>,
      ]
   }
}

export default BailiwickDetails;
