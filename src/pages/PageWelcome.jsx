import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Utils from 'common/system/Utils'

import {PageAppStyles as styles} from 'styles/PageAppStyles'
import FractoUtil from "../fracto/FractoUtil";

const IMAGE_IDS = [
   '95155837', '88107978', '55733655', '56297934', '45661276', '21602856',
   '6645013', '16567422', '13476002', '88328851', '27267420', '14959701',
   '82719097', '2816809', '37777168', '7860868', '98124615', '29273549',
   '16827347', '96179357', '21738100', '58005872', '73345599', '72949085',
   '90878904', '44650502', '57139333', '43132024', '37321005', '35019600',
   '84149541', '37690970', '67262443', '47995366', '44195606', '11142241',
   '46667733', '62112246', '69229820', '96137524', '45730188', '3067009',
   '80370734', '69150513', '52193880', '84501123', '16802054', '40363462',
   '1827601', '43385256', '50410062', '94629549', '96745497', '8108962',
   '51856189', '91088336', '34910383', '87741832', '13228412', '31992546',
   '6240099', '16911405', '26815847', '53261124', '3692577', '91708010',
   '45304102', '58856345', '89333963', '79338781', '97621995', '16769148',
   '54062228', '54864480'
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
      shuffled_images: [],
      letter_color: 'white',
   }

   componentDidMount() {
      const interval = setInterval(this.update_background, REFRESH_CADENCE_MS)
      const shuffled_images = Utils.shuffle(IMAGE_IDS)
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

   render() {
      const {
         x_offset, y_offset, image_index, wrapper_ref, shuffled_images,
         letter_color
      } = this.state
      const {on_start} = this.props;
      let wrapper_style = {}
      if (shuffled_images.length) {
         const background_image = this.url_from_index(image_index)
         wrapper_style = {
            backgroundImage: `url(${background_image})`,
            backgroundPosition: `${-x_offset}px ${-y_offset}px`,
         }
      }
      const title_style = {color:letter_color}
      return <styles.Wrapper ref={wrapper_ref} style={wrapper_style}>
         <styles.Title style={title_style}>fracto</styles.Title>
         <styles.Button
            onClick={on_start}>
            {'i want to go to there'}
         </styles.Button>
      </styles.Wrapper>
   }
}

export default PageWelcome
