import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoePrints} from '@fortawesome/free-solid-svg-icons';

import network from "common/config/network.json" with {type: "json"};
import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import {
   CELL_ALIGN_LEFT,
   CELL_ALIGN_CENTER,
   CELL_TYPE_TEXT,
   CELL_TYPE_CALLBACK,
   CoolTable,
} from "common/ui/CoolTable";
import {
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import {GALLERY_4800_PX_IMAGE_IDS} from "assets/AssetImages";
import {
   render_focal_point,
   render_scope,
   render_view,
   render_timeago
} from "./ImageUtils";
import {NumberSpan} from "../../../../fracto/styles/FractoStyles";

const FRACTO_PROD = `${network["fracto-prod"]}`;

const GALLERY_LIST_COLUMNS = [
   {
      id: "id",
      label: "id",
      type: CELL_TYPE_CALLBACK,
      style: {
         fontSize: '0.85rem',
         fontFamily: 'monospace'
      },
      width_px: 80,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "last_modified",
      label: "created",
      type: CELL_TYPE_CALLBACK,
      style: {
         fontSize: '1.0rem',
         fontStyle: 'italic',
         color: '#888888'
      },
      width_px: 100,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "scope",
      label: "scope",
      type: CELL_TYPE_CALLBACK,
      style: {
         fontSize: '0.85rem',
         fontFamily: 'monospace'
      },
      width_px: 80,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "focal_point",
      label: "focal point",
      type: CELL_TYPE_CALLBACK,
      width_px: 250,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "url",
      label: "view",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "go",
      label: "go",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
      align: CELL_ALIGN_CENTER,
   },
]

const AXIOS_CONFIG = {
   headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Access-Control-*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   },
   mode: 'no-cors',
   crossdomain: true,
}

export class ImagesGallery extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_images: {},
      selected_row: 0,
   }

   componentDidMount() {
      this.refresh_image_list()
   }

   refresh_image_list = async () => {
      GALLERY_4800_PX_IMAGE_IDS.forEach((id, i) => {
         setTimeout(() => {
            this.load_image_data(id)
         }, 20 * i)
      })
   }

   load_image_data = async (id) => {
      const {all_images} = this.state
      const url = `${FRACTO_PROD}/assets/image/info_${id}.json`
      const image_data = await fetch(url).then(res => res.json())
      image_data.meta = JSON.parse(image_data.Software)
      delete image_data.Software
      const image_key = this.image_key(id)
      all_images[image_key] = image_data
      this.setState(all_images)
   }

   image_key = (id) => {
      return `image_${id}`
   }

   on_select_row = (selected_row) => {
      console.log('selected_row', selected_row)
      this.setState({selected_row})
   }

   go_to_there = (fracto_values) => {
      const {on_settings_changed} = this.props;
      on_settings_changed({
         [KEY_FOCAL_POINT]: fracto_values.focal_point,
         [KEY_SCOPE]: fracto_values.scope,
         [KEY_DISABLED]: true
      })
   }

   render_go_to_there = (fracto_values) => {
      const icon_style = {color: 'black'};
      return <styles.LinkSpan
         style={icon_style}
         title={'go to there'}
         onClick={e => this.go_to_there(fracto_values)}>
         <FontAwesomeIcon icon={faShoePrints}/>
      </styles.LinkSpan>
   }

   render_id = (id) => {
      return <NumberSpan>{id}</NumberSpan>
   }

   render_image_list = () => {
      const {all_images} = this.state
      const table_data = GALLERY_4800_PX_IMAGE_IDS.map(id => {
         const image_key = this.image_key(id)
         const image_data = all_images[image_key]
         if (!image_data) {
            return {id: [this.render_id, id]}
         }
         console.log('image_data', image_data)
         return {
            id: [this.render_id, id],
            last_modified: [render_timeago, new Date(image_data.meta.created)],
            scope: [render_scope, image_data.meta.scope],
            focal_point: [render_focal_point, image_data.meta.focal_point],
            go: [this.render_go_to_there, {
               scope: image_data.meta.scope,
               focal_point: image_data.meta.focal_point
            }],
            url: [render_view, image_data.meta.public_url],
            sort_by: image_data.meta.created,
         }
      }).sort((a, b) => {
         return b.sort_by - a.sort_by
      })
      return <CoolTable
         data={table_data}
         columns={GALLERY_LIST_COLUMNS}
      />;
   }

   render() {
      const {all_files} = this.state
      return [
         <styles.RefreshLink onClick={this.refresh_file_list}>refresh list</styles.RefreshLink>,
         <styles.ContentWrapper>
            {this.render_image_list()}
         </styles.ContentWrapper>
      ]
   }
}

export default ImagesGallery
