import React from 'react';
import ReactDOM from 'react-dom/client';
import google_creds from "../src/common/config/google.json" with {type: "json"}

import PageMain from "pages/PageMain.jsx";
import FractoIndexedTilesLoader from "./fracto/FractoIndexedTilesLoader.jsx";

import PageWelcome from "./pages/PageWelcome";

const googleScript = document.createElement("script");
googleScript.src = "https://accounts.google.com/gsi/client";
googleScript.async = true;
googleScript.defer = true;
googleScript.crossorigin="*"
document.head.appendChild(googleScript);

const root = ReactDOM.createRoot(document.getElementById('root'));

let one_tap_data = {}

const APP_NAME = 'FRACTO'
const launch_app = () => {
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
root.render(<PageWelcome on_start={launch_app}/>) // or on_start for one-tap

const on_start = () => {
   const callback = (response) => {
      const idToken = response.credential;
      one_tap_data = JSON.parse(atob(idToken.split('.')[1])); // Decode the payload part of the JWT
      launch_app()
   }
   const options = {
      client_id: google_creds.google_client_id, // required
      auto_select: false, // optional
      cancel_on_tap_outside: false, // optional
      context: 'use', // optional
   };
   window.google.accounts.id.initialize({
      client_id: options.client_id,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: 'signin',

   });
   window.google.accounts.id.prompt();
}

