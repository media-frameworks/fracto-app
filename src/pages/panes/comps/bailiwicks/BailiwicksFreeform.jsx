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

const TABLE_COLUMNS = [
   {
      id: "pattern",
      label: "#",
      type: CELL_TYPE_CALLBACK,
      width_px: 35,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "name",
      label: "name",
      type: CELL_TYPE_TEXT,
      width_px: 200,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "size",
      label: "size",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "modified",
      label: "modified",
      type: CELL_TYPE_CALLBACK,
      width_px: 120,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "go",
      label: "go",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
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
      bailiwick_index: 0
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

   render() {
      const {free_bailiwicks, bailiwick_index} = this.state
      const table_data = free_bailiwicks.map((bailiwick) => {
         const display_settings = JSON.parse(bailiwick.display_settings)
         return {
            pattern: [render_pattern, bailiwick.pattern],
            name: <styles.NameSpan>{bailiwick.name}</styles.NameSpan>,
            size: [render_size, bailiwick.magnitude],
            modified: [render_time_ago, bailiwick.updated_at],
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
      />
      return [bailiwick_table]
   }
}

export default BailiwicksFreeform
