import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompImagesStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       //overflow-y: scroll;
       padding: 0.5rem 0.5rem 0;
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

   static FocalPointLink = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
   `
   static LinkSpan = styled.span`
       ${CoolStyles.link}
       font-size: 1.125rem;
       opacity: 0.5;
       &:hover {
           opacity: 1.0;
       }
   `
   static ArtistName = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       font-size: 0.95rem;
       color: #888888;
   `
   static RefreshLink = styled(CoolStyles.Block)`
       ${CoolStyles.link}
       font-size: 1.125rem;
       margin-left: 0.5rem;
       opacity: 0.5;
       &:hover {
           opacity: 1.0;
       }
   `
}

export default CompImagesStyles
