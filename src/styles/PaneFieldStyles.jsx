import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {HEADER_HEIGHT_PX} from "./PageAppStyles";

export class PaneFieldStyles {
   static HeaderWrapper = styled(CoolStyles.Block)`
       padding: 0 2px;
       border-bottom: 1px solid black;
       height: ${HEADER_HEIGHT_PX}px;
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
       border: 0.1rem solid #888888;
       background: linear-gradient(70deg, #eeeeee, #999999);
       margin: 0 1px 0 0;
       font-size: 16px;
   `;

   static ButtonCaretUp = styled(FontAwesomeIcon)`
       color: white;
       text-shadow: 0.125rem 0.125rem 0.125rem #222222;
   `;
   static ButtonCaretDown = styled(FontAwesomeIcon)`
       color: white;
       text-shadow: 0.125rem 0.125rem 0.125rem #222222;
   `;
}

export default PaneFieldStyles
