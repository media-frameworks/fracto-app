import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompFactoryStyles {
   static CompWrapper = styled(CoolStyles.Block)`
       margin: 0.5rem;
   `
   static ContentWrapper = styled(CoolStyles.Block)`
       margin: 0.125rem;
   `
   static TitleLink = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.noselect}
       ${CoolStyles.underline}
   `

   static DetectPrompt = styled(CoolStyles.Block)`
       margin: 0.5rem;
       ${CoolStyles.link}
   `
}

export default CompFactoryStyles
