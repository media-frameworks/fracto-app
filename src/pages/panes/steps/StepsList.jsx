import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_SCOPE,
   KEY_STEPS_HEIGHT_PX,
   KEY_STEPS_WIDTH_PX
} from "../../PageSettings";
import {PaneStepsStyles as styles} from 'styles/PaneStepsStyles'

const STEP_SCOPE_FACTOR = 1.618

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
   }

   componentDidMount() {
      this.set_steps()
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const {stepped_scope} = this.state
      console.log('page_settings[KEY_SCOPE]', page_settings[KEY_SCOPE])
      console.log('prevProps.page_settings[KEY_SCOPE]', prevProps.page_settings[KEY_SCOPE])
      const scope_changed = page_settings[KEY_SCOPE] !== stepped_scope
      if (scope_changed) {
         this.set_steps()
         this.setState({stepped_scope: page_settings[KEY_SCOPE]})
      }
   }

   set_steps() {
      const {page_settings} = this.props
      let step_scope = page_settings[KEY_SCOPE]
      const new_steps = []
      while (step_scope < 3.0) {
         const step_entry = create_step_entry(step_scope)
         new_steps.push(step_entry)
         step_scope *= STEP_SCOPE_FACTOR
      }
      const step_entry = create_step_entry(3.0)
      new_steps.push(step_entry)
      console.log('new_steps', new_steps)
      this.setState({all_steps: new_steps})
   }

   render() {
      const {all_steps} = this.state
      const {page_settings} = this.props
      // console.log('all_steps', all_steps)
      const steps = all_steps.map((step, i) => {
         const step_dim_px = page_settings[KEY_STEPS_WIDTH_PX] - 22
         return <styles.StepFrame style={{width: step_dim_px, height: step_dim_px}}>
            {i}
         </styles.StepFrame>
      })
      return <styles.StepsWrapper>
         {steps}
      </styles.StepsWrapper>
   }
}

export default StepsList
