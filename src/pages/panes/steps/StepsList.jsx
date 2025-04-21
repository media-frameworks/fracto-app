import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {KEY_STEPS_WIDTH_PX} from "settings/PaneSettings";
import {
   KEY_FOCAL_POINT,
   KEY_SCOPE,
   KEY_DISABLED,
   KEY_STEPS_ZOOM,
} from 'settings/AppSettings'
import {PaneStepsStyles as styles} from 'styles/PaneStepsStyles'
import FractoRasterImage from "../../../fracto/FractoRasterImage";

const create_step_entry = (step_scope) => {
   return {
      scope: step_scope,
      ref: React.createRef(),
   }
}

export class StepsList extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_steps: [],
      stepped_scope: 0,
      stepped_zoom: 0,
   }

   componentDidMount() {
      this.set_steps()
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const {stepped_scope, stepped_zoom} = this.state
      // console.log('page_settings[KEY_SCOPE]', page_settings[KEY_SCOPE])
      // console.log('prevProps.page_settings[KEY_SCOPE]', prevProps.page_settings[KEY_SCOPE])
      const scope_changed = page_settings[KEY_SCOPE] !== stepped_scope
      const zoom_changed = page_settings[KEY_STEPS_ZOOM] !== stepped_zoom
      if (scope_changed || zoom_changed) {
         this.set_steps()
         this.setState({
            stepped_scope: page_settings[KEY_SCOPE],
            stepped_zoom: page_settings[KEY_STEPS_ZOOM],
         })
      }
   }

   set_steps() {
      const {page_settings} = this.props
      let step_scope = page_settings[KEY_SCOPE]
      const new_steps = []
      while (step_scope < 3.0) {
         const step_entry = create_step_entry(step_scope)
         new_steps.push(step_entry)
         step_scope *= page_settings[KEY_STEPS_ZOOM]
      }
      const step_entry = create_step_entry(3.0)
      new_steps.push(step_entry)
      // console.log('new_steps', new_steps)
      setTimeout(() => {
         this.setState({all_steps: new_steps})
      }, 250)
   }

   click_step = (step) => {
      const {on_settings_changed} = this.props
      let new_settings = {}
      new_settings[KEY_SCOPE] = step.scope
      on_settings_changed(new_settings)
   }

   render() {
      const {all_steps} = this.state
      const {page_settings} = this.props
      // console.log('all_steps', all_steps)
      const steps = all_steps.map((step, i) => {
         const step_dim_px = page_settings[KEY_STEPS_WIDTH_PX] - 22
         return <styles.StepFrame
            key={`step-${i}`}
            style={{width: step_dim_px, height: step_dim_px, cursor: 'pointer'}}
            onClick={e => this.click_step(step)}
         >
            <FractoRasterImage
               width_px={step_dim_px}
               scope={step.scope}
               focal_point={page_settings[KEY_FOCAL_POINT]}
               aspect_ratio={1.0}
               disabled={page_settings[KEY_DISABLED]}
            />
         </styles.StepFrame>
      })
      return <styles.StepsWrapper>
         {steps}
      </styles.StepsWrapper>
   }
}

export default StepsList
