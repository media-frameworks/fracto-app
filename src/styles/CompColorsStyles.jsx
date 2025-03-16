import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompColorsStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
      padding: 0.5rem;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_left}
       margin-top: 0.5rem;
       border-bottom: 0.1rem solid #aaaaaa;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static LitPrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.bold}
       ${CoolStyles.uppercase}
       ${CoolStyles.deep_blue_text}
       font-size: 1.125rem;
       margin-left: 0.25rem;
       margin-bottom: 0.25rem;
   `
}

export default CompColorsStyles
