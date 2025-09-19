import {Component} from 'react';
import PropTypes from 'prop-types';

import {CompAdminStyles as styles} from 'styles/CompAdminStyles'
import {CoolInputText} from "common/ui/CoolImports";
import FractoFastCalc from "../../../../fracto/FractoFastCalc";
import {KEY_DISABLED, KEY_FOCAL_POINT, KEY_LOCATE_CENTER} from "../../../../settings/AppSettings";
// import FractoCardioidCalc from "fracto/FractoCardioidCalc";
import FractoRootsOfUnity from "fracto/FractoRootsOfUnity";

export class CompInspect extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      numerator: '',
      denominator: '',
      m_value: 1.0,
      meridian_points: [],
      test_display: '',
   }

   initialize = () => {
   }

   static in_process = false

   next_step = (m) => {
      const {numerator, denominator, meridian_points} = this.state
      const {page_settings, on_settings_changed} = this.props
      if (page_settings[KEY_DISABLED] === false) {
         const remaining = 1 - m
         m = 1 - remaining * 0.98
         const P = FractoFastCalc.get_meridian_point(m, numerator, denominator)
         on_settings_changed({
            [KEY_FOCAL_POINT]: P,
            [KEY_LOCATE_CENTER]: true,
         })
         meridian_points.push({m, P})
         this.setState({meridian_points})
      }
      if (CompInspect.in_process) {
         setTimeout(() => {
            this.next_step(m)
         }, 1500)
      }
   }

   on_go = () => {
      const {numerator, denominator} = this.state
      if (CompInspect.in_process) {
         CompInspect.in_process = false
         return
      }
      if (!numerator || !denominator) {
         return;
      }
      if (denominator < numerator) {
         return;
      }
      CompInspect.in_process = true
      setTimeout(() => {
         this.next_step(0.99995)
      }, 500)
   }

   on_change_num = (numerator) => {
      if (CompInspect.in_process) {
         return
      }
      this.setState({
         numerator: parseInt(numerator, 10),
      })
      setTimeout(() => {
         this.initialize()
      }, 500)
   }

   on_change_den = (denominator) => {
      if (CompInspect.in_process) {
         return
      }
      this.setState({
         denominator: parseInt(denominator, 10),
      })
      setTimeout(() => {
         this.initialize()
      }, 500)
   }

   data_entry = () => {
      const {numerator, denominator} = this.state
      const input_style = {width: '30px'}
      const go_style = {opacity: CompInspect.in_process ? 0.35 : 1}
      return [
         'theta: ',
         <CoolInputText
            value={numerator}
            style_extra={input_style}
            placeholder={'number > 0'}
            on_change={this.on_change_num}
         />,
         '/',
         <CoolInputText
            value={denominator}
            style_extra={input_style}
            placeholder={'number > A'}
            on_change={this.on_change_den}
         />,
         <styles.GoLink
            style={go_style}
            onClick={this.on_go}>
            go
         </styles.GoLink>
      ].map((inline, i) => {
         return <styles.InspectorPrompt
            style={{marginRight: '0.5rem'}}
            key={`data-entry-${i}`}>
            {inline}
         </styles.InspectorPrompt>
      })
   }

   test_high_Q = () => {
      const {page_settings} = this.props
      if (page_settings[KEY_DISABLED]) {
         return ''
      }
      const click_point = page_settings[KEY_FOCAL_POINT]
      // const test_results = FractoCardioidCalc.calc(click_point)
      const test_results = FractoRootsOfUnity.calc(click_point)
      console.log('test_results', test_results)
      const test_display = <pre>
          {JSON.stringify(test_results, null, 2)}
      </pre>
      this.setState({test_display})
   }

   render() {
      const {test_display} = this.state
      // console.log('meridian_points', meridian_points)
      return <styles.ContentWrapper style={{overflow: 'auto'}}>
         {this.data_entry()}
         <styles.GoLink
            style={{}}
            onClick={this.test_high_Q}>
            test
         </styles.GoLink>
         {test_display}
      </styles.ContentWrapper>
   }
}

export default CompInspect
