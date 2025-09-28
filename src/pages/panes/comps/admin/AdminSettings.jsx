import {Component} from 'react';
import PropTypes from 'prop-types';

import CoolTable, {
   CELL_ALIGN_LEFT,
   CELL_ALIGN_RIGHT,
   CELL_TYPE_TEXT,
   CELL_TYPE_OBJECT,
   // TABLE_NO_HEADER, TABLE_NO_BORDER,
} from "common/ui/CoolTable";

const SETTINGS_COLUMNS = [
   {
      id: "name",
      label: "name",
      type: CELL_TYPE_TEXT,
      width_px: 250,
      align: CELL_ALIGN_RIGHT
   },
   {
      id: "value",
      label: "value",
      type: CELL_TYPE_OBJECT,
      align: CELL_ALIGN_LEFT,
      width_px: 800,
   },
]

export class AdminSettings extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings} = this.props
      const settings_keys = Object.keys(page_settings)
      const table_data = settings_keys
         .sort()
         .map(key => {
            let value = page_settings[key]
            switch (typeof value) {
               case "object":
                  const json_obj = JSON.stringify(value, '', 2)
                  value = !Array.isArray(value)
                     ? <pre style={{margin: 0}}>{json_obj}</pre>
                     : '[]';
                  break;
               case "boolean":
                  value = value ? 'true' : 'false'
                  break;
               default:
                  break;
            }
            return {name: key, value}
         })
      const table_options = [] // [TABLE_NO_HEADER, TABLE_NO_BORDER]
      const settings_view = <CoolTable
         data={table_data}
         columns={SETTINGS_COLUMNS}
         options={table_options}
      />
      return settings_view
   }
}

export default AdminSettings
