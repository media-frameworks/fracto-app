import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'
import CoolColors from "../common/ui/CoolColors";

export class CompFactoryStyles {
   static CompWrapper = styled(CoolStyles.Block)`
       margin: 0.5rem;
   `
   static ContentWrapper = styled(CoolStyles.Block)`
       margin: 0.125rem;
   `
   static TitleLink = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.noselect}
       ${CoolStyles.underline}
   `

   static DetectPrompt = styled(CoolStyles.Block)`
       margin: 0.5rem;
       ${CoolStyles.link}
   `

   static NumericLink = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.align_center}
       ${CoolStyles.monospace}
       ${CoolStyles.link}
       color: ${CoolColors.deep_blue} !important;
   `
   static Numeric = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.align_center}
       ${CoolStyles.monospace}
       cursor: default;
       color: #aaaaaa;
   `
}

export default CompFactoryStyles
