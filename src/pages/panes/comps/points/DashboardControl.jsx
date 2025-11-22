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
   get_click_point_info,
   get_escape_points,
   get_magnitude,
} from "./PointUtils";
import {render_coordinates} from "fracto/styles/FractoStyles";
import {
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT,
   KEY_SCOPE,
} from "pages/settings/AppSettings";
import PageSettings from "pages/PageSettings";
import FractoFastCalc from "../../../../fracto/FractoFastCalc";

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
      stored_values: {},
      fracto_values: {},
      click_point: {},
   }

   componentDidMount() {
      const {page_settings} = this.props
      const width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR) - WIDTH_OFFSET_PX
      const height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR) - HEIGHT_OFFSET_PX
      this.setState({width_px, height_px})
      setTimeout(this.initialize, 150)
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {stored_values} = this.state
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
      const settings_changed = PageSettings.test_update_settings(
         [
            KEY_SCOPE,
            KEY_FOCAL_POINT,
            KEY_HOVER_POINT,
         ], page_settings, stored_values)
      if (settings_changed) {
         setTimeout(this.initialize, 50)
      }
   }

   initialize = () => {
      const {page_settings} = this.props
      const {field_crosshairs, hover_point, focal_point} = page_settings;
      const click_point = field_crosshairs ? hover_point : focal_point
      const fracto_values = FractoFastCalc.calc(click_point.x, click_point.y)
      const click_point_info = get_click_point_info(page_settings)
      if (!fracto_values.orbital_points) {
         fracto_values.orbital_points = get_escape_points(focal_point)
      }
      this.setState({click_point_info, fracto_values, click_point})
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
      const {width_px, click_point_info, fracto_values, click_point} = this.state
      const content_style = {width: `${width_px}px`,}
      if (!click_point_info) {
         return '...'
      }
      const {pattern, Q_core_neg, iteration, cardinality_plus, cardinality_minus} = click_point_info
      const pattern_badge = render_pattern_block(pattern, 32)
      const preamble = pattern ? this.render_pattern_preamble() : this.render_escape_preamble()
      const magnitude = !pattern ? '-'
         : get_magnitude(fracto_values.orbital_points, Q_core_neg)
      const separate_lines = [
         [`focal point (P): `, render_coordinates(click_point.x, click_point.y)],
         [`generative (Q): `, render_coordinates(Q_core_neg.x, Q_core_neg.y)],
         [`magnitude: `, <NumberSpan>{`${magnitude}`}</NumberSpan>],
         [`iterations: `, <NumberSpan>{iteration}</NumberSpan>],
         [`cardinality_plus: `, render_coordinates(cardinality_plus.re, cardinality_plus.im)],
         [`cardinality_minus: `, render_coordinates(cardinality_minus.re, cardinality_minus.im)],
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
