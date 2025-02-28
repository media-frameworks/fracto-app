import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CoolSplitter, {SPLITTER_TYPE_VERTICAL} from "common/ui/CoolSplitter";

import AppHeaderBar from 'app/AppHeaderBar';
import {
   PageAppStyles as styles,
   MAX_SPLITTER_PX, SPLITTER_WIDTH_PX
} from '../styles/PageAppStyles'

const DEFAULT_SPLITTER_POSITION = 800

export class AppPageMain extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
      on_resize: PropTypes.func.isRequired,
      content_left: PropTypes.array.isRequired,
      content_right: PropTypes.array.isRequired,
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      wrapper_ref: React.createRef(),
      content_bounds: {},
      splitter_position: MAX_SPLITTER_PX,
   };

   componentDidMount() {
      const {app_name} = this.props;
      window.addEventListener("resize", this.resize_wrapper);
      const position_key = `${app_name}_splitter_position`;
      const position_str = localStorage.getItem(position_key);
      let splitter_position = DEFAULT_SPLITTER_POSITION
      if (position_str) {
         splitter_position = parseInt(position_str, 10)
      }
      this.resize_wrapper(null, splitter_position);
   }

   componentWillUnmount() {
      window.removeEventListener("resize", this.resize_wrapper);
   }

   resize_wrapper = (e, splitter_position = 0) => {
      const {wrapper_ref} = this.state;
      const wrapper = wrapper_ref.current;
      if (wrapper) {
         const content_bounds = wrapper.getBoundingClientRect();
         this.setState({
            content_bounds: content_bounds,
         });
      }
      this.resize_panes(splitter_position ? splitter_position : this.state.splitter_position)
   }

   resize_panes = (new_splitter_position, from_callback = false) => {
      const {wrapper_ref} = this.state;
      const {app_name, on_resize} = this.props;
      const wrapper = wrapper_ref.current;
      if (wrapper) {
         const content_bounds = wrapper.getBoundingClientRect();
         const right_side_width = content_bounds.width - new_splitter_position - SPLITTER_WIDTH_PX + 2;
         const left_side_width = new_splitter_position;
         on_resize(left_side_width, right_side_width, content_bounds.height)
         this.setState({
            splitter_position: new_splitter_position,
            right_side_width: right_side_width,
            left_side_width: left_side_width,
         })
      }
      if (from_callback) {
         const position_key = `${app_name}_splitter_position`;
         const position_value = `${new_splitter_position}`;
         localStorage.setItem(position_key, position_value)
      }
   }

   render() {
      const {wrapper_ref, content_bounds, splitter_position, left_side_width, right_side_width} = this.state
      const {app_name, content_left, content_right} = this.props;
      return <styles.PageWrapper ref={wrapper_ref}>
         <AppHeaderBar app_name={app_name}/>
         <styles.ContentWrapper>
            <styles.LeftSideWrapper style={{width: `${left_side_width}px`}}>
               {content_left}
            </styles.LeftSideWrapper>
            <CoolSplitter
               type={SPLITTER_TYPE_VERTICAL}
               name={`${app_name}-splitter`}
               bar_width_px={SPLITTER_WIDTH_PX}
               container_bounds={content_bounds}
               position={splitter_position}
               on_change={pos => this.resize_panes(pos, true)}
            />
            <styles.RightSideWrapper style={{width: `${right_side_width}px`}}>
               {content_right}
            </styles.RightSideWrapper>
         </styles.ContentWrapper>
      </styles.PageWrapper>
   }
}

export default AppPageMain;
