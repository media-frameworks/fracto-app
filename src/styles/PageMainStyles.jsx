import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class PageMainStyles {
   static LeftPaneWrapper = styled(CoolStyles.Block)`
      background-color: lightblue;
   `
   static UpperPaneWrapper = styled(CoolStyles.InlineBlock)`
      background-color: lightgreen;
   `
   static PanelWrapper = styled(CoolStyles.Block)`
      padding: 0;
   `
}

export default PageMainStyles
