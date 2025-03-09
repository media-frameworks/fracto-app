import {Component} from 'react';
import PropTypes from 'prop-types';

import FractoUtil from "fracto/FractoUtil";
import {KEY_COMPS_HEIGHT_PX} from "pages/PageSettings";
import {PaneCompsStyles as styles} from 'styles/PaneCompsStyles'

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import CoolStyles from "common/ui/styles/CoolStyles";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

export class OrbitalsColorChart extends Component {
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

   componentDidUpdate(prevProps, prevState, snapshot) {
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

   render() {
      const {orbital_bins} = this.state
      const {page_settings} = this.props
      const bin_keys = Object.keys(orbital_bins)
         .filter(key => orbital_bins[key].orbital > 0)
         .filter(key => orbital_bins[key].bin_count > 10)
         .sort((a, b) => orbital_bins[a].orbital - orbital_bins[b].orbital)
      if (bin_keys.length === 0) {
         return <styles.OrbitalsPrompt>
            {'Loading orbitals data...'}
         </styles.OrbitalsPrompt>
      }
      const data = {
         labels: bin_keys.map(key => parseInt(orbital_bins[key].orbital)),
         datasets: [
            {
               label: 'orbitals',
               data: bin_keys.map(key => orbital_bins[key].bin_count),
               backgroundColor: bin_keys.map(key => FractoUtil.fracto_pattern_color(orbital_bins[key].orbital)),
               barThickness: 'flex',
            },
         ],
      }
      const options = {
         maintainAspectRatio: false,
         scales: {
            // x: {type: 'logarithmic'},
            y: {type: 'logarithmic'},
         },
      };
      const chartStyle = {height: `${page_settings[KEY_COMPS_HEIGHT_PX] * 0.45}px`}
      return <CoolStyles.Block style={chartStyle}>
         <Bar data={data} options={options}/>
      </CoolStyles.Block>
   }
}

export default OrbitalsColorChart
