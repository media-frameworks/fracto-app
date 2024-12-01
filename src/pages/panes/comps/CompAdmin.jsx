import {Component} from 'react';
import PropTypes from 'prop-types';

import AdminSettings from "./admin/AdminSettings";
import {CompAdminStyles as styles} from 'styles/CompAdminStyles'

export class CompAdmin extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   render() {
      const {page_settings, on_settings_changed} = this.props
      return <styles.ContentWrapper>
         <AdminSettings
            page_settings={page_settings}
            on_settings_changed={on_settings_changed}
         />
      </styles.ContentWrapper>

   }
}

export default CompAdmin
