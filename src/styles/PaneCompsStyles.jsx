import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

const ROW_HEIGHT_PX = 15;

export class PaneCompsStyles {
   static TabsWrapper = styled(CoolStyles.Block)`
      padding: 0;
      background-color: #fcfcfc;
      overflow: auto;
   `
   static BinsWrapper = styled(CoolStyles.Block)`
      background-color: white;
      padding: 0.5rem 0.5rem;
      margin-left: 0.5rem;
   `
   static TableWrapper = styled(CoolStyles.Block)`
      margin-bottom: 0.5rem;
   `

   static ColorBarSegment = styled(CoolStyles.InlineBlock)`
      height: ${ROW_HEIGHT_PX}px;
      margin-bottom: 0.5rem;
   `;

   static OthersWrapper = styled(CoolStyles.Block)`
      background-color: white;
      margin: 0.25rem 0 0 1rem;
   `

   static OthersLabel = styled(CoolStyles.Block)`
      ${CoolStyles.italic}
      color: #444444;
      margin: 0.25rem 0 0.25rem 0;
      font-size: 0.85rem;
   `;

   static ColorBlockWrapper = styled(CoolStyles.InlineBlock)`
      ${CoolStyles.noselect}
      margin-right: 0.5rem;
      margin-bottom: 0.25rem;
   `;

   static OrbitalsPrompt = styled(CoolStyles.Block)`
       ${CoolStyles.italic}
       ${CoolStyles.align_center}
      color: #888888;
       margin-top: 1rem;
      font-size: 1.125rem;
   `;

}

export default PaneCompsStyles
