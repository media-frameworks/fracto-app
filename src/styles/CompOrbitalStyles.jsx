import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompOrbitalStyles {
   static ContentWrapper = styled(CoolStyles.InlineBlock)`
      margin: 0.5rem 1rem;
   `
   static FamilySpanCanvas = styled.canvas`
       ${CoolStyles.pointer}
       margin: 1rem;
   `
}

export default CompOrbitalStyles
