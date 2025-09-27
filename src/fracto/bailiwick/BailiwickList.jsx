import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CoolColors, CoolStyles} from "common/ui/CoolImports";

import {render_big_pattern_block} from "../styles/FractoStyles";
import BailiwickDetails from "./BailiwickDetails";
import {BailiwickStyles as styles} from '../styles/BailiwickStyles'

const numberToOrdinal = (n) => {
   const s = ['th', 'st', 'nd', 'rd'];
   const v = n % 100;
   return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export class BailiwickList extends Component {
   static propTypes = {
      width_px: PropTypes.number.isRequired,
      bailiwick_list: PropTypes.array.isRequired,
      selected_id: PropTypes.number.isRequired,
      on_select: PropTypes.func.isRequired,
      in_wait: PropTypes.bool.isRequired,
   }

   state = {
      scroll_ref: React.createRef()
   };

   select_bailiwick = (item, i) => {
      const {on_select, in_wait} = this.props
      if (!item || in_wait) {
         console.log('select_bailiwick: !item || in_wait')
         return;
      }
      // localStorage.setItem('selected_bailiwick', String(i))
      let item_copy = JSON.parse(JSON.stringify(item))
      on_select(item_copy, i)
   }

   static render_magnitude = (magnitude) => {
      const rounded = Math.round(magnitude * 100000000) / 100
      const mu = <i>{'\u03BC'}</i>
      return <CoolStyles.Block>
         <styles.InlineWrapper>
            <styles.StatValue
               style={{verticalAlign: 'middle'}}> {rounded}</styles.StatValue>
            <styles.MuStyle>{mu}</styles.MuStyle>
         </styles.InlineWrapper>
      </CoolStyles.Block>
   }

   render_image_block = (item) => {
      const wrapper_style = {
         backgroundImage: `url('/bailiwicks/${item.thumbnail_name}')`,
      }
      return <styles.ThumbnailWrapper style={wrapper_style}>
         <styles.PatternNumber>{item.pattern}</styles.PatternNumber>
      </styles.ThumbnailWrapper>
   }

   render() {
      const {scroll_ref} = this.state
      const {bailiwick_list, selected_id, in_wait, on_select, width_px} = this.props
      console.log('bailiwick_list',bailiwick_list)
      return bailiwick_list
         .map((item, i) => {
            const pattern_block = render_big_pattern_block(item.pattern)
            const selected = selected_id === item.id
            const row_style = !selected ? {} : {
               border: `0.1rem solid ${CoolColors.deep_blue}`,
               borderRadius: `0.125rem`,
               backgroundColor: "#cccccc",
               color: "white",
               cursor: in_wait ? "wait" : "default",
               width: selected ? `${(width_px - 25)}px` : `${(width_px - 25) / 2}px`
            }
            const highest_level = Math.round(100 * (Math.log(32 / item.magnitude) / Math.log(2))) / 100
            const size = BailiwickList.render_magnitude(item.magnitude)
            const block_render = item.thumbnail_name && item.thumbnail_name.indexOf('.png') > 0
               ? this.render_image_block(item) : pattern_block
            const row_content = selected
               ? <CoolStyles.Block style={{padding: '0.5rem'}}>
                  <BailiwickDetails
                     width_px={width_px - 35}
                     freeform_index={item.free_ordinal}
                     highest_level={highest_level}
                     on_close={() => on_select(null)}
                     selected_bailiwick={item}
                  />
               </CoolStyles.Block>
               : <styles.MiniBlock>
                  <styles.BlockWrapper key={`pattern_${i}`}>{block_render}</styles.BlockWrapper>
                  <styles.SizeWrapper key={`size_${i}`}>{size}</styles.SizeWrapper>
                  <styles.UpdatedWrapper key={`type_${i}`}>
                     {`${numberToOrdinal(i + 1)} of ${bailiwick_list.length}`}
                  </styles.UpdatedWrapper>
               </styles.MiniBlock>
            return <styles.RowWrapper
               ref={selected ? scroll_ref : null}
               onClick={e => this.select_bailiwick(item, i)}
               style={row_style}>
               {row_content}
            </styles.RowWrapper>
         })
   }

}

export default BailiwickList;
