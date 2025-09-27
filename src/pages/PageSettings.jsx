import {
   APP_KEYED_SETTINGS,
   TYPE_ARRAY,
   TYPE_BOOLEAN,
   TYPE_NUMBER,
   TYPE_OBJECT,
   TYPE_STRING
} from "../settings/AppSettings";
import {COMP_KEYED_SETTINGS} from "../settings/CompSettings";
import {PANE_KEYED_SETTINGS} from "../settings/PaneSettings";
import {IMAGE_KEYED_SETTINGS} from "../settings/ImageSettings";
import {LORE_KEYED_SETTINGS} from "../settings/LoreSettings";
import {BAILIWICK_KEYED_SETTINGS} from "../settings/BailiwickSettings";

export class PageSettings {

   static all_settings = {}

   static initialize = () => {
      PageSettings.all_settings = Object.assign(
         {},
         APP_KEYED_SETTINGS,
         COMP_KEYED_SETTINGS,
         PANE_KEYED_SETTINGS,
         IMAGE_KEYED_SETTINGS,
         LORE_KEYED_SETTINGS,
         BAILIWICK_KEYED_SETTINGS,
      )
      const page_settings_keys = Object.keys(PageSettings.all_settings)
      const page_settings = {}
      page_settings_keys.forEach(key => {
         if (PageSettings.all_settings[key].default_value) {
            page_settings[key] = PageSettings.all_settings[key].default_value
         } else {
            switch (PageSettings.all_settings[key].data_type) {
               case TYPE_STRING:
                  page_settings[key] = '~';
                  break
               case TYPE_NUMBER:
                  page_settings[key] = -1;
                  break
               case TYPE_OBJECT:
                  page_settings[key] = {};
                  break
               case TYPE_ARRAY:
                  page_settings[key] = [];
                  break
               case TYPE_BOOLEAN:
                  page_settings[key] = PageSettings.all_settings[key].default_value;
                  break
               default:
                  break;
            }
         }
      })
      PageSettings.load_settings(page_settings)
      // console.log('PageSettings.all_settings', PageSettings.all_settings)
      // console.log('page_settings', page_settings)
      return page_settings
   }

   static persist_settings = (new_settings) => {
      const all_new_keys = Object.keys(new_settings)
      all_new_keys.forEach(key => {
         const key_settings = PageSettings.all_settings[key]
         if (!key_settings) {
            // console.log('key setting not found', key)
            return
         }
         if (!key_settings.persist) {
            return
         }
         // console.log('persisting', key)
         switch (key_settings.data_type) {
            case TYPE_STRING:
               localStorage.setItem(key, new_settings[key])
               break
            case TYPE_NUMBER:
               localStorage.setItem(key, `${new_settings[key]}`)
               break
            case TYPE_OBJECT:
            case TYPE_ARRAY:
               localStorage.setItem(key, JSON.stringify(new_settings[key]))
               break
            default:
               console.log('persist_settings bad data_type', key_settings)
               break;
         }
      })
   }

   static load_settings = (page_settings) => {
      const persist_key_names = Object.keys(PageSettings.all_settings)
         .filter(key => PageSettings.all_settings[key].persist)
      persist_key_names.forEach(key => {
         const setting_str = localStorage.getItem(key)
         if (setting_str) {
            switch (PageSettings.all_settings[key].data_type) {
               case TYPE_STRING:
                  page_settings[key] = setting_str;
                  break;
               case TYPE_NUMBER:
                  page_settings[key] = parseFloat(setting_str);
                  break;
               case TYPE_OBJECT:
               case TYPE_ARRAY:
                  page_settings[key] = JSON.parse(setting_str);
                  break;
               default:
                  console.log('load_settings bad data_type', page_settings[key])
                  break;
            }
         }
      })
   }
}

export default PageSettings
