import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompPatternStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       padding: 0.5rem 1rem;
       overflow: hidden;
   `
   static GraphWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0.5rem 0.5rem 0 0;
       background-color: #fcfcfc;
       border: 0.12rem solid #aaaaaa;
       border-radius: 0.125rem;
       padding: 0.5rem;
       overflow: auto;
   `
   static ZoomerSheath = styled(CoolStyles.InlineBlock)`
       overflow: hidden;
       margin: 0;
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

   static AnimateButton = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.link}
   `
   static ZoomerWrapper = styled(CoolStyles.InlineBlock)`
       margin: 1rem 0.5rem 0 0;
   `
   static PatternPartsWrapper = styled(CoolStyles.Block)`
       overflow: hidden;
   `
}

export default CompPatternStyles
