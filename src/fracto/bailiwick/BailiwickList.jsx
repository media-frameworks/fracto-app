import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CoolColors, CoolStyles} from "common/ui/CoolImports";

import {render_big_pattern_block} from "../styles/FractoStyles";
import BailiwickDetails from "./BailiwickDetails";
import {BailiwickStyles as styles} from '../styles/BailiwickStyles'

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
         return;
      }
      localStorage.setItem('selected_bailiwick', String(i))
      let item_copy = JSON.parse(JSON.stringify(item))
      on_select(item_copy, i)
   }

   render_magnitude = (item) => {
      const rounded = Math.round(item.magnitude * 100000000) / 100
      const mu = <i>{'\u03BC'}</i>
      return <CoolStyles.Block>
         <styles.InlineWrapper>
            <styles.StatValue
               style={{verticalAlign: 'middle'}}> {rounded}</styles.StatValue>
            <styles.MuStyle>{mu}</styles.MuStyle>
         </styles.InlineWrapper>
      </CoolStyles.Block>
   }

   render() {
      const {scroll_ref} = this.state
      const {bailiwick_list, selected_id, in_wait, on_select, width_px} = this.props
      return bailiwick_list
         .map((item, i) => {
            const pattern_block = render_big_pattern_block(item.pattern)
            const selected = selected_id === item.id
            const row_style = !selected ? {} : {
               border: `0.1rem solid ${CoolColors.deep_blue}`,
               borderRadius: `0.25rem`,
               backgroundColor: "#cccccc",
               color: "white",
               cursor: in_wait ? "wait" : "pointer",
               width: selected ? `${(width_px - 25)}px` : `${(width_px - 25) / 2}px`
            }
            const highest_level = Math.round(100 * (Math.log(32 / item.magnitude) / Math.log(2))) / 100
            const size = this.render_magnitude(item)
            const row_content = selected
               ? <CoolStyles.Block>a
                  <BailiwickDetails
                     freeform_index={item.free_ordinal}
                     highest_level={highest_level}
                     on_close={() => on_select(null)}
                     selected_bailiwick={item}
                  />
               </CoolStyles.Block>
               :<styles.MiniBlock>
                  <styles.BlockWrapper key={`pattern_${i}`}>{pattern_block}</styles.BlockWrapper>
                  <styles.SizeWrapper key={`size_${i}`}>{size}</styles.SizeWrapper>
                  <styles.UpdatedWrapper key={`index_${i}`}>{`#${i + 1} in size`}</styles.UpdatedWrapper>
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
