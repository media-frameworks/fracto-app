import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompPointsStyles as styles} from 'styles/CompPointsStyles'
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX
} from "settings/PaneSettings";

const HEIGHT_FACTOR = 1.618
const WIDTH_FACTOR = 2.05
const WIDTH_OFFSET_PX = 30
const HEIGHT_OFFSET_PX = 85

export class VertexList extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      width_px: 0,
      height_px: 0,
   }

   componentDidMount() {
      const {page_settings} = this.props
      const width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR) - WIDTH_OFFSET_PX
      const height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR) - HEIGHT_OFFSET_PX
      this.setState({width_px, height_px})
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {page_settings} = this.props
      const new_width_px = Math.round(page_settings[KEY_COMPS_WIDTH_PX] / WIDTH_FACTOR)
         - WIDTH_OFFSET_PX
      const new_height_px = Math.round(page_settings[KEY_COMPS_HEIGHT_PX] / HEIGHT_FACTOR)
         - HEIGHT_OFFSET_PX
      if (prevState.column_width_px !== new_width_px) {
         this.setState({column_width_px: new_width_px})
      }
      if (prevState.column_height_px !== new_height_px) {
         this.setState({column_height_px: new_height_px})
      }
   }

   render() {
      const {width_px, height_px} = this.state
      const content_style = {
         width: `${width_px}px`,
         height: `${height_px}px`,
      }
      return <styles.VertexListContent
         style={content_style}>
         {'VertexList'}
      </styles.VertexListContent>
   }
}

export default VertexList
