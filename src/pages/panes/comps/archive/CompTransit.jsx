import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {CoolButton, CoolStyles, CoolTable} from "common/ui/CoolImports";
import {CELL_ALIGN_CENTER, CELL_TYPE_NUMBER, TABLE_CAN_SELECT} from "common/ui/CoolTable";
import {KEY_DISABLED, KEY_FOCAL_POINT, KEY_IN_ANIMATION, KEY_SCOPE, KEY_UPDATE_INDEX} from "../../../PageSettings";

const ContentWrapper = styled(CoolStyles.Block)`
    padding: 0.5rem;
    background-color: white;
    text-align: left;
`
const FRAMES_PER_STEP = 120

const PATH_STEPS_COLUMNS = [
   {
      id: "step_index",
      label: "#",
      type: CELL_TYPE_NUMBER,
      width_px: 20,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "focal_point_x",
      label: "X",
      type: CELL_TYPE_NUMBER,
      width_px: 180,
   },
   {
      id: "focal_point_y",
      label: "Y",
      type: CELL_TYPE_NUMBER,
      width_px: 180,
   },
   {
      id: "scope",
      label: "scope",
      type: CELL_TYPE_NUMBER,
      width_px: 180,
   },
]

export class CompTransit extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      path_steps: [],
      step_index: 0,
      in_render: false,
   }

   add_to_path = () => {
      const {path_steps} = this.state
      const {page_settings} = this.props
      path_steps.push({
         focal_point: JSON.parse(JSON.stringify(page_settings[KEY_FOCAL_POINT])),
         scope: page_settings[KEY_SCOPE],
      })
      this.setState({path_steps})
   }

   select_step = (index) => {
      const {path_steps} = this.state
      const {on_settings_changed} = this.props
      on_settings_changed({
         [KEY_FOCAL_POINT]: {
            x: path_steps[index].focal_point.x,
            y: path_steps[index].focal_point.y,
         },
         [KEY_SCOPE]: path_steps[index].scope
      })
      this.setState({step_index: index})
   }

   make_frame_list = () => {
      const {path_steps} = this.state
      const frame_list = []
      path_steps.forEach((step, step_index) => {
         if (step_index === path_steps.length - 1) {
            return;
         }
         const focal_point_x_diff =
            path_steps[step_index + 1].focal_point.x - step.focal_point.x
         const focal_point_y_diff =
            path_steps[step_index + 1].focal_point.y - step.focal_point.y
         const scope_diff =
            path_steps[step_index + 1].scope - step.scope
         for (let frame_index = 0; frame_index < FRAMES_PER_STEP; frame_index++) {
            const focal_point_x = step.focal_point.x +
               (focal_point_x_diff * frame_index) / FRAMES_PER_STEP
            const focal_point_y = step.focal_point.y +
               (focal_point_y_diff * frame_index) / FRAMES_PER_STEP
            const scope = step.scope +
               (scope_diff * frame_index) / FRAMES_PER_STEP
            frame_list.push({
               focal_point: {x: focal_point_x, y: focal_point_y},
               scope: scope,
            })
         }
      })
      return frame_list
   }

   render_video = () => {
      const {page_settings} = this.props
      const frame_list = this.make_frame_list()
      this.select_step(0)
      setTimeout(() => {
         const starting_update_index = page_settings[KEY_UPDATE_INDEX]
         let current_update_index = 0
         const interval = setInterval(() => {
            const {page_settings, on_settings_changed} = this.props
            if (current_update_index <= page_settings[KEY_UPDATE_INDEX]) {
               current_update_index = page_settings[KEY_UPDATE_INDEX]
               const frame_index = current_update_index - starting_update_index + 1
               if (frame_index >= frame_list.length) {
                  clearInterval(interval)
                  on_settings_changed({
                     [KEY_IN_ANIMATION]: false,
                     [KEY_DISABLED]: false
                  })
                  return;
               }
               const frame = frame_list[frame_index]
               on_settings_changed({
                  [KEY_IN_ANIMATION]: true,
                  [KEY_FOCAL_POINT]: frame.focal_point,
                  [KEY_SCOPE]: frame.scope,
                  [KEY_DISABLED]: true
               })
            }
         }, 100)
      }, 1000)
   }

   render() {
      const {path_steps, step_index, in_render} = this.state
      const start_button = <CoolButton
         on_click={this.add_to_path}
         content={path_steps.length ? 'Add to Path' : 'Start Path'}
         disabled={false}
         primary={true}
         style={{marginBottom: '6px'}}
      />
      const render_button = <CoolButton
         on_click={this.render_video}
         content={!in_render ? 'Render Path' : 'Quit Render'}
         disabled={false}
         primary={true}
         style={{marginBottom: '6px', marginLeft: '6px'}}
      />
      const path_steps_data = path_steps.map((step, i) => {
         return {
            step_index: i + 1,
            focal_point_x: step.focal_point.x,
            focal_point_y: step.focal_point.y,
            scope: step.scope,
         }
      })
      const path_steps_table = !path_steps.length ? [] : <CoolTable
         data={path_steps_data}
         columns={PATH_STEPS_COLUMNS}
         options={[TABLE_CAN_SELECT]}
         selected_row={step_index}
         on_select_row={this.select_step}
      />
      return <ContentWrapper>
         {start_button}
         {path_steps.length ? render_button : ''}
         {path_steps_table}
      </ContentWrapper>
   }
}

export default CompTransit;
