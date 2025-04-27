import React, {Component} from "react";
import PropTypes from "prop-types";

import {KEY_COMPS_WIDTH_PX} from "settings/PaneSettings";
import {CompPatternStyles as styles} from "styles/CompPatternStyles"
import {KEY_FOCAL_POINT, KEY_SCOPE} from "settings/AppSettings";
import FractoUtil from "fracto/FractoUtil";
import {Scatter} from "react-chartjs-2";

const R_INC = 0.1
const MIN_R = -1.0
const MAX_R = 1.0

const MAX_CARDINALITY = 16
const POINT_SIZE = 2;

const GRID_CONFIG = {
   color: function (context) {
      return context.tick.value === 0 ? '#aaaaaa' : '#dddddd'
   },
   lineWidth: function (context) {
      return context.tick.value === 0 ? 1.5 : 1
   }
};

export class PatternsMeridian extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_meridians: [],
   }

   componentDidMount() {
      const all_meridians = this.generate_meridians()
      this.setState({all_meridians})
   }

   generate_meridians = () => {
      const meridian_data = []
      for (let r = MIN_R; r < MAX_R; r += R_INC) {
         for (let cardinality = 2; cardinality < MAX_CARDINALITY; cardinality++) {
            for (let aspect = 1; aspect < cardinality; aspect++) {
               const r_squared = r * r
               const theta = aspect / cardinality
               const two_pi_theta = 2 * Math.PI * theta
               const four_pi_theta = 2 * two_pi_theta
               const cos_two_pi_theta = Math.cos(two_pi_theta)
               const cos_four_pi_theta = Math.cos(four_pi_theta)
               const sin_two_pi_theta = Math.sin(two_pi_theta)
               const r_by_2 = r / 2
               const r_squared_by_four = r_squared / 4
               const x = r_by_2 * cos_two_pi_theta - r_squared_by_four * cos_four_pi_theta
               const y = -r_by_2 * sin_two_pi_theta * (r * cos_two_pi_theta - 1)
               meridian_data.push({x, y, cardinality, aspect})
            }
         }
      }
      return meridian_data
   }

   meridians_chart = (all_points) => {
      const options = {
         scales: {
            x: {grid: GRID_CONFIG,},
            y: {grid: GRID_CONFIG,}
         },
         animation: false,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: false,
            },
         },
      }
      const datasets = []
      all_points.forEach((point) => {
         const target_id = `${point.aspect}/${point.cardinality}`
         let cardinality_set = datasets.find(dataset => {
            return dataset.Id === target_id
         })
         if (!cardinality_set) {
            cardinality_set = {
               Id: target_id,
               label: `#${point.cardinality}`,
               data: [],
               backgroundColor: FractoUtil.fracto_pattern_color(point.cardinality),
               pointRadius: POINT_SIZE,
               showLine: point.cardinality,
            }
            datasets.push(cardinality_set)
         }
         cardinality_set.data.push({x: point.x, y: point.y})
      })
      return [
         <Scatter
            datasetIdKey='id1'
            data={{datasets}} options={options}
         />
      ]
   }

   render_meridians = () => {
      const {all_meridians} = this.state
      const {page_settings} = this.props
      const scope = page_settings[KEY_SCOPE]
      const scope_by_two = scope / 2
      const focal_point = page_settings[KEY_FOCAL_POINT];
      const meridian_data = all_meridians.filter(meridian => {
         if (meridian.x < focal_point.x - scope_by_two) {
            return false
         }
         if (meridian.x > focal_point.x + scope_by_two) {
            return false
         }
         if (meridian.y < focal_point.y - scope_by_two) {
            return false
         }
         if (meridian.y > focal_point.y + scope_by_two) {
            return false
         }
         return true
      })
      meridian_data.push({
         x: focal_point.x - scope_by_two,
         y: focal_point.y + scope_by_two,
         cardinality: 0
      })
      meridian_data.push({
         x: focal_point.x + scope_by_two,
         y: focal_point.y + scope_by_two,
         cardinality: 0
      })
      meridian_data.push({
         x: focal_point.x - scope_by_two,
         y: focal_point.y - scope_by_two,
         cardinality: 0
      })
      meridian_data.push({
         x: focal_point.x + scope_by_two,
         y: focal_point.y - scope_by_two,
         cardinality: 0
      })
      return this.meridians_chart(meridian_data)
   }

   render() {
      const {page_settings} = this.props
      let wrapper_dimension = page_settings[KEY_COMPS_WIDTH_PX]
      if (page_settings[KEY_COMPS_WIDTH_PX]) {
         wrapper_dimension = Math.min(page_settings[KEY_COMPS_WIDTH_PX], page_settings[KEY_COMPS_WIDTH_PX])
      }
      const wrapper_style = {
         width: `${wrapper_dimension * 0.750}px`,
         height: `${wrapper_dimension * 0.750}px`
      }
      return <styles.ContentWrapper style={wrapper_style}>
         {this.render_meridians()}
      </styles.ContentWrapper>
   }
}

export default PatternsMeridian
