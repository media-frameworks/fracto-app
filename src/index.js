import React from 'react';
import ReactDOM from 'react-dom/client';

import PageMain from "pages/PageMain.jsx";
import FractoIndexedTilesLoader from "./fracto/FractoIndexedTilesLoader.jsx";
import google_creds from "../src/common/config/google.json" with {type: "json"}

import googleOneTap from 'google-one-tap';
import AppWelcome from "./app/AppWelcome";

const options = {
   client_id: google_creds.google_client_id, // required
   auto_select: false, // optional
   cancel_on_tap_outside: false, // optional
   context: 'signin', // optional
};

const APP_NAME = 'FRACTO'
const root = ReactDOM.createRoot(document.getElementById('root'));

let one_tap_data = null

const on_start = () => {
   if (!one_tap_data) {
      return;
   }
   const page_main = <PageMain
      key={'page-main'}
      app_name={APP_NAME}
      one_tap_data={one_tap_data}
   />
   root.render(
      <FractoIndexedTilesLoader
         app_name={APP_NAME}
         app_page={[page_main]}
      />
   );
}

googleOneTap(options, (response) => {
   const idToken = response.credential;
   one_tap_data = JSON.parse(atob(idToken.split('.')[1])); // Decode the payload part of the JWT
   on_start()
});

root.render(<AppWelcome
   onStart={on_start}
   can_start_now={one_tap_data !== null}
/>)

