import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PageAppStyles as styles} from '../styles/PageAppStyles'
import {LS_TILE_LOADER_LEVEL, LS_TILE_LOADER_PROGRESS_PCT} from "../fracto/FractoTilesLoaderProgress";
import LinearProgress from "@mui/material/LinearProgress";

export class AppHeaderBar extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      tile_loader_pct: 100,
      tile_loader_level: 0,
      visitor: null
   }

   componentDidMount() {
      this.get_visitor_info()
      const interval = setInterval(() => {
         const tile_loader_pct_str = localStorage.getItem(LS_TILE_LOADER_PROGRESS_PCT);
         if (!tile_loader_pct_str) {
            return;
         }
         if (tile_loader_pct_str === '100') {
            this.setState({tile_loader_pct: 100});
            clearInterval(interval);
         } else {
            const tile_loader_level_str = localStorage.getItem(LS_TILE_LOADER_LEVEL);
            this.setState({
               tile_loader_pct: parseInt(tile_loader_pct_str, 10),
               tile_loader_level: parseInt(tile_loader_level_str, 10)
            });
         }
      }, 1000)
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      this.get_visitor_info()
   }

   get_visitor_info = () => {
      const {visitor} = this.state
      if (visitor) {
         return;
      }
      const visitor_str = localStorage.getItem('visitor')
      if (visitor_str) {
         this.setState({visitor: JSON.parse(visitor_str)})
      }
   }

   get_salutation = () => {
      const {visitor} = this.state
      const message = [
         `visitor `,
         <styles.NameSpan>
            {visitor ? visitor.name : 'visitor'}
         </styles.NameSpan>,
      ]
      return <styles.Salutation>
         {message}
      </styles.Salutation>
   }

   render() {
      const {tile_loader_pct, tile_loader_level} = this.state
      const {app_name} = this.props;
      const loader = tile_loader_pct !== 100 ?
         <styles.HeaderProgressWrapper>
            <LinearProgress variant="determinate" value={tile_loader_pct}/>
         </styles.HeaderProgressWrapper> : '';
      const loader_level = tile_loader_pct !== 100 ?
         <styles.TileLoaderLevel>{tile_loader_level}</styles.TileLoaderLevel> : ''
      const salutation = this.get_salutation();
      return <styles.HeaderWrapper>
         {salutation}
         <styles.AppTitle>{app_name}</styles.AppTitle>
         {loader}
         {loader_level}
      </styles.HeaderWrapper>
   }
}

export default AppHeaderBar;
