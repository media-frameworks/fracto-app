import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompPatternStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       overflow: scroll;
       padding: 0.5rem 1rem;
   `
   static GraphWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0;
       background-color: #f8f8f8;
   `
   static SidebarWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0;
       background-color: #f8f8f8;
   `
   static InfoBlockWrapper = styled(CoolStyles.Block)`
       padding: 0.5rem 1rem;
   `
   static PatternBlockWrapper = styled(CoolStyles.InlineBlock)`
       font-size: 2rem;
   `
   static DescriptorWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic};
   `

   static InfoPrompt = styled(CoolStyles.Block)`
       ${CoolStyles.italic};
       ${CoolStyles.align_center};
       padding-top: 1rem;
       font-size: 1.125rem;
       font-weight: 400;
       color: #aaaaaa;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_left}
       margin-top: 0.5rem;
       border-bottom: 0.1rem solid #aaaaaa;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static PatternTypePrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.bold}
       ${CoolStyles.uppercase}
       ${CoolStyles.deep_blue_text}
       font-size: 1.125rem;
       margin-left: 0.25rem;
       margin-bottom: 0.25rem;
   `
   static InfoLine = styled(CoolStyles.Block)`
       ${CoolStyles.italic}
   `
}

export default CompPatternStyles
