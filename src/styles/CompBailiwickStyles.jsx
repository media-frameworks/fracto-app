import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompBailiwickStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       overflow-x: hidden;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_left}
       padding: 0.25rem;
       margin: 0.5rem 0 1rem;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static SortTypePrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       ${CoolStyles.pointer}
       ${CoolStyles.uppercase}
       ${CoolStyles.deep_blue_text}
       font-size: 1.125rem;
       margin-left: 0.25rem;
       margin-bottom: 0.25rem;
   `

   static PatternWrapper = styled(CoolStyles.Block)`
       border-bottom: 0.25rem solid #dddddd;
   `
   static PatternBlockWrapper = styled(CoolStyles.InlineBlock)`
       margin-top: 0.5rem;
       overflow: hidden;
   `
   static PatternBailiwicksWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0;
   `
}

export default CompBailiwickStyles
