import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export class PaneFieldStyles {
   static HeaderWrapper = styled(CoolStyles.Block)`
       padding: 0 2px;
       border-bottom: 1px solid black;
       background: linear-gradient(70deg, #999999, #eeeeee);
   `
   static FieldWrapper = styled(CoolStyles.InlineBlock)`
       padding: 0;
       text-align: center;
       vertical-align: middle;
   `
   static ImageWrapper = styled(CoolStyles.InlineBlock)`
       padding: 0;
   `
   static MagnifyButton = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.align_center}
       ${CoolStyles.pointer}
       padding: 0;
       float: right;
       width: 2rem;
       border-radius: 0.2rem;
       border: 0.1rem solid #666666;
       background: linear-gradient(70deg, #eeeeee, #999999);
       margin: 1px 2px 0 0;
       font-size: 1.125rem;
   `;

   static ButtonCaret = styled(FontAwesomeIcon)`
       color: white;
       text-shadow: 0.125rem 0.125rem 0.125rem #222222;
   `;
}

export default PaneFieldStyles
