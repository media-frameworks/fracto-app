import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EXIF from 'exif-js';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp} from '@fortawesome/free-regular-svg-icons';
import {faThumbsDown} from '@fortawesome/free-regular-svg-icons';
import {faShoePrints} from '@fortawesome/free-solid-svg-icons';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import StoreS3 from "common/system/StoreS3";
import {
   CELL_ALIGN_LEFT,
   CELL_ALIGN_CENTER,
   CELL_TYPE_NUMBER,
   CELL_TYPE_TEXT,
   CELL_TYPE_CALLBACK,
   CoolTable,
} from "common/ui/CoolTable";
import {
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "pages/settings/AppSettings";
import network from "common/config/network.json" with {type: "json"};
import {
   render_image,
   render_focal_point,
   render_scope,
   render_view,
   render_timeago
} from "./ImageUtils";

const FRACTO_PREFIX = 'fracto'
const LISTING_LENGTH = 20
const FRACTO_PROD = network["fracto-prod"];

const isValidJSON = (str) => {
   try {
      JSON.parse(str);
      return true;
   } catch (e) {
      return false;
   }
}

const IMAGE_LIST_COLUMNS = [
   {
      id: "name",
      label: "filename",
      type: CELL_TYPE_TEXT,
      style: {
         fontSize: '0.85rem',
         fontFamily: 'monospace'
      },
      width_px: 100,
      align: CELL_ALIGN_LEFT,
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
      id: "size",
      label: "size",
      type: CELL_TYPE_NUMBER,
      width_px: 80,
      align: CELL_ALIGN_LEFT,
   },
   {
      id: "dimension",
      label: "dimension",
      type: CELL_TYPE_TEXT,
      width_px: 80,
      style: {
         fontSize: '0.85rem',
         fontFamily: 'monospace'
      },
      align: CELL_ALIGN_CENTER,
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
      id: "go",
      label: "go",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
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
      id: "publish",
      label: "publish",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "artist",
      label: "artist",
      type: CELL_TYPE_TEXT,
      width_px: 80,
      align: CELL_ALIGN_CENTER,
   },
   {
      id: "archive",
      label: "archive",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
      align: CELL_ALIGN_CENTER,
   },
]
const THUMBNAIL_SIZE_PX = 350

const AXIOS_HEADERS = {
   'Content-Type': 'text/plain',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': '*',
   'Access-Control-Expose-Headers': 'Access-Control-*',
   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
}

export class ImagesStaging extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_files: [],
      selected_row: 0,
      visitor_email: 'unknown',
      visitor_name: 'unknown',
   }

   componentDidMount() {
      this.refresh_file_list()
      let visitor_email = 'unknown'
      let visitor_name = 'unknown'
      const visitor_str = localStorage.getItem('visitor')
      if (visitor_str) {
         const visitor = JSON.parse(visitor_str)
         visitor_email = visitor.email
         visitor_name = visitor.name
      }
      this.setState({visitor_name, visitor_email})
   }

   refresh_file_list = async () => {
      const root = `images`
      StoreS3.list_files_async(root, FRACTO_PREFIX, response => {
         console.log('list_files_async response', response);
         const all_files = response.Contents
            .sort((a, b) => a.LastModified < b.LastModified ? 1 : -1)
            .slice(0, LISTING_LENGTH)
         this.setState({all_files});
         setTimeout(this.collect_file_info, 100)
         setTimeout(this.collect_file_info, 500)
         setTimeout(this.collect_file_info, 1000)
      });
   }

   collect_file_info = async () => {
      const {all_files} = this.state;
      for (const file of all_files) {
         const key = file.Key.startsWith('/') ? file.Key.slice(1) : file.Key;
         StoreS3.load_image_async(key, '', (img) => {
            EXIF.getData(img, function () {
               const exifData = EXIF.getAllTags(this);
               if (isValidJSON(exifData.Software)) {
                  file.exifData = JSON.parse(exifData.Software);
               }
            });
         });
      }
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

   publish_image = async (exifData) => {
      const {visitor_name, visitor_email} = this.state
      const {focal_point, scope} = exifData
      const thumbnail_outcome = await render_image(
         focal_point, scope, THUMBNAIL_SIZE_PX, 'thumbnails')
      console.log('create_thumbnail thumbnail_outcome', thumbnail_outcome)
      exifData.thumbnail_url = thumbnail_outcome.data.public_url
      exifData.publisher_name = visitor_name
      exifData.publisher_email = visitor_email
      const url = `${FRACTO_PROD}/assets/publish.php?asset_type=image&asset_id=${exifData.image_id}`
      axios.post(url, JSON.stringify(exifData), {
         headers: AXIOS_HEADERS,
         mode: 'no-cors',
         crossdomain: true,
      })
   }

   render_publish = (exifData) => {
      const icon_style = {color: 'green'};
      return <styles.LinkSpan
         style={icon_style}
         title={'accept'}
         onClick={e => this.publish_image(exifData)}>
         <FontAwesomeIcon icon={faThumbsUp}/>
      </styles.LinkSpan>
   }

   render_archive = (id) => {
      const icon_style = {color: 'red'};
      return <styles.LinkSpan
         style={icon_style}
         title={'reject'}
         onClick={e => console.log('archive', id)}>
         <FontAwesomeIcon icon={faThumbsDown}/>
      </styles.LinkSpan>
   }

   render_image_list = (all_files) => {
      const table_data = all_files.map((file, i) => {
         const name = file.Key
            .replace('fracto/images/', '')
            .replace('.jpg', '')
         const asset_id = name.replace('img_', '')
         const exifData = JSON.parse(JSON.stringify(file.exifData || {}))
         exifData.asset_id = asset_id
         return {
            name,
            last_modified: [render_timeago, Date.parse(file.LastModified.toString())],
            size: file.Size,
            dimension: `${exifData.width_px || '-'}x${exifData.height_px || '-'}`,
            scope: [render_scope, exifData.scope],
            focal_point: [render_focal_point, exifData.focal_point],
            artist: <styles.ArtistName>{exifData.artist_name}</styles.ArtistName>,
            go: [this.render_go_to_there, {scope: exifData.scope, focal_point: exifData.focal_point}],
            url: [render_view, exifData.public_url],
            publish: [this.render_publish, exifData],
            archive: [this.render_archive, asset_id]
         }
      })
      return <CoolTable
         data={table_data}
         columns={IMAGE_LIST_COLUMNS}
      />;
   }

   render() {
      const {all_files} = this.state
      return [
         <styles.RefreshLink onClick={this.refresh_file_list}>refresh list</styles.RefreshLink>,
         <styles.ContentWrapper>
            {this.render_image_list(all_files)}
         </styles.ContentWrapper>
      ]
   }
}

export default ImagesStaging
