import styled from "styled-components";
import {CoolStyles} from 'common/ui/CoolImports'

export class CompScriptStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
       margin: 0;
       overflow: auto;
   `

   static ScriptNameSpan = styled(CoolStyles.InlineBlock)`
         ${CoolStyles.pointer}
   `

   static TreeWrapper = styled(CoolStyles.Block)`
      overflow: auto;
   `
}

export default CompScriptStyles
