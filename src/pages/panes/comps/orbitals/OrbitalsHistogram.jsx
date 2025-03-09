import {Component} from 'react';
import PropTypes from 'prop-types';
import {KEY_CANVAS_BUFFER, KEY_COMPS_HEIGHT_PX} from "../../../PageSettings";
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
import FractoUtil from "../../../../fracto/FractoUtil";
import CoolStyles from "../../../../common/ui/styles/CoolStyles";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

export class OrbitalsHistogram extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }
   state = {
      bin_list: [],
      most_recent: {
         scope: 0,
         focal_point: {x: 0, y: 0}
      }
   }

   componentDidMount() {
      setTimeout(() => {
         this.fill_histogram()
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
         this.fill_histogram()
      }
   }

   fill_histogram = () => {
      const {page_settings} = this.props
      const canvas_buffer = page_settings[KEY_CANVAS_BUFFER]
      if (!canvas_buffer) {
         return;
      }
      // console.log('canvas_buffer', canvas_buffer);
      let non_orbital_bins = {}
      canvas_buffer.forEach(row => {
         row.forEach(cell => {
            const [pattern, iterations] = cell;
            if (pattern !== 0) {
               return;
            }
            const non_orbital_key = `_${iterations}`
            if (!non_orbital_bins[non_orbital_key]) {
               non_orbital_bins[non_orbital_key] = 0;
            }
            non_orbital_bins[non_orbital_key]++
         })
      });
      const bin_keys = Object.keys(non_orbital_bins)
      const bin_list = bin_keys
         .filter(bin_key => non_orbital_bins[bin_key] > 10)
         .map(bin_key => {
            return {
               iterations: parseInt(bin_key.slice(1), 10),
               count: non_orbital_bins[bin_key]
            }
         }).sort((a, b) => {
            return b.iterations - a.iterations;
         })
      this.setState({bin_list})
      console.log('bin_list', bin_list)
   }

   render() {
      const {bin_list} = this.state
      const {page_settings} = this.props
      const data = {
         labels: bin_list.map(bin => bin.iterations),
         datasets: [
            {
               label: 'escapes',
               data: bin_list.map(bin => bin.count),
               backgroundColor: bin_list.map(bin =>
                  FractoUtil.fracto_pattern_color(0, bin.iterations)),
               barThickness: 'flex',
            },
         ],
      }
      const options = {
         maintainAspectRatio: false,
         scales: {
            x: {type: 'logarithmic'},
            y: {type: 'logarithmic'},
         },
      };
      const chartStyle = {height: `${page_settings[KEY_COMPS_HEIGHT_PX] * 0.45}px`}
      return <CoolStyles.Block style={chartStyle}>
         <Bar data={data} options={options}/>
      </CoolStyles.Block>
   }
}

export default OrbitalsHistogram
