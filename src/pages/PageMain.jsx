import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AppPageMain from 'app/AppPageMain';
import {PageMainStyles as styles} from '../styles/PageMainStyles'
import CoolSplitter, {
   SPLITTER_TYPE_HORIZONTAL, SPLITTER_TYPE_VERTICAL
} from "../common/ui/CoolSplitter";
import {SPLITTER_WIDTH_PX} from "../styles/PageAppStyles";

import PaneSteps from "../panes/PaneSteps";
import PaneField from "../panes/PaneField";
import PaneLegend from "../panes/PaneLegend";
import PaneComps from "../panes/PaneComps";

const LS_LEFT_PANE_POSITION = 'ls_left_pane_position'
const LS_UPPER_PANE_POSITION = 'ls_upper_pane_position'

export class PageMain extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
   }

   state = {
      left_width_px: 0,
      right_width_px: 0,
      height_px: 0,
      left_pane_ref: React.createRef(),
      left_pane_position: 200,
      during_left_pane_drag: false,
      upper_pane_ref: React.createRef(),
      upper_pane_position: 200,
      during_upper_pane_drag: false,
   };

   componentDidMount() {
      const {left_pane_ref} = this.state
      console.log('page ready')
      setTimeout(() => {
         const bounds = left_pane_ref.current.getBoundingClientRect()
         this.setState({height_px: bounds.height})
      }, 100)

      const left_pane_position_str = localStorage.getItem(LS_LEFT_PANE_POSITION);
      let left_pane_position = 500
      if (left_pane_position_str) {
         left_pane_position = parseInt(left_pane_position_str)
      }
      const upper_pane_position_str = localStorage.getItem(LS_UPPER_PANE_POSITION);
      let upper_pane_position = 500
      if (upper_pane_position_str) {
         upper_pane_position = parseInt(upper_pane_position_str)
      }
      this.setState({left_pane_position, upper_pane_position})
   }

   on_resize = (left_width_px, right_width_px, height_px) => {
      console.log("on_resize", left_width_px, right_width_px, height_px)
      this.setState({
         left_width_px: Math.round(left_width_px),
         right_width_px: Math.round(right_width_px),
         height_px: Math.round(height_px),
      })
   }

   change_left_pane_position = (new_position) => {
      this.setState({left_pane_position: new_position})
      localStorage.setItem(LS_LEFT_PANE_POSITION, `${new_position}`)
   }

   change_upper_pane_position = (new_position) => {
      this.setState({upper_pane_position: new_position})
      localStorage.setItem(LS_UPPER_PANE_POSITION, `${new_position}`)
   }

   render_upper_panes = (width_px, height_px) => {
      const {upper_pane_ref, upper_pane_position} = this.state
      let bounds = {width: 1, height: 1}
      if (upper_pane_ref.current) {
         const boundsData = upper_pane_ref.current.getBoundingClientRect()
         bounds.top = 0
         bounds.height = boundsData.height
      }
      const left_part_style = {
         height: `${height_px}px`,
         width: `${upper_pane_position}px`,
         backgroundColor: '#e7e7e7',
      }
      const right_part_style = {
         height: `${height_px}px`,
         width: `${width_px - upper_pane_position}px`,
         backgroundColor: '#ffffff',
      }
      const upper_pane_content = [
         <styles.UpperPaneWrapper style={left_part_style} key={'upper-left-pane'}>
            <PaneSteps
               width_px={upper_pane_position}
               height_px={height_px}
            />
         </styles.UpperPaneWrapper>,
         <CoolSplitter
            key={'upper-pane-splitter-bar'}
            style={{top: 0}}
            type={SPLITTER_TYPE_VERTICAL}
            name={'vertical=upper-pane'}
            bar_width_px={SPLITTER_WIDTH_PX}
            container_bounds={bounds}
            position={upper_pane_position}
            on_change={this.change_upper_pane_position}
         />,
         <styles.UpperPaneWrapper style={right_part_style} key={'upper-right-pane'}>
            <PaneField
               width_px={width_px - upper_pane_position}
               height_px={height_px}
            />
         </styles.UpperPaneWrapper>,
      ]
      const pane_style = {width: `${width_px}px`, height: `${height_px}px`}
      return <styles.LeftPaneWrapper style={pane_style} ref={upper_pane_ref}>
         {upper_pane_content}
      </styles.LeftPaneWrapper>
   }

   render_left_panes = (left_width_px, height_px) => {
      const {left_pane_ref, left_pane_position} = this.state
      let bounds = {width: 1, height: 1}
      if (left_pane_ref.current) {
         bounds = left_pane_ref.current.getBoundingClientRect()
      }
      const upper_part_style = {
         height: `${left_pane_position - 1}px`,
         marginBottom: '3px',
      }
      const lower_part_style = {
         height: `${height_px - left_pane_position - 20}px`,
         backgroundColor: '#eeeeee',
      }
      const left_pane_content = [
         <styles.PanelWrapper style={upper_part_style} key={'upper-part'}>
            {this.render_upper_panes(left_width_px, left_pane_position)}
         </styles.PanelWrapper>,
         <CoolSplitter
            key={'lower-pane-splitter-bar'}
            type={SPLITTER_TYPE_HORIZONTAL}
            name={'horizontal-left-pane'}
            bar_width_px={SPLITTER_WIDTH_PX}
            container_bounds={bounds}
            position={left_pane_position}
            on_change={this.change_left_pane_position}/>,
         <styles.PanelWrapper style={lower_part_style} key={'lower-part'}>
            <PaneLegend
               width_px={left_width_px}
               height_px={height_px - left_pane_position - 20}
            />
         </styles.PanelWrapper>,
      ]
      const pane_style = {width: `${left_width_px}px`, height: `${height_px}px`}
      return <styles.LeftPaneWrapper style={pane_style} ref={left_pane_ref}>
         {left_pane_content}
      </styles.LeftPaneWrapper>
   }

   render_right_pane = (right_width_px, height_px) => {
      const right_part_style = {
         height: `${height_px}px`,
         width: `${right_width_px}px`,
         backgroundColor: '#f8f8f8',
      }
      return <styles.PanelWrapper style={right_part_style} key={'right-part'}>
         <PaneComps
            width_px={right_width_px}
            height_px={height_px}
         />
      </styles.PanelWrapper>
   }

   render() {
      const {app_name} = this.props
      const {left_width_px, right_width_px, height_px} = this.state
      return <AppPageMain
         app_name={app_name}
         on_resize={this.on_resize}
         content_left={this.render_left_panes(left_width_px, height_px)}
         content_right={this.render_right_pane(right_width_px, height_px)}
      />
   }
}

export default PageMain;
