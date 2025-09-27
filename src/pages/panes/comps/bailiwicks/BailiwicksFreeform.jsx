import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompBailiwickStyles as styles} from 'styles/CompBailiwickStyles';
import CoolTable, {
   CELL_ALIGN_LEFT,
   CELL_TYPE_TEXT,
   CELL_ALIGN_CENTER,
   CELL_TYPE_CALLBACK, TABLE_CAN_SELECT,
} from "common/ui/CoolTable";
import {
   fetch_bailiwicks,
   render_pattern,
   render_size,
   render_time_ago
} from "./BailiwickUtils";
import {BAILIWICK_MODE_FREEFORM} from "settings/BailiwickSettings";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoePrints} from "@fortawesome/free-solid-svg-icons";
import {KEY_DISABLED, KEY_FOCAL_POINT, KEY_SCOPE} from "../../../../settings/AppSettings";

const COLUMN_ID_PATTERN = "pattern";
const COLUMN_ID_NAME = "name";
const COLUMN_ID_SIZE = "size";
const COLUMN_ID_MODIFIED = "modified";

const TABLE_COLUMNS = [
   {
      id: COLUMN_ID_PATTERN,
      label: "#",
      type: CELL_TYPE_CALLBACK,
      width_px: 35,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: COLUMN_ID_NAME,
      label: "name",
      type: CELL_TYPE_TEXT,
      width_px: 200,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: COLUMN_ID_SIZE,
      label: "size",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: COLUMN_ID_MODIFIED,
      label: "modified",
      type: CELL_TYPE_CALLBACK,
      width_px: 100,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "go",
      label: "go",
      type: CELL_TYPE_CALLBACK,
      width_px: 35,
      align: CELL_ALIGN_CENTER,
   },
]

export class BailiwicksFreeform extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      free_bailiwicks: [],
      bailiwick_index: 0,
      sort_column_id: COLUMN_ID_PATTERN,
      sort_ascending: true,
   }

   componentDidMount() {
      this.fetch_bailiwicks();
   }

   fetch_bailiwicks = async () => {
      const free_bailiwicks = await fetch_bailiwicks(BAILIWICK_MODE_FREEFORM)
      this.setState({free_bailiwicks})
      console.log('free_bailiwicks', free_bailiwicks)
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
      this.setState({bailiwick_index})
   }

   on_click_column = (column_id) => {
      const {sort_column_id, sort_ascending} = this.state
      console.log('column_id', column_id)
      this.setState({
         sort_column_id: column_id,
         sort_ascending: sort_column_id === column_id ? !sort_ascending : true,
      })
   }

   compare_bailiwicks = (a, b) => {
      const {sort_column_id, sort_ascending} = this.state
      switch (sort_column_id) {
         case COLUMN_ID_SIZE:
            return sort_ascending
               ? a.magnitude - b.magnitude
               : b.magnitude - a.magnitude
         case COLUMN_ID_PATTERN:
            return sort_ascending
               ? a.pattern - b.pattern
               : b.pattern - a.pattern
         case COLUMN_ID_NAME:
            return sort_ascending
               ? a.name > b.name ? -1 : 1
               : a.name > b.name ? 1 : -1
         case COLUMN_ID_MODIFIED:
            return sort_ascending
               ? a.updated_at > b.updated_at ? -1 : 1
               : a.updated_at > b.updated_at ? 1 : -1
         default:
            console.log('compare_bailiwicks sort_column_id', sort_column_id)
            return 0;
      }
   }

   render() {
      const {free_bailiwicks, bailiwick_index, sort_column_id, sort_ascending} = this.state
      const table_data = free_bailiwicks
         .sort(this.compare_bailiwicks)
         .map((bailiwick) => {
            const display_settings = JSON.parse(bailiwick.display_settings)
            return {
               [COLUMN_ID_PATTERN]: [render_pattern, bailiwick.pattern],
               [COLUMN_ID_NAME]: <styles.NameSpan>{bailiwick.name}</styles.NameSpan>,
               [COLUMN_ID_SIZE]: [render_size, bailiwick.magnitude],
               [COLUMN_ID_MODIFIED]: [render_time_ago, bailiwick.updated_at],
               go: [
                  this.render_go_to_there,
                  {scope: display_settings.scope, focal_point: display_settings.focal_point}
               ],
            }
         })
      const bailiwick_table = <CoolTable
         data={table_data}
         columns={TABLE_COLUMNS}
         options={[TABLE_CAN_SELECT]}
         selected_row={bailiwick_index}
         on_select_row={this.select_bailiwick}
         on_click_column={this.on_click_column}
      />
      return [
         `ordered by ${sort_column_id} ${sort_ascending ? 'ascending' : 'descending'}`,
         bailiwick_table
      ]
   }
}

export default BailiwicksFreeform
