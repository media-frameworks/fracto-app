import {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

import network from "common/config/network.json";

import {
   CELL_TYPE_NUMBER, CELL_ALIGN_CENTER
} from "common/ui/CoolTable";
import CoolTable from "common/ui/CoolTable";
import FractoIndexedTiles, {TILE_SET_INDEXED} from "fracto/FractoIndexedTiles";

const FRACTO_PROD = network["fracto-prod"];
const FRACTO_DB_URL = network.db_server_url;
const AXIOS_CONFIG = {
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}
const INVENTORY_COLUMNS = [
   {
      id: "level",
      label: "level",
      type: CELL_TYPE_NUMBER,
      width_px: 50,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "indexed",
      label: "indexed",
      type: CELL_TYPE_NUMBER,
      width_px: 100,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "needs_update",
      label: "needs update",
      type: CELL_TYPE_NUMBER,
      width_px: 100,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "in_db",
      label: "in db",
      type: CELL_TYPE_NUMBER,
      width_px: 100,
      align: CELL_ALIGN_CENTER
   },
]

export class AdminInventory extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      table_data: []
   }

   componentDidMount() {
      const table_data = []
      this.get_db_totals(db_totals => {
         this.get_needs_update(totals => {
            console.log('totals', totals)
            for (let level = 3; level <= 20; level++) {
               const level_data = FractoIndexedTiles.get_set_level(TILE_SET_INDEXED, level)
               // console.log('level_data', level, level_data)
               let tile_count = 0
               level_data.columns.forEach(column => {
                  tile_count += column.tiles.length
               })
               let needs_update = totals.find(row => -1 !== row.indexOf(`L${level}`))
               if (!needs_update) {
                  needs_update = totals.find(row => -1 !== row.indexOf(`L0${level}`))
               }
               const db_total = db_totals.find(row => row.level === level)
               table_data.push({
                  level: level,
                  indexed: tile_count,
                  needs_update: parseInt(needs_update.slice(0, 9), 10),
                  in_db: db_total?.total || 0
               })
            }
            this.setState({table_data})
         })
      })
   }

   get_needs_update = async (cb) => {
      const url = `${FRACTO_PROD}/manifest/needs_update/totals.txt`
      const totals = await axios.get(url, AXIOS_CONFIG)
      cb(totals.data.split('\n'))
   }

   get_db_totals = async (cb) => {
      const url = `${FRACTO_DB_URL}/tile_counts`
      // fetch(url)
      //    .then(response => response.text())
      //    .then((str) => {
      //       const json = JSON.parse(str)
      //       // console.log('get_db_totals', json)
      //       cb(json)
      //    })
   }

   render() {
      const {table_data} = this.state
      const settings_view = <CoolTable
         data={table_data}
         columns={INVENTORY_COLUMNS}
      />
      return settings_view
   }
}

export default AdminInventory
