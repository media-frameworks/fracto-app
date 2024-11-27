import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class PaneFieldStyles {
   static HeaderWrapper = styled(CoolStyles.Block)`
      padding: 0;
      border-bottom: 1px solid black;
      background-color: yellow;
   `
   static ImageWrapper = styled(CoolStyles.InlineBlock)`
      padding: 0;
      text-align: center;
      vertical-align: middle ;
   `
}

export default PaneFieldStyles
