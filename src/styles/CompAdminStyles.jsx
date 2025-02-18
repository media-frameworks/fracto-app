import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompAdminStyles {
   static ContentWrapper = styled(CoolStyles.Block)`
      padding: 0.5rem;
   `
   static TileBlockWrapper = styled(CoolStyles.InlineBlock)`
       float: left;
       padding: 0.5rem;
   `
   static DateWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       color: #aaaaaa;
       font-size: 0.85rem;
   `
   static PreambleWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.italic}
       color: #aaaaaa;
       font-size: 1.25rem;
       margin-left: 0.5rem;
   `
   static SubPreambleWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.bold}
       ${CoolStyles.underline}
       color: #444444;
       font-size: 0.95rem;
       margin-left: 0.5rem;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static CenteredBlock = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
   `
}

export default CompAdminStyles
