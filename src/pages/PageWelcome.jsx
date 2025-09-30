import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PageAppStyles as styles} from 'styles/PageAppStyles'

const IMAGE_IDS = [
   '37524097',
   '21320925',
   '90529904',
   '83192932',
   '78803193',
   '78294937',
   '37535430',
   '98567092',
   '8526479',
   '53153811',
]

const REFRESH_LIMIT = 1000
const REFRESH_CADENCE_MS = 15

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
   }

   componentDidMount() {
      const interval = setInterval(this.update_background, REFRESH_CADENCE_MS)
      this.setState({interval})
   }

   update_background = () => {
      const {x_offset, y_offset, x_scalar, y_scalar, refresh_counter, wrapper_ref} = this.state
      if (!wrapper_ref.current) {
         return
      }
      const bounds_rect = wrapper_ref.current.getBoundingClientRect()
      const max_x_offset = 2400 - bounds_rect.width
      const max_y_offset = 2400 - bounds_rect.height
      let new_image_index = Math.floor(refresh_counter / REFRESH_LIMIT) % (IMAGE_IDS.length)
      let new_x_scalar = x_scalar
      let new_y_scalar = y_scalar
      if (x_offset > max_x_offset || x_offset < 0) {
         new_x_scalar = -1 * x_scalar
      }
      if (y_offset > max_y_offset || y_offset < 0) {
         new_y_scalar = -1 * y_scalar
      }

      let new_x_offset = x_offset + new_x_scalar
      let new_y_offset = y_offset + new_y_scalar
      this.setState({
         x_offset: new_x_offset,
         y_offset: new_y_offset,
         x_scalar: new_x_scalar,
         y_scalar: new_y_scalar,
         refresh_counter: refresh_counter + 1,
         image_index: new_image_index,
      })
   }

   render() {
      const {x_offset, y_offset, image_index, wrapper_ref} = this.state
      const {on_start} = this.props;
      const background_image =
         `https://mikehallstudio.s3.us-east-1.amazonaws.com/fracto/images/img_${IMAGE_IDS.at(image_index)}.jpg`
      const wrapper_style = {
         backgroundImage: `url(${background_image})`,
         backgroundPosition: `${-x_offset}px ${-y_offset}px`,
      }
      return <styles.Wrapper ref={wrapper_ref} style={wrapper_style}>
         <styles.Title>Welcome to Fracto!</styles.Title>
         <styles.Button
            onClick={on_start}>
            {'Start Now'}
         </styles.Button>
      </styles.Wrapper>
   }
}

export default PageWelcome
