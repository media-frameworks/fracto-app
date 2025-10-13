import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Utils from 'common/system/Utils'

import {PageAppStyles as styles} from 'styles/PageAppStyles'
import FractoUtil from "../fracto/FractoUtil";

const IMAGE_IDS = [
   '95155837', '56297934', '45661276', '16567422', '13476002', '72082776',
   '14959701', '82719097', '2816809', '7860868', '98124615', '29273549',
   '16827347', '21738100', '58005872', '85226101', '85940165', '57139333',
   '43132024', '37321005', '35019600', '46057337', '84149541', '37690970',
   '47995366', '44195606', '11142241', '46667733', '62112246', '69229820',
   '45730188', '80448293', '69150513', '52193880', '84501123', '40363462',
   '96124484', '43385256', '8108962', '38680839', '51856189', '91088336',
   '87741832', '13228412', '6240099', '3692577', '91708010', '45304102',
   '58856345', '89333963', '79338781', '97621995', '16769148', '54062228',
   '46703024', '39272379', '45523452', '54864480', '69842272', '754765',
   '78074322', '55826367', '5815562', '10486308', '17009909', '32594692',
   '58809772', '68716298', '35297106', '21936941', '47409786', '61126242',
   '84439491', '66707507', '94380108', '71000225', '53585866', '89766144',
   '7124728', '62389736', '18216961', '95433659', '78434859', '6346848',
   '48290345', '21412321', '36599633', '13141003', '9743521', '97323782',
   '48720546', '64650446', '36524973', '30152997', '76258252', '54849817',
   '36101233', '15865180', '99751399', '68421153', '65605163', '54589802',
   '4081835', '88043015', '1098147', '97733876', '99608652', '83423333',
   '94341716', '75127839', '27464453', '21085604', '31894400', '14195694',
   '43853259', '48686005', '79676268', '30710625', '34363792', '16070237',
   '47330115', '4017788', '23110417', '92381287', '69080310', '99529107',
   '91247161', '4204227', '13902593', '87401778', '54421662'
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
      const {show_info_box,button_ref} = this.state
      if (!button_ref.current) {
         return []
      }
      const button_bounds = button_ref.current.getBoundingClientRect()
      const box_style = {
         top : `${button_bounds.bottom + 5}px`,
         left : `${button_bounds.left}px`,
         opacity: show_info_box ? 0.85 : 0
      }
      return <styles.InfoBox style={box_style}>i want to go to there</styles.InfoBox>
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
