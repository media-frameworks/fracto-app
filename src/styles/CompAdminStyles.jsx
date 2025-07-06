import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompAdminStyles {
   static   ContentWrapper = styled(CoolStyles.Block)`
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
   static InspectorPrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       ${CoolStyles.align_middle}
       line-height: 1.5rem;
   `
   static GoLink = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       ${CoolStyles.uppercase}
       ${CoolStyles.bold}
       ${CoolStyles.align_middle}
       ${CoolStyles.pointer}
       font-size: 1.125rem;
       background-color: #888888;
       border: 1px solid #444444;
       border-radius: 0.25rem;
       padding: 0.125rem 0.5rem;
       color: white;
       letter-spacing: 0.15rem;
   `
}

export default CompAdminStyles
