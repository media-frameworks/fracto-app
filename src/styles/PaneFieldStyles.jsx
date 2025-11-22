import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {HEADER_HEIGHT_PX} from "./PageAppStyles";

export const WIDTH_CROSSHAIR_LINE_PX = 2
export const OPACITY_LINE_PCT = 45

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
   static HighestLevelBadge = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       ${CoolStyles.noselect}
       text-shadow: 0.125rem 0.125rem 0.125rem #666666;
       font-size: 1rem;
       margin-left: 0.25rem;
       color: #eeeeee;
   `;
   static VerticalCrossHair = styled(CoolStyles.InlineBlock)`
       position: fixed;
       width: ${WIDTH_CROSSHAIR_LINE_PX}px;
       top: 0;
       bottom: 0;
       background-color: white;
       opacity: 0.${OPACITY_LINE_PCT};
       cursor: crosshair;
   `
   static HorizontalCrossHair = styled(CoolStyles.InlineBlock)`
       position: fixed;
       height: ${WIDTH_CROSSHAIR_LINE_PX}px;
       left: 0;
       right: 0;
       background-color: white;
       opacity: 0.${OPACITY_LINE_PCT};
       cursor: crosshair;
   `
   static CenterBox = styled(CoolStyles.InlineBlock)`
       position: fixed;
       border: ${WIDTH_CROSSHAIR_LINE_PX}px solid rgba(255,255,255,${2 * OPACITY_LINE_PCT}%);
       cursor: crosshair;
       background-color: transparent;
       border-radius: 3px;
   `
   static BoxTopBottom = styled(CoolStyles.InlineBlock)`
       position: fixed;
       height: ${WIDTH_CROSSHAIR_LINE_PX}px;
       background-color: white;
       opacity: 0.${OPACITY_LINE_PCT};
       cursor: crosshair;
   `
   static BoxLeftRight = styled(CoolStyles.InlineBlock)`
       position: fixed;
       width: ${WIDTH_CROSSHAIR_LINE_PX}px;
       background-color: white;
       opacity: 0.${OPACITY_LINE_PCT};
       cursor: crosshair;
   `
}

export default PaneFieldStyles
