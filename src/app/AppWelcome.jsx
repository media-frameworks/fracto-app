import React from 'react';

import {PageAppStyles as styles} from 'styles/PageAppStyles'

const AppWelcome = ({onStart, can_start_now}) => (
   <styles.Wrapper>
      <styles.Title>Welcome to Fracto!</styles.Title>
      <styles.Button
         style={{opacity: can_start_now ? 1.0 : 0.5}}
         onClick={can_start_now ? onStart : null}>
         {can_start_now ? 'Start Now' : 'Sign In to Continue'}
      </styles.Button>
   </styles.Wrapper>
);

export default AppWelcome;
