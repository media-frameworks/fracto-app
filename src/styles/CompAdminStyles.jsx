import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompAdminStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       //overflow-y: scroll;
       padding: 0.5rem 1rem;
       //background-color: lightseagreen;
   `
   static TileBlockWrapper = styled(CoolStyles.InlineBlock)`
       padding: 0;
   `
   static DateWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       color: #aaaaaa;
       font-size: 0.85rem;
       line-height: 1rem;
       margin-bottom: 0.75rem;
   `
   static PreambleWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.align_left};
       ${CoolStyles.italic}
       color: #aaaaaa;
       font-size: 1.25rem;
       margin-left: 0.5rem;
   `
   static SubPreambleWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.bold}
       ${CoolStyles.underline}
       ${CoolStyles.align_center}
       color: #444444;
       font-size: 0.95rem;
       margin-left: 0.5rem;
       margin-bottom: 1.0rem;
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

export default CompAdminStyles
