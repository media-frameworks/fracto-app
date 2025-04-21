import {
   TYPE_ARRAY,
   TYPE_NUMBER,
   TYPE_OBJECT,
   TYPE_STRING
} from "../pages/PageSettings";

export const KEY_SCRIPT_FILEPATH = 'script_filepath'

const ALL_KEYS_MAP = {
   [KEY_SCRIPT_FILEPATH]: {data_type: TYPE_STRING, persist: true},
}

export class ScriptSettings {

   static persist_settings = (new_settings) => {
      const all_new_keys = Object.keys(new_settings)
      const persist_keys = Object.keys(PERSIST_KEYS_MAP)
      persist_keys.forEach(key => {
         if (all_new_keys.includes(key)) {
            if (typeof new_settings[key] === 'string') {
               localStorage.setItem(key, new_settings[key])
            } else if (typeof new_settings[key] === 'number') {
               localStorage.setItem(key, `${new_settings[key]}`)
            } else if (typeof new_settings[key] === 'object') {
               localStorage.setItem(key, JSON.stringify(new_settings[key]))
            } else if (Array.isArray(new_settings[key])) {
               localStorage.setItem(key, JSON.stringify(new_settings[key]))
            }
         }
      })
   }

   static load_settings = (page_settings) => {
      const persist_key_names = Object.keys(PERSIST_KEYS_MAP)
      persist_key_names.forEach(key => {
         const setting_str = localStorage.getItem(key)
         if (setting_str) {
            switch (PERSIST_KEYS_MAP[key]) {
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
                  break;
            }
         }
      })
   }
}

export default ScriptSettings