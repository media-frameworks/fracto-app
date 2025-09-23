import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EXIF from 'exif-js';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {faThumbsUp} from '@fortawesome/free-regular-svg-icons';
import {faThumbsDown} from '@fortawesome/free-regular-svg-icons';
import {faShoePrints} from '@fortawesome/free-solid-svg-icons';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import StoreS3 from "common/system/StoreS3";
import ReactTimeAgo from "react-time-ago";
import {
   CELL_ALIGN_LEFT,
   CELL_ALIGN_CENTER,
   CELL_TYPE_NUMBER,
   CELL_TYPE_TEXT,
   CELL_TYPE_CALLBACK,
   CoolTable,
} from "common/ui/CoolTable";
import {render_coordinates} from "fracto/styles/FractoStyles";
import {
   KEY_DISABLED,
   KEY_FOCAL_POINT,
   KEY_SCOPE
} from "settings/AppSettings";
import network from "common/config/network.json" with {type: "json"};

const FRACTO_PREFIX = 'fracto'
const LISTING_LENGTH = 10
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
      type: CELL_TYPE_TEXT,
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
      id: "archive",
      label: "archive",
      type: CELL_TYPE_CALLBACK,
      width_px: 50,
      align: CELL_ALIGN_CENTER,
   },
]

export class ImagesStaging extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_files: [],
      selected_row: 0,
   }

   componentDidMount() {
      this.refresh_file_list()
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

   render_focal_point = (focal_point) => {
      return focal_point
         ? render_coordinates(focal_point.x, focal_point.y, 9)
         : '-'
   }

   render_scope = (scope) => {
      const rounded = Math.round(scope * 100000000) / 100
      const mu = <i>{'\u03BC'}</i>
      return scope
         ? <div title={`${scope}`}>{rounded}{mu}</div>
         : '-'
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

   render_view = (url) => {
      const icon_style = {color: 'darkcyan'};
      return <styles.LinkSpan
         style={icon_style}
         title={'view in tab'}
         onClick={e =>
            window.open(url, '_blank', 'noopener,noreferrer')
         }>
         <FontAwesomeIcon icon={faEye}/>
      </styles.LinkSpan>
   }

   publish_image = (exifData) => {
      const url = `${FRACTO_PROD}/assets/publish.php?asset_type=image&asset_id=${exifData.image_id}`
      axios.post(url, JSON.stringify(exifData), {
         headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Expose-Headers': 'Access-Control-*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
         },
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
         const image_id = name.replace('img_', '')
         const last_modified = <ReactTimeAgo date={Date.parse(file.LastModified.toString())}/>;
         const exifData = JSON.parse(JSON.stringify(file.exifData || {}))
         exifData.image_id = image_id
         return {
            name, last_modified,
            size: file.Size,
            dimension: `${exifData.width_px || '-'}x${exifData.height_px || '-'}`,
            scope: [this.render_scope, exifData.scope],
            focal_point: [this.render_focal_point, exifData.focal_point],
            go: [this.render_go_to_there, {scope: exifData.scope, focal_point: exifData.focal_point}],
            url: [this.render_view, exifData.public_url],
            publish: [this.render_publish, exifData],
            archive: [this.render_archive, image_id]
         }
      })
      return <CoolTable
         data={table_data}
         columns={IMAGE_LIST_COLUMNS}
      />;
   }

   render() {
      const {all_files} = this.state
      return <styles.ContentWrapper>
         {this.render_image_list(all_files)}
      </styles.ContentWrapper>
   }
}

export default ImagesStaging
