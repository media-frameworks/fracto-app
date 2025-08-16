import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompTestStyles {
   static   ContentWrapper = styled(CoolStyles.Block)`
       //overflow-y: scroll;
       padding: 0.5rem 1rem;
       //background-color: lightseagreen;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_left}
       border-bottom: 0.1rem solid #aaaaaa;
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
}

export default CompTestStyles
