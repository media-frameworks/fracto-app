import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompImagesStyles {
   static   ContentWrapper = styled(CoolStyles.Block)`
       //overflow-y: scroll;
       padding: 1rem 0.5rem 0;
       //background-color: lightseagreen;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_left}
       margin-bottom: 0.5rem;
   `
   static PatternTypePrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.bold}
       ${CoolStyles.uppercase}
       ${CoolStyles.deep_blue_text}
       font-size: 1rem;
       margin-left: 0.25rem;
       margin-bottom: 0.25rem;
   `
   static ImageFieldWrapper = styled(CoolStyles.Block)`
       //overflow-y: scroll;
       margin: 0;
       padding: 0;
       //background-color: lightseagreen;
   `
   static StatusLine = styled(CoolStyles.Block)`
       ${CoolStyles.monospace}
       margin: 0.5rem 1rem;
   `
}

export default CompImagesStyles
