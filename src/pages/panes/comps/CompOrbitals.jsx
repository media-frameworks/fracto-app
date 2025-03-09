import {Component} from 'react';
import PropTypes from 'prop-types';

import OrbitalsColorChart from "./orbitals/OrbitalsColorChart";
import OrbitalsHistogram from "./orbitals/OrbitalsHistogram";
import {CompOrbitalStyles as styles} from "styles/CompOrbitalStyles"

export class CompOrbitals extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      const elements = [
         <OrbitalsColorChart
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />,
         <OrbitalsHistogram
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />
      ]
      return <styles.ContentWrapper>
         {elements}
      </styles.ContentWrapper>
   }
}

export default CompOrbitals
