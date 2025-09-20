import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CompImagesStyles as styles} from 'styles/CompImagesStyles'
import StoreS3 from "common/system/StoreS3";

const FRACTO_PREFIX = 'fracto'

export class ImagesGallery extends Component {
   static propTypes = {
      page_settings: PropTypes.object.isRequired,
      on_settings_changed: PropTypes.func.isRequired,
   }

   state = {
      all_files: []
   }

   componentDidMount() {
      this.refresh_file_list()
   }

   refresh_file_list = async () => {
      const root = `images`
      StoreS3.list_files_async(root, FRACTO_PREFIX, all_files => {
         console.log('all_files', all_files);
         this.setState({all_files: all_files.Contents});
      });
   }

   render_image_list = () => {
      const {all_files} = this.state
      return all_files
         .sort((a, b) => a.LastModified < b.LastModified ? 1 : -1)
         .map((file, i) => {
            return <styles.ImageFieldWrapper key={`image-${i}`}>
               {file.Key} {file.LastModified.toString()} {file.Size}
            </styles.ImageFieldWrapper>
         })
   }

   render() {
      return <styles.ContentWrapper>
         {this.render_image_list()}
      </styles.ContentWrapper>
   }
}

export default ImagesGallery
