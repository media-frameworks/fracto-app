import React, {Component} from 'react';
import PropTypes from 'prop-types';

import network from "common/config/network.json"

import {CompFactoryStyles as styles} from 'styles/CompFactoryStyles'
import {KEY_FOCAL_POINT, KEY_SCOPE} from "pages/settings/AppSettings";
import PageSettings from "pages/PageSettings";
import {
   CELL_ALIGN_CENTER,
   CELL_TYPE_NUMBER, CoolTable
} from "common/ui/CoolTable";

const IMAGE_SERVER_URL = network.image_server_url

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
      type: CELL_TYPE_NUMBER,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "can_do",
      label: "can do",
      type: CELL_TYPE_NUMBER,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "blank",
      label: "blank",
      type: CELL_TYPE_NUMBER,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "interior",
      label: "interior",
      type: CELL_TYPE_NUMBER,
      width_px: 80,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "needs_update",
      label: "needs update",
      type: CELL_TYPE_NUMBER,
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
               coverage: null
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

   render_coverage = () => {
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
               coverage: level_data.tiles.length || '-',
               can_do: level_data.filtered_by_level.length || '-',
               blank: level_data.blanks_by_level.length || '-',
               interior: level_data.interiors_with_bounds.length || '-',
               needs_update: level_data.needs_update_with_bounds.length || '-',
            }
         })
      return <CoolTable
         columns={COVERAGE_TABLE_COLUMNS}
         data={data}
      />
   }

   render() {
      const {in_detect, coverage} = this.state
      const detect_link = <styles.DetectPrompt
         style={{opacity: in_detect ? 0.65 : 1.0}}
         onClick={this.detect_coverage}>
         detect coverage
      </styles.DetectPrompt>
      const coverage_table = coverage ? this.render_coverage() : ''
      return <styles.ContentWrapper>
         {detect_link}
         {coverage_table}
      </styles.ContentWrapper>
   }
}

export default FactoryGenerator
