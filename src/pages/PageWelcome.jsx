import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Utils from 'common/system/Utils'

import {PageAppStyles as styles} from 'styles/PageAppStyles'
import FractoUtil from "fracto/FractoUtil";
import {
   GALLERY_4800_PX_IMAGE_IDS
} from "assets/AssetImages";

const INTRO_TEXT = [
   <b>Fracto</b>,
   " is an empirical study of the distribution,", <br/>,
   "formal characteristics, and structural taxonomy", <br/>,
   "of the orbital patterns within the Mandelbrot Set."
]

const REFRESH_LIMIT = 800
const REFRESH_CADENCE_MS = 25

export class PageWelcome extends Component {
   static propTypes = {
      on_start: PropTypes.func.isRequired,
   }

   state = {
      interval: null,
      x_offset: 0,
      y_offset: 0,
      x_scalar: 1,
      y_scalar: -1,
      image_index: 0,
      refresh_counter: 0,
      wrapper_ref: React.createRef(),
      shuffled_images: [],
      letter_color: 'white',
      show_info_box: false,
      button_ref: React.createRef(),
   }

   componentDidMount() {
      const interval = setInterval(this.update_background, REFRESH_CADENCE_MS)
      const shuffled_images = Utils.shuffle(GALLERY_4800_PX_IMAGE_IDS)
      this.setState({interval, shuffled_images})
   }

   url_from_index = (image_index) => {
      const {shuffled_images} = this.state
      return `https://mikehallstudio.s3.us-east-1.amazonaws.com/fracto/images/img_${shuffled_images.at(image_index)}.jpg`
   }

   update_background = () => {
      const {
         x_offset, y_offset, x_scalar, y_scalar,
         refresh_counter, wrapper_ref, shuffled_images, image_index
      } = this.state
      if (!wrapper_ref.current) {
         return
      }
      const bounds_rect = wrapper_ref.current.getBoundingClientRect()
      const max_x_offset = 4800 - bounds_rect.width
      const max_y_offset = 4800 - bounds_rect.height
      let new_image_index = Math.floor(refresh_counter / REFRESH_LIMIT) % (shuffled_images.length)
      if (new_image_index !== image_index) {
         var newimg = new Image();
         newimg.src = this.url_from_index(new_image_index)
         const that = this
         newimg.onload = function () {
            that.setState({image_index: new_image_index})
         };
      }
      let new_x_scalar = x_scalar
      let new_y_scalar = y_scalar
      if (x_offset > max_x_offset || x_offset < 0) {
         new_x_scalar = -1 * x_scalar
      }
      if (y_offset > max_y_offset || y_offset < 0) {
         new_y_scalar = -1 * y_scalar
      }

      const letter_color = FractoUtil.fracto_pattern_color((refresh_counter % Math.pow(2, 10)) + 100, 1000000)
      let new_x_offset = x_offset + new_x_scalar
      let new_y_offset = y_offset + new_y_scalar
      this.setState({
         x_offset: new_x_offset,
         y_offset: new_y_offset,
         x_scalar: new_x_scalar,
         y_scalar: new_y_scalar,
         refresh_counter: refresh_counter + 1,
         letter_color
      })
   }

   gate_keeper = (e) => {
      const {show_info_box} = this.state
      const {on_start} = this.props;
      const {altKey, ctrlKey, shiftKey} = e
      if (altKey && ctrlKey && shiftKey) {
         on_start()
         return;
      }
      this.setState({show_info_box: !show_info_box})
   }

   render_info_box = () => {
      const {show_info_box, button_ref} = this.state
      if (!button_ref.current) {
         return []
      }
      const button_bounds = button_ref.current.getBoundingClientRect()
      const box_style = {
         top: `${button_bounds.bottom + 5}px`,
         left: `${button_bounds.left}px`,
         opacity: show_info_box ? 0.90 : 0
      }
      return <styles.InfoBox style={box_style}>
         <styles.PreambleText>{INTRO_TEXT}</styles.PreambleText>
      </styles.InfoBox>
   }

   render() {
      const {
         x_offset, y_offset, image_index, wrapper_ref, shuffled_images,
         letter_color, button_ref
      } = this.state
      let wrapper_style = {}
      if (shuffled_images.length) {
         const background_image = this.url_from_index(image_index)
         wrapper_style = {
            backgroundImage: `url(${background_image})`,
            backgroundPosition: `${-x_offset}px ${-y_offset}px`,
         }
      }
      const title_style = {color: letter_color}
      return <styles.Wrapper ref={wrapper_ref} style={wrapper_style}>
         <styles.TitleWrapper>
            <styles.Title style={title_style}>fracto</styles.Title>
            <styles.Button
               ref={button_ref}
               onClick={this.gate_keeper}>
               {'the atlas of chaos'}
            </styles.Button>
         </styles.TitleWrapper>
         {this.render_info_box()}
      </styles.Wrapper>
   }
}

export default PageWelcome
