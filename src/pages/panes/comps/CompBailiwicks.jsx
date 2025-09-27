import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import network from "common/config/network.json" with {type: "json"}

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';
import {
   BAILIWICK_MODE_FREEFORM,
   BAILIWICK_MODE_INLINE,
   BAILIWICK_MODE_NODAL,
   KEY_BAILIWICK_MODE
} from "settings/BailiwickSettings";
import {render_comp_modes} from "./CompUtils";

const AXIOS_CONFIG = {
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

const BAILIWICK_MODES = [
   {key: BAILIWICK_MODE_FREEFORM, label: 'freeform'},
   {key: BAILIWICK_MODE_INLINE, label: 'inline'},
   {key: BAILIWICK_MODE_NODAL, label: 'nodal'},
]

export class CompBailiwicks extends Component {
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

   render_bailiwick_mode = () => {
      const {page_settings, on_settings_changed} = this.props
      const all_modes = render_comp_modes(
         BAILIWICK_MODES, KEY_BAILIWICK_MODE, page_settings, on_settings_changed)
      return <styles.CenteredBlock>
         {all_modes}a
      </styles.CenteredBlock>
   }

   render() {
      const {page_settings} = this.props
      // console.log('all_bailiwicks', all_bailiwicks)
      let content = []
      switch (page_settings[KEY_BAILIWICK_MODE]) {
         case BAILIWICK_MODE_FREEFORM:
            content = [BAILIWICK_MODE_FREEFORM]
            break;
         case BAILIWICK_MODE_INLINE:
            content = [BAILIWICK_MODE_INLINE]
            break;
         case BAILIWICK_MODE_NODAL:
            content = [BAILIWICK_MODE_NODAL]
            break;
         default:
            content = [page_settings[KEY_BAILIWICK_MODE]]
            break
      }
      const modes = this.render_bailiwick_mode()
      return [
         <styles.ContentWrapper>{modes}</styles.ContentWrapper>,
         <styles.ContentWrapper>{content}</styles.ContentWrapper>
      ]
   }
}

export default CompBailiwicks
