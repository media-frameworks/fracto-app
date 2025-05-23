import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {CoolStyles} from 'common/ui/CoolImports';

import FractoRasterImage from "./FractoRasterImage";
import FractoTileCache from "./FractoTileCache";
import FractoColors from "./styles/FractoColors";

const RenderWrapper = styled(CoolStyles.InlineBlock)`
    background-color: #f8f8f8;
`;

export class FractoTileRender extends Component {

   static propTypes = {
      tile: PropTypes.object.isRequired,
      width_px: PropTypes.number.isRequired,
      tile_data: PropTypes.array,
      no_tile_mode: PropTypes.bool,
   }

   static defaultProps = {
      tile_data: null,
      no_tile_mode: false
   }

   state = {
      canvas_ref: React.createRef(),
      tile_loaded: true
   };

   componentDidMount() {
      const {canvas_ref} = this.state;
      const {no_tile_mode} = this.props;
      const canvas = canvas_ref.current;
      if (canvas) {
         const ctx = canvas.getContext('2d');
         this.setState({ctx: ctx})
         if (!no_tile_mode) {
            this.load_tile(ctx);
         }
      }
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      const {ctx} = this.state;
      const {no_tile_mode} = this.props;
      // if (this.props.tile.short_code === prevProps.tile.short_code) {
      //    return;
      // }
      if (!no_tile_mode) {
         this.load_tile(ctx);
      }
   }

   load_tile = async (ctx) => {
      const {tile, width_px, tile_data} = this.props;
      if (tile_data) {
         FractoColors.buffer_to_canvas(tile_data, ctx, width_px / 256)
      } else {
         const tile_data = await FractoTileCache.get_tile(tile.short_code)
         FractoColors.buffer_to_canvas(tile_data, ctx, width_px / 256)
      }
   }

   render() {
      const {canvas_ref} = this.state;
      const {tile, width_px, no_tile_mode} = this.props;
      const pixels = `${width_px}px`
      const canvas_style = {
         width: pixels, height: pixels
      }
      if (no_tile_mode) {
         const scope = tile.bounds.right - tile.bounds.left;
         const focal_point = {
            x: (tile.bounds.right + tile.bounds.left) / 2,
            y: (tile.bounds.top + tile.bounds.bottom) / 2
         }
         const level = tile.short_code.length - 1
         return <RenderWrapper style={canvas_style}>
            <FractoRasterImage
               focal_point={focal_point}
               scope={scope}
               aspect_ratio={1.0}
               level={level}
               width_px={width_px}
            />
         </RenderWrapper>
      } else {
         return <RenderWrapper style={canvas_style}>
            <canvas
               ref={canvas_ref}
               width={width_px}
               height={width_px}
            />
         </RenderWrapper>
      }
   }
}

export default FractoTileRender;
