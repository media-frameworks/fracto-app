import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export const HEADER_HEIGHT_PX = 24

export class PaneStepsStyles {
   static HeaderWrapper = styled(CoolStyles.Block)`
       padding: 0;
       border-bottom: 1px solid black;
       background: linear-gradient(70deg, #999999, #eeeeee);
   `
   static StepsListWrapper = styled(CoolStyles.InlineBlock)`
      height: 100%;
      overflow-y: scroll;   
      padding: 0;
   `
   static StepsWrapper = styled(CoolStyles.InlineBlock)`
       background: linear-gradient(70deg, #999999, #eeeeee);
       height: 100%;
   `
   static StepFrame = styled(CoolStyles.Block)`
      background-color: #f8f8f8;
      border: 0.1rem solid #666666;
      margin: 2px;
   `;
}

export default PaneStepsStyles
