import React from "react";
import {CompLoreStyles as styles} from 'styles/CompLoreStyles'
import {CoolStyles} from "common/ui/CoolImports";

export const render_comp_modes = (mode_spec, mode_key, page_settings, on_settings_changed) => {
   const image_mode = page_settings[mode_key] || mode_spec[0].key
   const deselected_style = {color: '#aaaaaa', fontWeight: 400, fontSize: '14px'};
   const all_modes = mode_spec.map(mode => {
      return <CoolStyles.InlineBlock onClick={() => on_settings_changed({[mode_key]: mode.key})}>
         {[
            <input type={"radio"} checked={image_mode === mode.key}/>,
            <styles.PatternTypePrompt
               style={image_mode !== mode.key ? deselected_style : {}}>
               {mode.label}
            </styles.PatternTypePrompt>,
            <styles.Spacer/>
         ]}
      </CoolStyles.InlineBlock>
   })
   return <styles.ModesBlock>{all_modes}</styles.ModesBlock>
}