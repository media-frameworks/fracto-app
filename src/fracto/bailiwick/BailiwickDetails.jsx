import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {BailiwickStyles as styles} from '../styles/BailiwickStyles'
import {CoolStyles} from 'common/ui/CoolImports';
import FractoUtil from "fracto/FractoUtil";
import {render_coordinates} from "fracto/styles/FractoStyles";

export class BailiwickDetails extends Component {

   static propTypes = {
      selected_bailiwick: PropTypes.object.isRequired,
      highest_level: PropTypes.number.isRequired,
      freeform_index: PropTypes.number.isRequired
   }

   state = {}

   componentDidMount() {
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {selected_bailiwick} = this.props
      if (!prevProps.selected_bailiwick) {
         return
      }
      if (prevProps.selected_bailiwick.id !== selected_bailiwick.id) {
         this.setState({node_index: 0})
      }
   }

   render_magnitude = () => {
      const {selected_bailiwick} = this.props;
      const rounded = Math.round(selected_bailiwick.magnitude * 100000000) / 100
      const mu = <i>{'\u03BC'}</i>
      return <CoolStyles.Block>
         <styles.StatLabel>magnitude:</styles.StatLabel>
         <styles.BigStatValue>{rounded}{mu}</styles.BigStatValue>
         <styles.InlineWrapper>
            <styles.StatValue>{`(${selected_bailiwick.magnitude})`}</styles.StatValue>
         </styles.InlineWrapper>
      </CoolStyles.Block>
   }

   render_core_point = () => {
      const {selected_bailiwick} = this.props;
      const core_point_data = typeof selected_bailiwick.core_point === 'string'
         ? JSON.parse(selected_bailiwick.core_point)
         : selected_bailiwick.core_point
      const core_point = render_coordinates(core_point_data.x, core_point_data.y);
      return <CoolStyles.Block>
         <styles.StatValue>{core_point}</styles.StatValue>
      </CoolStyles.Block>
   }

   render() {
      const {selected_bailiwick} = this.props;
      const bailiwick_name = selected_bailiwick?.name || ''
      const block_color = FractoUtil.fracto_pattern_color(
         selected_bailiwick?.pattern || 0, 1000)
      return [
         <CoolStyles.Block style={{margin: '0.25rem'}}>
            <styles.BigColorBox
               style={{backgroundColor: block_color}}>
               {selected_bailiwick?.pattern || 0}
            </styles.BigColorBox>
            <styles.BailiwickNameBlock>
               <styles.BailiwickNameSpan>{bailiwick_name}</styles.BailiwickNameSpan>
               <styles.StatsWrapper>{this.render_core_point()}</styles.StatsWrapper>
            </styles.BailiwickNameBlock>
         </CoolStyles.Block>,
         <styles.LowerWrapper>
            {this.render_magnitude()}
         </styles.LowerWrapper>
      ]
   }
}

export default BailiwickDetails;
