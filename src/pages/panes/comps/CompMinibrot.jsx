import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import network from "common/config/network.json";

import {
   KEY_MINIBROT_SORT_TYPE,
   KEY_BAILIWICK_ID,
} from "settings/CompSettings";
import {
   KEY_COMPS_HEIGHT_PX,
   KEY_COMPS_WIDTH_PX,
} from "settings/PaneSettings";
import {
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_SCOPE,
} from 'settings/AppSettings'
import BailiwickList from "fracto/bailiwick/BailiwickList";
import {CompMinibrotStyles as styles} from 'styles/CompMinibrotStyles';
import {render_big_pattern_block} from "fracto/styles/FractoStyles";

const AXIOS_CONFIG = {
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

export const SORT_TYPE_BY_ORBITAL = 'sort_type_by_orbital'
export const SORT_TYPE_BY_SIZE = 'sort_type_by_size'

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
      const new_settings = {}
      if (!item) {
         console.log('closing details now')
         new_settings[KEY_BAILIWICK_ID] = -1
      } else {
         if (page_settings[KEY_DISABLED]) {
            return;
         }
         page_settings[KEY_BAILIWICK_ID] = item.id
         const display_settings = JSON.parse(item.display_settings)
         new_settings[KEY_FOCAL_POINT] = display_settings.focal_point
         new_settings[KEY_SCOPE] = display_settings.scope
         new_settings[KEY_DISABLED] = true
      }
      setTimeout(() => {
         on_settings_changed(new_settings)
      }, 250)
   }

   set_sort_type = (sort_type) => {
      const {on_settings_changed} = this.props
      let new_settings = {}
      new_settings[KEY_MINIBROT_SORT_TYPE] = sort_type
      new_settings[KEY_BAILIWICK_ID] = -1
      on_settings_changed(new_settings)
   }

   render_sorting_row = () => {
      const {page_settings} = this.props
      const sort_type = page_settings[KEY_MINIBROT_SORT_TYPE] || SORT_TYPE_BY_ORBITAL
      const unlit_style = {color: '#aaaaaa', fontWeight: 400}
      return <styles.CenteredBlock>
         <input
            type={"radio"}
            checked={sort_type === SORT_TYPE_BY_SIZE}
            onClick={() => this.set_sort_type(SORT_TYPE_BY_SIZE)}
         />
         <styles.SortTypePrompt
            style={sort_type === SORT_TYPE_BY_ORBITAL ? unlit_style : {}}
            onClick={() => this.set_sort_type(SORT_TYPE_BY_SIZE)}
         >{'order by size'}
         </styles.SortTypePrompt>
         <styles.Spacer/>
         <input
            type={"radio"}
            checked={sort_type === SORT_TYPE_BY_ORBITAL}
            onClick={() => this.set_sort_type(SORT_TYPE_BY_ORBITAL)}
         />
         <styles.SortTypePrompt
            style={sort_type === SORT_TYPE_BY_SIZE ? unlit_style : {}}
            onClick={() => this.set_sort_type(SORT_TYPE_BY_ORBITAL)}
         >
            {'by cardinality'}
         </styles.SortTypePrompt>
      </styles.CenteredBlock>
   }

   render_size_list = (bailiwick_list) => {
      const {page_settings} = this.props
      return <BailiwickList
         width_px={page_settings[KEY_COMPS_WIDTH_PX]}
         bailiwick_list={bailiwick_list.sort((a, b) => b.magnitude - a.magnitude)}
         selected_id={page_settings[KEY_BAILIWICK_ID]}
         on_select={this.on_select}
         in_wait={page_settings[KEY_DISABLED]}
      />
   }

   render_orbitals_list = (bailiwick_list) => {
      const {page_settings} = this.props
      const orbital_bins = []
      bailiwick_list
         .filter(item => !item.is_inline)
         .forEach(item => {
            let bin = orbital_bins.find(bin => bin.pattern === item.pattern)
            if (!bin) {
               bin = {
                  pattern: item.pattern,
                  minibrots: []
               }
               orbital_bins.push(bin)
            }
            bin.minibrots.push(item)
         })
      console.log('orbital_bins', orbital_bins)
      const pattern_block_width_px = 60
      const list_width_px = page_settings[KEY_COMPS_WIDTH_PX] - pattern_block_width_px - 45
      return orbital_bins
         .sort((a, b) => a.pattern - b.pattern)
         .map(bin => {
            return <styles.PatternWrapper>
               <styles.PatternBlockWrapper style={{width: `${pattern_block_width_px}px`}}>
                  {render_big_pattern_block(bin.pattern)}
               </styles.PatternBlockWrapper>
               <styles.PatternBailiwicksWrapper style={{width: `${list_width_px}px`}}>
                  <BailiwickList
                     width_px={list_width_px}
                     bailiwick_list={bin.minibrots.sort((a, b) => b.magnitude - a.magnitude)}
                     selected_id={page_settings[KEY_BAILIWICK_ID]}
                     on_select={this.on_select}
                     in_wait={page_settings[KEY_DISABLED]}
                  />
               </styles.PatternBailiwicksWrapper>
            </styles.PatternWrapper>
         })
   }

   render() {
      const {all_bailiwicks} = this.state
      const {page_settings} = this.props
      const list_style = {
         height: `${page_settings[KEY_COMPS_HEIGHT_PX] - 60}px`,
         width: `${page_settings[KEY_COMPS_WIDTH_PX] - 25}px`,
         marginTop: '10px',
         cursor: page_settings[KEY_DISABLED] ? 'wait' : 'default'
      }
      const listing = page_settings[KEY_MINIBROT_SORT_TYPE] === SORT_TYPE_BY_SIZE
         ? this.render_size_list(all_bailiwicks)
         : this.render_orbitals_list(all_bailiwicks)
      return <styles.ContentWrapper
         style={list_style}>
         {this.render_sorting_row()}
         {listing}
      </styles.ContentWrapper>
   }
}

export default CompMinibrot
