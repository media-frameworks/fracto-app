import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class TileDetailStyles {

   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       font-family: Arial, Helvetica, sans-serif;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static ContextTitle = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       ${CoolStyles.uppercase}
       color: #888888;
       font-size: 0.75rem;
       letter-spacing: 0.1rem;
   `
   static LevelSpan = styled.span`
       ${CoolStyles.uppercase}
       ${CoolStyles.monospace}
       ${CoolStyles.narrow_text_shadow}
       background-color: #aaaaaa;
       color: white;
       border: 0.1rem solid #666666;
       border-radius: 0.125rem;
       padding: 0 0.25rem;
       font-size: 1rem;
       letter-spacing: 0.125rem;
   `
   static LevelInfoBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       margin-top: 0.5rem;
   `
   static InfoText = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       margin-left: 0.5rem;
       color: #aaaaaa;
       font-size: 1.125rem;
   `
   static BigScope = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       margin-left: 0.5rem;
       color: #aaaaaa;
       font-size: 1.5rem;
   `
   static StatValue = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       font-size: 0.95rem;
       color: black;
       vertical-align: text-bottom;
       line-height: 1.125rem;
   `;

   static BigStatValue = styled(TileDetailStyles.StatValue)`
       ${CoolStyles.align_center}
       font-size: 1.25rem;
   `
   static ShortCodeSpan = styled(CoolStyles.Block)`
       ${CoolStyles.monospace}
       ${CoolStyles.deep_blue_text}
       ${CoolStyles.align_center}
       font-size: 2.5rem;
       margin-top: 0.5rem;
   `
   static AttributeLabel = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       ${CoolStyles.align_right}
       color: #888888;
       width: 100px;
       font-size: 1.125rem;
       padding-right: 0.25rem;
   `
   static AttributeContent = styled(CoolStyles.InlineBlock)`
       overflow: hidden;
       word-break: break-word;
       width: fit-content;
   `
   static ModalWrapper = styled(CoolStyles.Block)`
       padding: 0.5rem;
   `

}

export default TileDetailStyles
