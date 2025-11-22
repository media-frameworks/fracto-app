import {Component} from 'react';
import PropTypes from 'prop-types';
import {KEY_CROSSHAIRS_ANGLE, KEY_FIELD_CROSSHAIRS, KEY_HOVER_POINT} from "../../../settings/AppSettings";
import {KEY_FIELDS_PROFILES} from "../../../settings/PaneSettings";
import CoolSlider from "../../../../common/ui/CoolSlider";
import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'

export class FieldsProfiles extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      angle: 0,
      interval: null,
   }

   componentDidMount() {
      const {angle} = this.state
      const {on_settings_changed} = this.props
      on_settings_changed({
         [KEY_FIELD_CROSSHAIRS]: true,
         [KEY_FIELDS_PROFILES]: true,
         [KEY_CROSSHAIRS_ANGLE]: angle,
      })
      const interval = setInterval(() => {
         const {page_settings} = this.props
         if (!page_settings[KEY_HOVER_POINT]) {
            on_settings_changed({[KEY_FIELD_CROSSHAIRS]: true})
         } else if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
            on_settings_changed({[KEY_FIELD_CROSSHAIRS]: true})
         }
      }, 100)
      this.setState({interval})
   }

   componentWillUnmount() {
      const {interval} = this.state
      const {on_settings_changed} = this.props
      on_settings_changed({
         [KEY_FIELDS_PROFILES]: false
      })
      if (interval) {
         clearInterval(interval)
      }
   }

   change_angle = (e) => {
      const {on_settings_changed} = this.props
      this.setState({angle: e.target.value})
      on_settings_changed({
         [KEY_CROSSHAIRS_ANGLE]: e.target.value,
      })
   }

   render_angle_slider = () => {
      const {angle} = this.state
      const slider_ctrl = <CoolSlider
         max={90}
         min={-90}
         value={angle}
         on_change={this.change_angle}
         is_vertical={false}
         step_count={180}
      />
      const prompt = <styles.ProfilesPrompt>
         angle:
      </styles.ProfilesPrompt>
      const slider = <styles.SliderWrapper>
         {slider_ctrl}
      </styles.SliderWrapper>
      const degrees = <styles.ProfilesPrompt>
         {angle}
      </styles.ProfilesPrompt>
      return [prompt, slider, degrees]
   }

   render() {
      const angle_slider = this.render_angle_slider()
      return [angle_slider]
   }
}

export default FieldsProfiles
