import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';
import {KEY_BAILIWICK_DETAIL_DATA} from "../../../../settings/BailiwickSettings";
import {render_pattern_block} from "../../../../fracto/styles/FractoStyles";

export class BailiwicksDetail extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings} = this.props;
      const bailiwick_detail = page_settings[KEY_BAILIWICK_DETAIL_DATA] || {}
      console.log('bailiwick_detail', bailiwick_detail)
      const pattern_block = render_pattern_block(bailiwick_detail.pattern, 36)
      return <styles.BailiwicksSectionSticky>
         {pattern_block}
         <styles.HalfSpacer/>
         <styles.BailiwickNameSpan>
            {bailiwick_detail.name}
         </styles.BailiwickNameSpan>
      </styles.BailiwicksSectionSticky>
   }
}

export default BailiwicksDetail
