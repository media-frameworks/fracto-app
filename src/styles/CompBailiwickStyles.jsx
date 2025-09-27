import styled from "styled-components";
import {CoolColors, CoolStyles} from '../common/ui/CoolImports'

export class CompBailiwickStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       overflow-x: hidden;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_left}
       padding: 0.25rem;
       margin: 1rem 0;
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
   static BailiwickModes = styled(CoolStyles.Block)`
      margin: 0.5rem;
   `
   static BailiwicksContent = styled(CoolStyles.Block)`
       margin: 0.5rem;
   `
   static NameSpan = styled.span`
       ${CoolStyles.monospace}
       font-size: 0.85rem;
   `
   static TimeAgoText = styled.span`
       ${CoolStyles.italic}
       font-size: 0.85rem;
       color: #888888;
   `
   static LinkSpan = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.noselect}
       ${CoolStyles.italic}
       color: ${CoolColors.cool_blue}
       opacity: 0.25 !important;
       :hover& {
           opacity: 1;
       }
   `;

}

export default CompBailiwickStyles
