import React, {Component} from 'react';
import PropTypes from 'prop-types';

import network from "common/config/network.json" with {type: 'json'}

import {CompFactoryStyles as styles} from 'styles/CompFactoryStyles'
import PageSettings from "pages/PageSettings";
import {
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import {
   CoolTable,
   CELL_ALIGN_CENTER,
   CELL_TYPE_NUMBER,
   CELL_TYPE_CALLBACK
} from "common/ui/CoolTable";
import GenerateTileSet from "./GenerateTileSet";

const IMAGE_SERVER_URL = network.image_server_url

const GENERATE_WITH_MARGINS = 'generate_with_margins'
const GENERATE_ALL = 'generate_all'
const GENERATE_AGAIN = 'generate_again'

const COVERAGE_TABLE_COLUMNS = [
   {
      id: "level",
      label: "level",
      type: CELL_TYPE_NUMBER,
      width_px: 20,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "coverage",
      label: "coverage",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "can_do",
      label: "can do",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "blank",
      label: "blank",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "interior",
      label: "interior",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "needs_update",
      label: "needs update",
      type: CELL_TYPE_CALLBACK,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
]

export class FactoryGenerator extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      in_detect: false,
      stored_values: {},
      interval: null,
      coverage: null,
      tile_set: null,
      operation_type: null,
      final_status: null,
      job_status: [],
      selected_level: 0,
      selected_column: '',
   }

   componentDidMount() {
      const {stored_values} = this.state
      const {page_settings} = this.props
      const interval = setInterval(() => {
         const settings_changed = PageSettings.test_update_settings(
            [KEY_FOCAL_POINT, KEY_SCOPE], page_settings, stored_values)
         if (settings_changed) {
            this.setState({
               stored_values,
               coverage: null,
               tile_set: null,
            })
         }
      }, 500)
      this.setState({interval})
   }

   componentWillUnmount() {
      const {interval} = this.state
      if (interval) {
         clearInterval(interval)
      }
   }

   fetch_coverage = async () => {
      const {page_settings} = this.props
      const focal_point = page_settings[KEY_FOCAL_POINT]
      const scope = page_settings[KEY_SCOPE]
      const url = `${IMAGE_SERVER_URL}/tile_coverage?focal_point=${JSON.stringify(focal_point)}&scope=${scope}`
      const result = await fetch(url).then(res => res.json())
      console.log('fetch_coverage', result.coverage)
      this.setState({
         coverage: result.coverage,
         in_detect: false,
      })
   }

   detect_coverage = () => {
      const {in_detect} = this.state
      if (in_detect) {
         return;
      }
      this.setState({in_detect: true})
      this.fetch_coverage()
   }

   render_item = (item_data) => {
      const {tile_set, operation_type, selected_level, selected_column} = item_data
      const extra_style = (this.state.selected_level === selected_level && this.state.selected_column === selected_column)
         ? {
            color: 'black',
            border: '2px solid lightcoral',
            padding: '1px 4px 0',
            borderRadius: '2px',
         } : {}
      if (this.state.tile_set) {
         return <styles.Numeric style={extra_style}>
            {tile_set.length || '-'}
         </styles.Numeric>
      }
      return tile_set.length
         ? <styles.NumericLink
            onClick={() => this.setState({tile_set, operation_type, selected_level, selected_column})}>
            {tile_set.length}
         </styles.NumericLink>
         : '-'
   }

   render_coverage_table = () => {
      const {in_detect, coverage} = this.state
      if (in_detect || !coverage) {
         return ''
      }
      const data = coverage
         .filter(level_data => {
            if (level_data.tiles.length > 0) {
               return true
            }
            if (level_data.blanks_by_level.length > 0) {
               return true
            }
            if (level_data.filtered_by_level.length > 0) {
               return true
            }
            if (level_data.interiors_with_bounds.length > 0) {
               return true
            }
            if (level_data.needs_update_with_bounds.length > 0) {
               return true
            }
            return false
         })
         .map(level_data => {
            return {
               level: level_data.level,
               coverage: [
                  this.render_item, {
                     tile_set: level_data.tiles,
                     operation_type: GENERATE_AGAIN,
                     selected_level: level_data.level,
                     selected_column: 'coverage'
                  }
               ],
               can_do: [
                  this.render_item, {
                     tile_set: level_data.filtered_by_level,
                     operation_type: GENERATE_WITH_MARGINS,
                     selected_level: level_data.level,
                     selected_column: 'can_do'
                  }
               ],
               blank: [
                  this.render_item, {
                     tile_set: level_data.blanks_by_level,
                     operation_type: GENERATE_AGAIN,
                     selected_level: level_data.level,
                     selected_column: 'blank'
                  }
               ],
               interior: [
                  this.render_item, {
                     tile_set: level_data.interiors_with_bounds,
                     operation_type: GENERATE_ALL,
                     selected_level: level_data.level,
                     selected_column: 'interior'
                  }
               ],
               needs_update: [
                  this.render_item, {
                     tile_set: level_data.needs_update_with_bounds,
                     operation_type: GENERATE_AGAIN,
                     selected_level: level_data.level,
                     selected_column: 'needs_update'
                  }
               ],
            }
         })
      return <CoolTable
         columns={COVERAGE_TABLE_COLUMNS}
         data={data}
      />
   }

   on_tile_complete = (tile_status) => {
      const {job_status} = this.state
      job_status.push(tile_status)
      this.setState({job_status})
   }

   on_job_complete = (final_status) => {
      this.setState({
         final_status,
         tile_set: null,
      })
   }

   render() {
      const {in_detect, coverage, tile_set, operation_type} = this.state
      const detect_link = <styles.DetectPrompt
         style={{opacity: in_detect ? 0.65 : 1.0}}
         onClick={this.detect_coverage}>
         detect coverage
      </styles.DetectPrompt>
      const coverage_table = coverage ? this.render_coverage_table() : ''
      const generator = tile_set
         ? <GenerateTileSet
            tile_set={tile_set}
            operation_type={operation_type}
            on_tile_complete={this.on_tile_complete}
            on_job_complete={this.on_job_complete}
         />
         : ''
      return <styles.ContentWrapper>
         {detect_link}
         {coverage_table}
         {generator}
      </styles.ContentWrapper>
   }
}

export default FactoryGenerator
