import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {CoolStyles} from 'common/ui/CoolImports';
import FractoUtil from "../FractoUtil";
import {render_coordinates} from "../styles/FractoStyles";
import BailiwickData from "./BailiwickData";

const BailiwickNameBlock = styled(CoolStyles.InlineBlock)`
    margin-bottom: 0.25rem;
`;

const BailiwickNameSpan = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.bold}
    ${CoolStyles.monospace}
    ${CoolStyles.narrow_text_shadow}
    font-size: 1.5rem;
`;

const BigColorBox = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.narrow_border_radius}
    ${CoolStyles.narrow_text_shadow}
    ${CoolStyles.monospace}
    ${CoolStyles.bold}
    padding: 0 0.125rem;
    border: 0.1rem solid #555555;
    color: white;
    margin-right: 0.5rem;
    font-size: 1.5rem;
`;

const StatsWrapper = styled(CoolStyles.Block)`
    ${CoolStyles.bold}
    ${CoolStyles.italic}
    font-size: 0.85rem;
    color: #444444;
`;

const StatLabel = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.bold}
    font-size: 0.95rem;
    color: #444444;
    margin-right: 0.25rem;
`;

const StatValue = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.monospace}
    ${CoolStyles.bold}
    font-size: 0.95rem;
    color: black;
`;

const InlineWrapper = styled(CoolStyles.InlineBlock)`
    margin-left: 0.25rem;
`;

const LowerWrapper = styled(CoolStyles.Block)`
    margin: 0 1rem 0.125rem 1rem;
`;

export class BailiwickDetails extends Component {

   static propTypes = {
      selected_bailiwick: PropTypes.object.isRequired,
      highest_level: PropTypes.number.isRequired,
      freeform_index: PropTypes.number.isRequired
   }

   state = {
   }

   componentDidMount() {
      BailiwickData.fetch_node_points(node_points => {
         this.setState({all_node_points: node_points})
      })
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
         <StatLabel>magnitude:</StatLabel>
         <StatValue>{selected_bailiwick.magnitude}</StatValue>
         <InlineWrapper>(<StatValue>{rounded}</StatValue>{mu})</InlineWrapper>
      </CoolStyles.Block>
   }

   render_cq_code = () => {
      const {selected_bailiwick} = this.props;
      const core_point_data = JSON.parse(selected_bailiwick.core_point)
      const cq_code = FractoUtil.CQ_code_from_point(core_point_data.x, core_point_data.y)
      return <CoolStyles.Block>
         <StatLabel>CQ code:</StatLabel>
         <StatValue>{cq_code.slice(0, 25)}</StatValue>
      </CoolStyles.Block>
   }

   render_core_point = () => {
      const {selected_bailiwick} = this.props;
      const core_point_data = JSON.parse(selected_bailiwick.core_point)
      const core_point = render_coordinates(core_point_data.x, core_point_data.y);
      return <CoolStyles.Block>
         <StatLabel>core point:</StatLabel>
         <StatValue>{core_point}</StatValue>
      </CoolStyles.Block>
   }

   on_select_row = (index) => {
      console.log("on_select_row", index)
      this.setState({node_index: index})
   }

   render() {
      const {selected_bailiwick, highest_level, freeform_index} = this.props;
      const bailiwick_name = selected_bailiwick.name
      const block_color = FractoUtil.fracto_pattern_color(selected_bailiwick.pattern, 1000)
      const stats = [`best level: ${highest_level}`, `freeform index: ${freeform_index + 1}`].join(', ')
      return [
         <CoolStyles.Block>
            <BigColorBox
               style={{backgroundColor: block_color}}>
               {selected_bailiwick.pattern}
            </BigColorBox>
            <BailiwickNameBlock>
               <BailiwickNameSpan>{bailiwick_name}</BailiwickNameSpan>
               <StatsWrapper>{stats}</StatsWrapper>
            </BailiwickNameBlock>
         </CoolStyles.Block>,
         <LowerWrapper>
            {this.render_magnitude()}
            {this.render_cq_code()}
            {this.render_core_point()}
         </LowerWrapper>
      ]
   }
}

export default BailiwickDetails;
