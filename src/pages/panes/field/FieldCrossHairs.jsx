import {Component} from 'react';
import PropTypes from 'prop-types';

import {PaneFieldStyles as styles} from 'styles/PaneFieldStyles'
import {
   KEY_CLIENT_POINT,
   KEY_DISABLED,
   KEY_FIELD_CROSSHAIRS,
   KEY_FOCAL_POINT,
   KEY_HOVER_POINT, KEY_IMAGE_BOUNDS
} from "settings/AppSettings";

const CENTER_BOX_HALF_PX = 7

export class FieldCrossHairs extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   on_click = () => {
      const {page_settings, on_settings_changed} = this.props
      on_settings_changed({
         [KEY_FOCAL_POINT]: JSON.parse(JSON.stringify(page_settings[KEY_HOVER_POINT])),
         [KEY_DISABLED]: true
      })
   }
   on_mouse_move = (e) => {
      e.stopPropagation();
      e.preventDefault();
   }

   render() {
      const {page_settings} = this.props;
      if (!page_settings[KEY_FIELD_CROSSHAIRS]) {
         return []
      }
      if (page_settings[KEY_DISABLED]) {
         return []
      }
      const image_bounds = page_settings[KEY_IMAGE_BOUNDS]
      const horizontal_left_style = {
         top: `${page_settings[KEY_CLIENT_POINT].y || -1}px`,
         left: `${image_bounds.left - 4}px`,
         width: `${page_settings[KEY_CLIENT_POINT].x - image_bounds.left - 3}px`,
      };
      const horizontal_right_style = {
         top: `${page_settings[KEY_CLIENT_POINT].y || -1}px`,
         left: `${page_settings[KEY_CLIENT_POINT].x + 10}px`,
         width: `${image_bounds.right - page_settings[KEY_CLIENT_POINT].x - 6}px`,
      };
      const vertical_top_style = {
         left: `${page_settings[KEY_CLIENT_POINT].x || -1}px`,
         top: `${image_bounds.top - 3}px`,
         height: `${page_settings[KEY_CLIENT_POINT].y - image_bounds.top - 4}px`,
      };
      const vertical_bottom_style = {
         left: `${page_settings[KEY_CLIENT_POINT].x || -1}px`,
         top: `${page_settings[KEY_CLIENT_POINT].y + 10}px`,
         height: `${image_bounds.bottom - page_settings[KEY_CLIENT_POINT].y - 10}px`,
      };
      const box_top_style = {
         left: `${page_settings[KEY_CLIENT_POINT].x - CENTER_BOX_HALF_PX}px`,
         width: `${2 * CENTER_BOX_HALF_PX + 2}px`,
         top: `${page_settings[KEY_CLIENT_POINT].y - CENTER_BOX_HALF_PX - 1}px`,
      }
      const box_bottom_style = {
         left: `${page_settings[KEY_CLIENT_POINT].x - CENTER_BOX_HALF_PX }px`,
         width: `${2 * CENTER_BOX_HALF_PX + 2}px`,
         top: `${page_settings[KEY_CLIENT_POINT].y + CENTER_BOX_HALF_PX + 1}px`,
      }
      const box_left_style = {
         top: `${page_settings[KEY_CLIENT_POINT].y - CENTER_BOX_HALF_PX}px`,
         left: `${page_settings[KEY_CLIENT_POINT].x - CENTER_BOX_HALF_PX - 1}px`,
         height: `${2 * CENTER_BOX_HALF_PX + 2}px`,
      }
      const box_right_style = {
         top: `${page_settings[KEY_CLIENT_POINT].y - CENTER_BOX_HALF_PX}px`,
         left: `${page_settings[KEY_CLIENT_POINT].x + CENTER_BOX_HALF_PX +  1}px`,
         height: `${2 * CENTER_BOX_HALF_PX + 2}px`,
      }
      return [
         <styles.HorizontalCrossHair
            key={'horizontal-crosshair-left'}
            style={horizontal_left_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.HorizontalCrossHair
            key={'horizontal-crosshair-right'}
            style={horizontal_right_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.VerticalCrossHair
            key={'vertical-crosshair-top'}
            style={vertical_top_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.VerticalCrossHair
            key={'vertical-crosshair-bottom'}
            style={vertical_bottom_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.BoxTopBottom
            key={'center-box-top'}
            style={box_top_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.BoxTopBottom
            key={'center-box-bottom'}
            style={box_bottom_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.BoxLeftRight
            key={'center-box-left'}
            style={box_left_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
         <styles.BoxLeftRight
            key={'center-box-right'}
            style={box_right_style}
            onClick={this.on_click}
            onMouseMove={this.on_mouse_move}
         />,
      ]
   }
}

export default FieldCrossHairs
