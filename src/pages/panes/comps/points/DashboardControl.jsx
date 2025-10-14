import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CoolStyles} from "common/ui/CoolImports";
import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "pages/settings/PaneSettings";
import {NumberSpan, render_pattern_block} from "fracto/styles/FractoStyles";
import {
   discover_cardinality,
   get_click_point_info,
   round_places
} from "./PointUtils";
import {render_coordinates} from "fracto/styles/FractoStyles";
import {KEY_FOCAL_POINT} from "../../../settings/AppSettings";
import Complex from "../../../../common/math/Complex";

const HEIGHT_FACTOR = 2.618
const WIDTH_FACTOR = 2.618
const WIDTH_OFFSET_PX = 50
const HEIGHT_OFFSET_PX = 60

export class DashboardControl extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      width_px: 0,
      height_px: 0,
      click_point_info: null,
      rendered_focal_point: null
   }

   componentDidMount() {
      const {page_settings} = this.props
      const width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR) - WIDTH_OFFSET_PX
      const height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR) - HEIGHT_OFFSET_PX
      const focal_point = page_settings[KEY_FOCAL_POINT]
      this.setState({width_px, height_px, rendered_focal_point: focal_point})
      setTimeout(this.initialize, 150)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const new_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR)
         - WIDTH_OFFSET_PX
      const new_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR)
         - HEIGHT_OFFSET_PX
      if (prevState.width_px !== new_width_px) {
         this.setState({width_px: new_width_px})
      }
      if (prevState.height_px !== new_height_px) {
         this.setState({height_px: new_height_px})
      }
      if (prevState.rendered_focal_point) {
         const focal_point = page_settings[KEY_FOCAL_POINT]
         const focal_point_x_changed = prevState.rendered_focal_point.x !== focal_point.x
         const focal_point_y_changed = prevState.rendered_focal_point.y !== focal_point.y
         if (prevState.rendered_focal_point && (focal_point_x_changed || focal_point_y_changed)) {
            this.setState({rendered_focal_point: focal_point})
            setTimeout(this.initialize, 150)
         }
      }
   }

   initialize = () => {
      const {page_settings} = this.props
      const click_point_info = get_click_point_info(page_settings)
      const {cardinality} = click_point_info
      console.log('cardinality', cardinality)
      this.setState({click_point_info})
   }

   indefinite_article_text = (number) => {
      if ([8, 11].includes(number)) {
         return 'an'
      }
      if (number >= 80 && number <= 89) {
         return 'an'
      }
      if (number >= 800 && number <= 899) {
         return 'an'
      }
      if (number >= 8000 && number <= 8999) {
         return 'an'
      }
      return 'a'
   }

   render_pattern_preamble = () => {
      const {click_point_info} = this.state
      const {pattern, cycles, in_cardioid} = click_point_info
      const article_text = this.indefinite_article_text(cycles)
      const emboldened_text = ` ${cycles}-cyclic ${in_cardioid ? 'endo' : 'epi'}cardial`
      const emboldened = <styles.EmboldenedPreamble>
         {emboldened_text}
      </styles.EmboldenedPreamble>
      const orbital_text = ' orbital path'
      const declaration = <styles.EmboldenedPreamble>
         {` ${pattern} vertex points`}
      </styles.EmboldenedPreamble>
      return <styles.PreambleWrapper>
         <styles.DeclarationWrapper>
            {article_text}{emboldened}{orbital_text}
         </styles.DeclarationWrapper>
         <styles.DeclarationWrapper>
            ~ with {declaration}
         </styles.DeclarationWrapper>
      </styles.PreambleWrapper>
   }

   render_escape_preamble = () => {
      const {click_point_info} = this.state
      const {orbital_points} = click_point_info
      const emboldened_text = `non-cyclic, escaping`
      const emboldened = <styles.EmboldenedPreamble>
         {emboldened_text}
      </styles.EmboldenedPreamble>
      const declaration = <styles.EmboldenedPreamble>
         {` ${orbital_points.length} vertex points`}
      </styles.EmboldenedPreamble>
      return <styles.PreambleWrapper>
         <styles.DeclarationWrapper>
            a {emboldened} path
         </styles.DeclarationWrapper>
         <styles.DeclarationWrapper>
            ~ with {declaration}
         </styles.DeclarationWrapper>
      </styles.PreambleWrapper>
   }

   render() {
      const {width_px, click_point_info} = this.state
      const content_style = {width: `${width_px}px`,}
      if (!click_point_info) {
         return '...'
      }
      const {
         pattern, magnitude, click_point, Q_core_neg, iteration, elapsed_new, orbital_points,
      } = click_point_info
      let cardinality = 0
      if (orbital_points.length > 1) {
         const current_value = new Complex(orbital_points[0].x, orbital_points[0].y)
         const next_value = new Complex(orbital_points[1].x, orbital_points[1].y)
         const psi = next_value.divide(current_value)
         const phi = next_value.mul(current_value)
         const psi_add_phi = psi.add(phi)
         const z = psi_add_phi.scale(0.5)
         const cardinality_data = discover_cardinality(click_point, z)
         cardinality = `${cardinality_data.best_cardinality} (${round_places(cardinality_data.best_magnitude, 8)})`
      }
      const pattern_badge = render_pattern_block(pattern, 32)
      const preamble = pattern ? this.render_pattern_preamble() : this.render_escape_preamble()
      const separate_lines = [
         [`constant: `, render_coordinates(click_point.x, click_point.y)],
         [`focal point: `, render_coordinates(Q_core_neg.x, Q_core_neg.y)],
         [`magnitude: `, <NumberSpan>{`${round_places(magnitude, 8)}`}</NumberSpan>],
         [`iterations: `, <NumberSpan>{iteration}</NumberSpan>],
         [`elapsed ms: `, <NumberSpan>{elapsed_new}</NumberSpan>],
         [`cardinality: `, <NumberSpan>{cardinality}</NumberSpan>],
      ].map((text, i) => {
         return <CoolStyles.Block key={`line-${i}`}>
            <CoolStyles.Block>{text}</CoolStyles.Block>
         </CoolStyles.Block>
      })
      return <styles.DashboardContent
         style={content_style}>
         {pattern_badge}
         {preamble}
         <styles.NotPreambleWrapper>
            {separate_lines}
         </styles.NotPreambleWrapper>
      </styles.DashboardContent>
   }
}

export default DashboardControl
