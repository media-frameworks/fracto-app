import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
   faWandSparkles,
   faCirclePlus,
   faTrash,
   faFilm,
} from "@fortawesome/free-solid-svg-icons";

import {CoolButton, CoolSelect, CoolTable} from "common/ui/CoolImports";
import {CompVideoStyles as styles} from "styles/CompVideoStyles"
import {
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import PageSettings from "pages/PageSettings";
import {KEY_VIDEO_CAPTURE_DIMENSION_PX} from "pages/settings/VideoSettings";
import {
   CELL_ALIGN_CENTER,
   CELL_ALIGN_LEFT, CELL_TYPE_CALLBACK,
   CELL_TYPE_NUMBER,
   TABLE_CAN_SELECT
} from "common/ui/CoolTable";
import {
   render_focal_point,
   render_scope
} from "../images/ImageUtils";

const RESOLUTIONS = [
   {label: '768', value: 768, help: 'small',},
   {label: '1024', value: 1024, help: 'medium',},
   {label: '1440', value: 1440, help: 'large',},
   {label: '1920', value: 1920, help: 'super',},
]

const FRAMES_PER_STEP = 25

const STEPS_COLUMNS = [
   {
      id: "index",
      label: "#",
      type: CELL_TYPE_NUMBER,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "scope",
      label: "scope",
      type: CELL_TYPE_CALLBACK,
      align: CELL_ALIGN_LEFT
   },
   {
      id: "focal_point",
      label: "focal point",
      type: CELL_TYPE_CALLBACK,
      align: CELL_ALIGN_LEFT
   },
   {
      id: "frames",
      label: "frames",
      type: CELL_TYPE_NUMBER,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "actions",
      label: "",
      type: CELL_TYPE_CALLBACK,
      align: CELL_ALIGN_CENTER
   },
]

export class VideoCaptureField extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      current_size: 1024,
      stored_values: {},
      steps: null,
      selected_step: 0,
   }

   componentDidMount() {
      const {page_settings} = this.props
      this.initialize(page_settings[KEY_VIDEO_CAPTURE_DIMENSION_PX])
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {stored_values} = this.state
      const {page_settings} = this.props
      const current_size = page_settings[KEY_VIDEO_CAPTURE_DIMENSION_PX]
      const size_changes = current_size !== prevState.current_size
      const settings_changed = PageSettings.test_update_settings(
         [
            KEY_SCOPE,
            KEY_FOCAL_POINT,
         ], page_settings, stored_values)
      if (settings_changed || size_changes) {
         this.initialize(current_size)
      }
   }

   initialize = (current_size) => {
      console.log('initialize', current_size)
   }

   change_resolution = (e) => {
      const {on_settings_changed} = this.props
      console.log('change_resolution', e.target.value)
      const current_size = parseInt(e.target.value)
      on_settings_changed({[KEY_VIDEO_CAPTURE_DIMENSION_PX]: current_size})
      this.initialize(current_size)
   }

   select_step = (selected_step) => {
      const {steps} = this.state
      const {on_settings_changed} = this.props
      this.setState({selected_step})
      on_settings_changed({
         [KEY_SCOPE]: steps[selected_step].scope[1],
         [KEY_FOCAL_POINT]: steps[selected_step].focal_point[1],
         [KEY_DISABLED]: true,
      })
      console.log('steps, selected_step', steps, selected_step)
   }

   render_steps = () => {
      const {steps, selected_step} = this.state
      if (!steps) {
         return <styles.RegularPrompt>
            {"click the button above to begin"}
         </styles.RegularPrompt>
      }
      return <CoolTable
         columns={STEPS_COLUMNS}
         data={steps}
         options={[TABLE_CAN_SELECT]}
         on_select_row={this.select_step}
         selected_row={selected_step}
      />
   }

   deleteStep = (step_index) => {
      const {steps} = this.state
      steps.splice(step_index, 1)
      this.setState({steps})
   }

   render_actions = (step_index) => {
      const delete_icon = <styles.IconWrapper
         onClick={() => this.deleteStep(step_index)}>
         <FontAwesomeIcon icon={faTrash}/>
      </styles.IconWrapper>
      return [delete_icon, `actions for ${step_index}`]
   }

   new_video = () => {
      const {page_settings} = this.props
      const first_step = {
         index: 1,
         scope: [render_scope, page_settings[KEY_SCOPE]],
         focal_point: [render_focal_point, page_settings[KEY_FOCAL_POINT]],
         frames: 50,
         actions: [this.render_actions, 1]
      }
      this.setState({
         steps: [first_step]
      })
   }

   new_step = () => {
      const {steps} = this.state
      const {page_settings} = this.props
      const new_index = steps.length + 1
      const new_step = {
         index: new_index,
         scope: [render_scope, page_settings[KEY_SCOPE]],
         focal_point: [render_focal_point, page_settings[KEY_FOCAL_POINT]],
         frames: 50,
         actions: [this.render_actions, new_index]
      }
      steps.push(new_step)
      this.setState({
         steps,
         selected_step: new_index - 1,
      })
   }

   animate = (schedule) => {
      const {page_settings, on_settings_changed} = this.props
      if (page_settings[KEY_DISABLED]) {
         setTimeout(() => {
            this.animate(schedule)
         }, 50)
         return;
      }
      if (!schedule.length) {
         return;
      }
      const frame = schedule.shift()
      on_settings_changed({
         [KEY_SCOPE]: frame.scope,
         [KEY_FOCAL_POINT]: frame.focal_point,
         [KEY_DISABLED]: true,
      })
      setTimeout(() => {
         this.animate(schedule)
      }, 50)
   }

   run_test = () => {
      const {steps} = this.state
      const schedule = []
      for (let step = 0; step < steps.length - 1; step += 1) {
         const this_step = steps[step]
         const next_step = steps[step + 1]

         const scope_span = next_step.scope[1] - this_step.scope[1]
         const scope_increment = scope_span / FRAMES_PER_STEP
         const focal_x_span = next_step.focal_point[1].x - this_step.focal_point[1].x
         const focal_x_increment = focal_x_span / FRAMES_PER_STEP
         const focal_y_span = next_step.focal_point[1].y - this_step.focal_point[1].y
         const focal_y_increment = focal_y_span / FRAMES_PER_STEP

         for (let frame = 0; frame < FRAMES_PER_STEP; frame += 1) {
            schedule.push({
               scope: this_step.scope[1] + scope_increment * frame,
               focal_point: {
                  x: this_step.focal_point[1].x + focal_x_increment * frame,
                  y: this_step.focal_point[1].y + focal_y_increment * frame,
               }
            })
         }
      }
      this.animate(schedule)
   }

   render() {
      const {current_size, steps} = this.state
      const step_table = this.render_steps()
      const new_video_icon = <FontAwesomeIcon icon={faWandSparkles}/>
      const new_video_button = !steps
         ? <CoolButton
            content={new_video_icon}
            on_click={this.new_video}
            primary={true}
            style={{fontSize: '14px'}}
         />
         : ''
      const new_step_icon = <FontAwesomeIcon icon={faCirclePlus}/>
      const new_step_button = Array.isArray(steps)
         ? <CoolButton
            content={new_step_icon}
            on_click={this.new_step}
            primary={true}
            style={{fontSize: '14px'}}
         />
         : ''
      const film_icon = <FontAwesomeIcon icon={faFilm}/>
      const film_button = Array.isArray(steps) && steps.length > 1
         ? <CoolButton
            content={film_icon}
            on_click={this.run_test}
            primary={true}
            style={{fontSize: '14px'}}
         />
         : ''
      return [
         <styles.SectionWrapper>
            <CoolSelect
               options={RESOLUTIONS}
               value={current_size}
               on_change={this.change_resolution}
            />
            <styles.Spacer/>
            {new_video_button}
         </styles.SectionWrapper>,
         <styles.SectionWrapper>
            {step_table}
         </styles.SectionWrapper>,
         <styles.SectionWrapper>
            {new_step_button}
            <styles.Spacer/>
            {film_button}
         </styles.SectionWrapper>,
      ]
   }
}

export default VideoCaptureField
