import {Component} from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';

import {CoolSlider, CoolStyles} from "common/ui/CoolImports";
import {KEY_STEPS_ZOOM} from "pages/settings/AppSettings";
import {KEY_STEPS_WIDTH_PX} from 'pages/settings/PaneSettings'

const MARGIN_PX = 10;
const HeaderZoomWrapper = styled(CoolStyles.Block)`
    position: fixed;
    top: 20px;
    padding: 0 ${MARGIN_PX}px;
    color: black !important;
`
const LS_STEPS_ZOOM_VALUE = 'LS_STEPS_ZOOM_VALUE'
const STEPS_ZOOM_DEFAULT = 2.0

export class StepsHeader extends Component {

   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      zoom_value: STEPS_ZOOM_DEFAULT
   }

   componentDidMount() {
      const {on_settings_changed} = this.props
      let zoom_value = STEPS_ZOOM_DEFAULT
      const zoom_value_str = localStorage.getItem(LS_STEPS_ZOOM_VALUE);
      if (zoom_value_str) {
         zoom_value = parseFloat(zoom_value_str);
      }
      on_settings_changed({[KEY_STEPS_ZOOM]: zoom_value})
   }

   set_value = (e) => {
      const {on_settings_changed} = this.props
      const zoom_value = e.target.value
      this.setState({zoom_value})
      localStorage.setItem(LS_STEPS_ZOOM_VALUE, `${zoom_value}`);
      on_settings_changed({[KEY_STEPS_ZOOM]: zoom_value})
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
