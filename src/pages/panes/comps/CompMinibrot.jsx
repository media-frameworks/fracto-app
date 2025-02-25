import {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import network from "common/config/network.json";

import {
   KEY_BAILIWICK_ID,
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX, KEY_DISABLED, KEY_FOCAL_POINT, KEY_SCOPE
} from "../../PageSettings";
import BailiwickList from "fracto/bailiwick/BailiwickList";
import {CompMinibrotStyles as styles} from 'styles/CompMinibrotStyles';

const AXIOS_CONFIG = {
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

export class CompMinibrot extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_bailiwicks: [],
   }

   componentDidMount() {
      this.fetch_bailiwicks()
   }

   fetch_bailiwicks = async () => {
      const url = `${network["fracto-prod"]}/manifest/all_bailiwicks.json`
      const bailiwick_data = await axios.get(url, AXIOS_CONFIG)
      this.setState({all_bailiwicks: bailiwick_data.data})
      console.log('bailiwick_data', bailiwick_data)
   }

   on_select = (item) => {
      const {page_settings, on_settings_changed} = this.props
      if (page_settings[KEY_DISABLED]) {
         return;
      }
      const new_settings = {}
      page_settings[KEY_BAILIWICK_ID] = item.id
      const display_settings = JSON.parse(item.display_settings)
      new_settings[KEY_FOCAL_POINT] = display_settings.focal_point
      new_settings[KEY_SCOPE] = display_settings.scope
      new_settings[KEY_DISABLED] = true
      on_settings_changed(new_settings)
   }

   render() {
      const {all_bailiwicks} = this.state
      const {page_settings} = this.props
      const {bailiwick_id, disabled} = page_settings
      // console.log('all_bailiwicks', all_bailiwicks)
      const list_style = {
         height: `${page_settings[KEY_COMPS_HEIGHT_PX] - 60}px`,
         width: `${page_settings[KEY_COMPS_WIDTH_PX] - 5}px`,
         marginTop: '20px',
         cursor: disabled ? 'wait' : 'pointer'
      }
      return <styles.ContentWrapper
         style={list_style}>
         <BailiwickList
            bailiwick_list={all_bailiwicks.sort((a, b) => b.magnitude - a.magnitude)}
            selected_id={bailiwick_id}
            on_select={this.on_select}
            in_wait={page_settings[KEY_DISABLED]}
         />
      </styles.ContentWrapper>
   }
}

export default CompMinibrot
