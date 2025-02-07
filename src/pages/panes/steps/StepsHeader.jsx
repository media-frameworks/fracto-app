import {Component} from 'react';
import PropTypes from 'prop-types';

import {
   KEY_COMPS_HEIGHT_PX, KEY_COMPS_WIDTH_PX,
   KEY_FIELD_WIDTH_PX, KEY_LEGEND_WIDTH_PX,
   KEY_STEPS_HEIGHT_PX,
   KEY_STEPS_WIDTH_PX, KEY_STEPS_ZOOM
} from "../../PageSettings";
import {CoolSlider, CoolStyles} from "../../../common/ui/CoolImports";
import styled from "styled-components";

const MARGIN_PX = 10;
const HeaderZoomWrapper = styled(CoolStyles.Block)`
    position: fixed;
    top: 20px;
    padding: 0 ${MARGIN_PX}px;
    color: black !important;
`
const LS_STEPS_ZOOM_VALUE = 'LS_STEPS_ZOOM_VALUE'

export class StepsHeader extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      zoom_value: 2.5
   }

   componentDidMount() {
      const zoom_value_str = localStorage.getItem(LS_STEPS_ZOOM_VALUE);
      if (zoom_value_str) {
         this.setState({zoom_value: parseFloat});
      }
   }

   set_value = (e) => {
      const {on_settings_changed} = this.props
      const zoom_value = e.target.value
      this.setState({zoom_value})
      localStorage.setItem(LS_STEPS_ZOOM_VALUE, `${zoom_value}`);
      let new_setings = {}
      new_setings[KEY_STEPS_ZOOM] = zoom_value
      on_settings_changed(new_setings)
   }

   render() {
      const {zoom_value} = this.state
      const {page_settings} = this.props
      const extraStyle = {
         width: `${page_settings[KEY_STEPS_WIDTH_PX] - 2 * MARGIN_PX}px`
      }
      return <HeaderZoomWrapper
         style={extraStyle}
         title={'scale factor'}
      >
         <CoolSlider
            value={zoom_value}
            min={1.25}
            max={5}
            is_vertical={false}
            on_change={this.set_value}
         />
      </HeaderZoomWrapper>
   }
}

export default StepsHeader
