import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';
import {KEY_BAILIWICK_DETAIL_DATA} from "pages/settings/BailiwickSettings";
import {render_pattern_block} from "fracto/styles/FractoStyles";
import CoolStyles from "common/ui/styles/CoolStyles";
import {render_size} from "./BailiwickUtils";

export class BailiwicksDetail extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render_header = () => {
      const {page_settings} = this.props;
      const bailiwick_detail = page_settings[KEY_BAILIWICK_DETAIL_DATA] || {}
      console.log('bailiwick_detail', bailiwick_detail)
      const pattern_block = render_pattern_block(bailiwick_detail.pattern, 36)
      return <styles.DetailsHeaderWrapper>
         {pattern_block}
         <styles.HalfSpacer/>
         <CoolStyles.InlineBlock>
            <styles.BailiwickNameSpan>{bailiwick_detail.name}</styles.BailiwickNameSpan>
            <styles.DataPrompt>magnitude:</styles.DataPrompt>
            {render_size(bailiwick_detail.magnitude)}
         </CoolStyles.InlineBlock>
      </styles.DetailsHeaderWrapper>
   }

   render() {
      const header = this.render_header()
      return <styles.BailiwicksSectionSticky>
         {header}
      </styles.BailiwicksSectionSticky>
   }
}

export default BailiwicksDetail
