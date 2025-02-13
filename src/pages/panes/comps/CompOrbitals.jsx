import {Component} from 'react';
import PropTypes from 'prop-types';

import {CoolTable} from 'common/ui/CoolImports';
import {
   CELL_ALIGN_CENTER,
   CELL_ALIGN_LEFT,
   CELL_TYPE_CALLBACK,
   CELL_TYPE_TEXT
} from "common/ui/CoolTable";
import FractoUtil from "fracto/FractoUtil";
import {render_pattern_block} from "fracto/styles/FractoStyles";
import {
   KEY_COMPS_WIDTH_PX,
} from "../../PageSettings";
import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'

const COLOR_BAR_WIDTH_PX = 350;

var ORBITALS_HEADERS = [
   {
      id: "orbital",
      label: "#",
      type: CELL_TYPE_CALLBACK,
      width_px: 40,
      align: CELL_ALIGN_CENTER
   },
   {
      id: "count_pct",
      label: "pixels (%)",
      type: CELL_TYPE_TEXT,
      width_px: 100,
      align: CELL_ALIGN_LEFT,
      style: {
         fontfamily: 'monospace',
         fontSize: '0.80rem',
         color: '#444444'
      }
   },
   {
      id: "color_bar",
      label: `...`,
      type: CELL_TYPE_CALLBACK,
      width_px: COLOR_BAR_WIDTH_PX
   },
]

export class CompOrbitals extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      orbital_bins: {},
      most_recent: {
         scope: 0,
         focal_point: {x: 0, y: 0}
      }
   }

   componentDidMount() {
      const interval = setInterval(() => {
         if (this.fill_pattern_bins()) {
            clearInterval(interval)
         }
      }, 1000)
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {most_recent} = this.state
      const {page_settings} = this.props
      const {scope, focal_point} = page_settings
      const mr_scope = most_recent.scope
      const mr_focal_point = most_recent.focal_point
      const scope_changed = mr_scope !== scope
      const focal_point_x_changed = mr_focal_point.x !== focal_point.x
      const focal_point_y_changed = mr_focal_point.y !== focal_point.y
      if (scope_changed || focal_point_x_changed || focal_point_y_changed) {
         this.setState({most_recent: {scope, focal_point}})
         this.fill_pattern_bins()
      }
   }

   fill_pattern_bins = () => {
      const {page_settings} = this.props
      const {canvas_buffer} = page_settings
      if (!canvas_buffer) {
         return false;
      }
      let orbital_bins = {
         total_count: 0,
         max_bin: 1
      }
      for (let img_x = 0; img_x < canvas_buffer.length; img_x++) {
         for (let img_y = 0; img_y < canvas_buffer[img_x].length; img_y++) {
            const pattern = canvas_buffer[img_x][img_y][0]
            if (pattern === 0) {
               continue
            }
            const orbital_key = `orbital_${pattern}`
            if (!(orbital_key in orbital_bins)) {
               orbital_bins[orbital_key] = {
                  orbital: pattern,
                  bin_count: 0,
               }
            }
            orbital_bins.total_count += 1
            orbital_bins[orbital_key].bin_count += 1
            if (orbital_bins[orbital_key].bin_count > orbital_bins.max_bin) {
               orbital_bins.max_bin = orbital_bins[orbital_key].bin_count
            }
         }
      }
      this.setState({orbital_bins: orbital_bins})
      return true
   }

   color_bar = (bin) => {
      const {orbital_bins} = this.state
      const bar_width_px = COLOR_BAR_WIDTH_PX * (bin.bin_count / orbital_bins.max_bin)
      const style = {
         backgroundColor: FractoUtil.fracto_pattern_color(bin.orbital),
         width: `${bar_width_px}px`
      };
      return <styles.ColorBarSegment
         key={`colorbar_${bin.orbital}_`}
         style={style}
         title={bin.orbital}
      />
   }

   render_bins = () => {
      const {orbital_bins} = this.state
      const {page_settings} = this.props
      const width_px = page_settings[KEY_COMPS_WIDTH_PX]
      const bin_keys = Object.keys(orbital_bins);
      if (bin_keys.length === 0) {
         return <styles.OrbitalsPrompt>
            {'Loading orbitals data...'}
         </styles.OrbitalsPrompt>
      }
      const sorted_bins = bin_keys
         .filter(key => key !== 'total_count')
         .filter(key => key !== 'max_bin')
         .map(key => orbital_bins[key])
         .sort((a, b) => a.orbital > b.orbital ? 1 : -1)
      const prominent_orbitals = JSON.parse(JSON.stringify(sorted_bins))
         .filter(bin => bin.bin_count > 300)
         .sort((a, b) => a.bin_count > b.bin_count ? -1 : 1)
         .slice(0, 20)
         .map(bin => bin.orbital)
      const lesser_orbitals = JSON.parse(JSON.stringify(sorted_bins))
         .filter(bin => bin.bin_count <= 300)
      const data = prominent_orbitals.sort((a, b) => a - b)
         .map(orbital => {
            const orbital_bin = sorted_bins.find(bin => bin.orbital === orbital)
            const pct = Math.round(orbital_bin.bin_count * 10000 / orbital_bins.total_count) / 100
            return {
               orbital: [render_pattern_block, orbital_bin.orbital],
               count_pct: `${orbital_bin.bin_count} (${pct}%)`,
               color_bar: [this.color_bar, orbital_bin]
            }
         })
      const and_the_rest = lesser_orbitals
         .filter(bin => bin.bin_count > 50)
         .map(bin => {
            const pct = Math.round(bin.bin_count * 10000 / orbital_bins.total_count) / 100
            return <styles.ColorBlockWrapper
               title={`${bin.bin_count} (${pct}%)`}>
               {render_pattern_block(bin.orbital)}
            </styles.ColorBlockWrapper>
         })
      const others_block = [
         <styles.OthersLabel>Other orbitals represented:</styles.OthersLabel>,
         <styles.OthersWrapper>{and_the_rest}</styles.OthersWrapper>
      ]
      ORBITALS_HEADERS[2].width_px = width_px - 235
      return <styles.BinsWrapper>
         <styles.OthersLabel>{`${orbital_bins.total_count} pixels have orbital values:`}</styles.OthersLabel>
         <styles.TableWrapper><CoolTable
            data={data}
            columns={ORBITALS_HEADERS}
         />
         </styles.TableWrapper>
         {lesser_orbitals.length ? others_block : ''}
      </styles.BinsWrapper>
   }

   render() {
      return this.render_bins()
   }
}

export default CompOrbitals
