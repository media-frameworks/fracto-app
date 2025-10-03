import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Utils from 'common/system/Utils'

import {PageAppStyles as styles} from 'styles/PageAppStyles'

const IMAGE_IDS = [
   '95155837', '70839740', '78689864', '88107978',
   '6645013', '16567422', '9868250', '13476002', '88328851', '21138857',
   '82719097', '2816809', '37777168', '7860868', '98124615',
   '51827304', '16827347', '96179357', '21738100',
   '90878904', '44650502', '57139333', '43132024', '37321005', '35019600',
   '84149541', '37690970', '67262443', '47995366', '44195606', '11142241',
   '46667733', '62112246',
]

const REFRESH_LIMIT = 1000
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
      shuffled_images: []
   }

   componentDidMount() {
      const interval = setInterval(this.update_background, REFRESH_CADENCE_MS)
      const shuffled_images = Utils.shuffle(IMAGE_IDS)
      this.setState({interval, shuffled_images})
   }

   update_background = () => {
      const {
         x_offset, y_offset, x_scalar, y_scalar,
         refresh_counter, wrapper_ref, shuffled_images
      } = this.state
      if (!wrapper_ref.current) {
         return
      }
      const bounds_rect = wrapper_ref.current.getBoundingClientRect()
      const max_x_offset = 4800 - bounds_rect.width
      const max_y_offset = 4800 - bounds_rect.height
      let new_image_index = Math.floor(refresh_counter / REFRESH_LIMIT) % (shuffled_images.length)
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
      const {x_offset, y_offset, image_index, wrapper_ref, shuffled_images} = this.state
      const {on_start} = this.props;
      let wrapper_style = {}
      if (shuffled_images.length) {
         const background_image =
            `https://mikehallstudio.s3.us-east-1.amazonaws.com/fracto/images/img_${shuffled_images.at(image_index)}.jpg`
         wrapper_style = {
            backgroundImage: `url(${background_image})`,
            backgroundPosition: `${-x_offset}px ${-y_offset}px`,
         }
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
