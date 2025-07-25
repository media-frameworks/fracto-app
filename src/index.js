import React from 'react';
import ReactDOM from 'react-dom/client';

import PageMain from "pages/PageMain.jsx";
import FractoIndexedTilesLoader from "./fracto/FractoIndexedTilesLoader.jsx";
import AppLoginPage from "./common/app/AppLoginPage.jsx";

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
