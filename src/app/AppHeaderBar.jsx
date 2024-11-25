import {Component} from 'react';
import PropTypes from 'prop-types';

import {PageAppStyles as styles} from '../styles/PageAppStyles'

export class AppHeaderBar extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
   }

   render() {
      const {app_name} = this.props;
      return <styles.HeaderWrapper>
         <styles.AppTitle>{app_name}</styles.AppTitle>
      </styles.HeaderWrapper>
   }
}

export default AppHeaderBar;
