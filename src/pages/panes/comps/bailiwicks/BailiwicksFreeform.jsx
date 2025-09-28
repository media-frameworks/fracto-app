import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoePrints} from "@fortawesome/free-solid-svg-icons";

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';
import CoolTable, {TABLE_CAN_SELECT} from "common/ui/CoolTable";
import {
   compare_bailiwicks,
   fetch_bailiwicks,
   render_pattern,
   render_size,
   render_time_ago
} from "./BailiwickUtils";
import {
   BAILIWICK_MODE_FREEFORM,
   BAILIWICK_ORDERING_ASCENDING,
   BAILIWICK_ORDERING_DESCENDING,
   BAILIWICK_TABLE_COLUMNS,
   COLUMN_ID_MODIFIED,
   COLUMN_ID_NAME,
   COLUMN_ID_PATTERN,
   COLUMN_ID_SIZE, KEY_BAILIWICK_DETAIL_DATA,
   KEY_BAILIWICK_FREEFORM_ORDERING,
   KEY_BAILIWICK_FREEFORM_ORDERING_DIRECTION
} from "settings/BailiwickSettings";
import {
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "settings/AppSettings";
import BailiwicksDetail from "./BailiwicksDetail";

export class BailiwicksFreeform extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      free_bailiwicks: [],
      bailiwick_index: 0,
   }

   componentDidMount() {
      this.fetch_bailiwicks();
   }

   fetch_bailiwicks = async () => {
      const free_bailiwicks = await fetch_bailiwicks(BAILIWICK_MODE_FREEFORM)
      const sorted = free_bailiwicks.sort(this.compare_bailiwicks)
      this.setState({free_bailiwicks: sorted})
   }

   go_to_there = (fracto_values) => {
      const {on_settings_changed} = this.props;
      on_settings_changed({
         [KEY_FOCAL_POINT]: fracto_values.focal_point,
         [KEY_SCOPE]: fracto_values.scope,
         [KEY_DISABLED]: true
      })
   }

   render_go_to_there = (fracto_values) => {
      const icon_style = {color: '#666666'};
      return <styles.LinkSpan
         style={icon_style}
         title={'go to there'}
         onClick={e => this.go_to_there(fracto_values)}>
         <FontAwesomeIcon icon={faShoePrints}/>
      </styles.LinkSpan>
   }

   select_bailiwick = (bailiwick_index) => {
      const {free_bailiwicks} = this.state
      const {on_settings_changed} = this.props
      this.setState({bailiwick_index})
      on_settings_changed({
         [KEY_BAILIWICK_DETAIL_DATA]: free_bailiwicks.at(bailiwick_index)
      })
   }

   on_click_column = (column_id) => {
      const {free_bailiwicks} = this.state
      const {page_settings, on_settings_changed} = this.props
      const sort_column_id = page_settings[KEY_BAILIWICK_FREEFORM_ORDERING]
      let sort_orderong_direction = page_settings[KEY_BAILIWICK_FREEFORM_ORDERING_DIRECTION]
      if (column_id === sort_column_id) {
         sort_orderong_direction =
            sort_orderong_direction === BAILIWICK_ORDERING_ASCENDING
               ? BAILIWICK_ORDERING_DESCENDING
               : BAILIWICK_ORDERING_ASCENDING
      }
      on_settings_changed({
         [KEY_BAILIWICK_FREEFORM_ORDERING]: column_id,
         [KEY_BAILIWICK_FREEFORM_ORDERING_DIRECTION]: sort_orderong_direction
      })
      setTimeout(() => {
         const sorted = free_bailiwicks.sort(this.compare_bailiwicks)
         this.setState({
            free_bailiwicks: sorted,
            bailiwick_index: 0,
         })
         on_settings_changed({
            [KEY_BAILIWICK_DETAIL_DATA]: sorted.at(0)
         })
      }, 100)
   }

   compare_bailiwicks = (a, b) => {
      const {page_settings} = this.props
      const sort_column_id = page_settings[KEY_BAILIWICK_FREEFORM_ORDERING]
      const sort_orderong_direction = page_settings[KEY_BAILIWICK_FREEFORM_ORDERING_DIRECTION]
      return compare_bailiwicks(
         a, b, sort_column_id, sort_orderong_direction === BAILIWICK_ORDERING_ASCENDING)
   }

   render() {
      const {free_bailiwicks, bailiwick_index} = this.state
      const {page_settings, on_settings_changed} = this.props
      const table_data = free_bailiwicks
         .map((bailiwick) => {
            const display_settings = JSON.parse(bailiwick.display_settings)
            const {scope, focal_point} = display_settings
            return {
               [COLUMN_ID_PATTERN]: [render_pattern, bailiwick.pattern],
               [COLUMN_ID_NAME]: <styles.NameSpan>{bailiwick.name}</styles.NameSpan>,
               [COLUMN_ID_SIZE]: [render_size, bailiwick.magnitude],
               [COLUMN_ID_MODIFIED]: [render_time_ago, bailiwick.updated_at],
               go: [this.render_go_to_there, {scope, focal_point}],
            }
         })
      const bailiwick_table = <styles.BailiwicksSection>
         <CoolTable
            data={table_data}
            columns={BAILIWICK_TABLE_COLUMNS}
            options={[TABLE_CAN_SELECT]}
            selected_row={bailiwick_index}
            on_select_row={this.select_bailiwick}
            on_click_column={this.on_click_column}
         />
      </styles.BailiwicksSection>
      const bailiwicks_detail = <BailiwicksDetail
         page_settings={page_settings}
         on_settings_changed={on_settings_changed}
      />
      return [
         bailiwick_table, bailiwicks_detail
      ]
   }
}

export default BailiwicksFreeform
