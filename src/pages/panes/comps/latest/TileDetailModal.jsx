import React, {Component} from 'react';
import PropTypes from 'prop-types';

import network from "common/config/network.json";
import {CoolStyles, CoolModal} from "common/ui/CoolImports";
import {KEY_MODAL} from "pages/PageSettings";

import FractoTileContext from "fracto/FractoTileContext";
import FractoUtil from "fracto/FractoUtil";
import FractoTileRender from "fracto/FractoTileRender";
import FractoTileCache from "fracto/FractoTileCache";
import {TileDetailStyles as styles} from 'styles/TileDetailStyles';
import {NumberSpan, render_coordinates} from "../../../../fracto/styles/FractoStyles";

export class TileDetailModal extends Component {
   static propTypes = {
      short_code: PropTypes.string.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      tile_data: [],
      context_scope: 6,
      scope_factor: 1.618,
   }

   componentDidMount() {
      this.get_tile_data()
   }

   get_tile_data = async () => {
      const {short_code} = this.props
      const url = `${network["fracto-prod"]}/new/${short_code}.gz`
      const tile_data = await FractoTileCache.get_tile_url(url)
      this.setState({tile_data})
   }

   handle_response = (r) => {
      const {on_settings_changed} = this.props
      if (!r) {
         let new_settings = {};
         new_settings[KEY_MODAL] = null
         on_settings_changed(new_settings)
      }
   }

   on_context_rendered = () => {
      setTimeout(() => {
         const {context_scope, scope_factor} = this.state
         const {short_code} = this.props
         const bounds = FractoUtil.bounds_from_short_code(short_code)
         const tile_scope = bounds.right - bounds.left
         if (context_scope < 6) {
            this.setState({
               context_scope: 6,
               scope_factor: 1.618,
            })
         } else if (context_scope * tile_scope > 3) {
            this.setState({
               context_scope: 3 / tile_scope,
               scope_factor: 0.618,
            })
         } else {
            this.setState({
               context_scope: context_scope * scope_factor,
            })
         }
      }, 1000)
   }

   render_tile_size = () => {
      const {short_code} = this.props
      const bounds = FractoUtil.bounds_from_short_code(short_code)
      const magnitude = bounds.right - bounds.left
      const rounded = Math.round(magnitude * 100000000) / 100
      const mu = <i>{'\u03BC'}</i>
      return [
         <styles.BigStatValue>{rounded}{mu}</styles.BigStatValue>,
         <styles.InfoText>across</styles.InfoText>
      ]
   }

   render() {
      const {tile_data, context_scope} = this.state
      const {short_code} = this.props
      const tile = {
         short_code,
         bounds: FractoUtil.bounds_from_short_code(short_code)
      }
      const scope = tile.bounds.right - tile.bounds.left
      const first_row = <styles.CenteredBlock>
         <CoolStyles.InlineBlock>
            <styles.ContextTitle>{'location context'}</styles.ContextTitle>
            <FractoTileContext
               tile={tile}
               width_px={192}
               scope_factor={context_scope}
               on_context_rendered={this.on_context_rendered}
            />
            <styles.LevelInfoBlock>
               <styles.LevelSpan>{`level ${short_code.length}`}</styles.LevelSpan>
               <styles.InfoText>tiles are</styles.InfoText>
            </styles.LevelInfoBlock>
            <styles.LevelInfoBlock>
               {this.render_tile_size()}
            </styles.LevelInfoBlock>
            <styles.LevelInfoBlock>
               <NumberSpan>{`(${scope})`} </NumberSpan>
            </styles.LevelInfoBlock>
         </CoolStyles.InlineBlock>
         <styles.Spacer/>
         <FractoTileRender
            width_px={350}
            tile={tile}
            tile_data={tile_data}
         />
      </styles.CenteredBlock>
      const second_row = <styles.ShortCodeSpan>{short_code}</styles.ShortCodeSpan>
      const center_point_x = (tile.bounds.right + tile.bounds.left) / 2
      const center_point_y = (tile.bounds.top + tile.bounds.bottom) / 2
      const third_row =
         <styles.CenteredBlock>
            <styles.AttributeLabel>{'centered at: '}</styles.AttributeLabel>
            <styles.AttributeContent>
               {render_coordinates(center_point_x, center_point_y)}
            </styles.AttributeContent>
         </styles.CenteredBlock>
      const all_content = [first_row, second_row, third_row]
      return <CoolModal
         contents={<styles.ModalWrapper>{all_content}</styles.ModalWrapper>}
         width={"800px"}
         response={this.handle_response}
         title_text={`tile details`}
      />
   }
}

export default TileDetailModal
