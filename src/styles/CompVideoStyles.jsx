import styled from "styled-components";
import {CoolColors, CoolStyles} from '../common/ui/CoolImports'

export class CompVideoStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       //overflow-y: scroll;
       padding: 0.5rem 0.5rem 0;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 0.5rem;
   `
   static SectionWrapper = styled(CoolStyles.Block)`
       margin: 0.5rem;
   `
   static NewButton = styled(CoolStyles.Block)`
       margin: 0.5rem;
   `
   static RegularPrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       color: #888888;
       font-size: 1.125rem;
       margin-right: 0.5rem;
   `;
   static IconWrapper = styled(CoolStyles.InlineBlock)`
       color: #aaaaaa;
       margin-right: 0.5rem;
       :hover&{
           color: ${CoolColors.cool_blue}
       }
   `

}

export default CompVideoStyles
