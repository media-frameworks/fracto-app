import React from 'react';
import ReactDOM from 'react-dom/client';

import PageMain from "pages/PageMain.jsx";
import FractoIndexedTilesLoader from "./fracto/FractoIndexedTilesLoader.jsx";
import AppLoginPage from "./common/app/AppLoginPage.jsx";
import google_creds from "../src/common/config/google.json" with {type: "json"}

import googleOneTap from 'google-one-tap';

const options = {
   client_id: google_creds.google_client_id, // required
   auto_select: false, // optional
   cancel_on_tap_outside: false, // optional
   context: 'signin', // optional
};

console.log('options', options)
googleOneTap(options, (response) => {
   // Send response to server
   const idToken = response.credential;
   const decodedToken = JSON.parse(atob(idToken.split('.')[1])); // Decode the payload part of the JWT
   const userEmail = decodedToken.email;

   console.log("decodedToken", decodedToken);
   run_root(decodedToken);
});

const run_root = (decodedToken) => {
   const APP_NAME = 'FRACTO'
   const root = ReactDOM.createRoot(document.getElementById('root'));
   const logged_in = localStorage.getItem('logged_in');
   if (!logged_in) {
      const page_main = <PageMain key={'page-main'} app_name={APP_NAME}/>
      root.render(
         <FractoIndexedTilesLoader
            app_name={APP_NAME}
            app_page={[page_main]}
         />
      );
   } else {
      root.render(<AppLoginPage />)
   }
}
