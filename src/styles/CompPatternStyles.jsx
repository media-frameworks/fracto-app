import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompPatternStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
      padding: 0.5rem 1rem;
   `
   static InfoBlockWrapper = styled(CoolStyles.Block)`
       padding: 0.5rem 1rem;
   `
   static PatternBlockWrapper = styled(CoolStyles.InlineBlock)`
       font-size: 2rem;
   `
   static InfoPrompt = styled(CoolStyles.Block)`
       ${CoolStyles.italic};
       ${CoolStyles.align_center};
       padding-top: 1rem;
       font-size: 1.125rem;
       font-weight: 400;
       color: #aaaaaa;
   `
}

export default CompPatternStyles
