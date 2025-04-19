import styled from "styled-components";
import {CoolStyles} from 'common/ui/CoolImports'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const VIEWER_BAR_WIDTH_PX = 29
export const TREE_TEXT_COLOR = "#666666"

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
   static ViewWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       ${CoolStyles.absolute}
       right: 0;
       overflow: auto;
       background-color: lightcyan;
       font-size: 14px;
   `
   static ScriptJsonText = styled.pre`
       margin: 0.25rem;
   `
   static ViewerBarFrame = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.absolute}
       width: ${VIEWER_BAR_WIDTH_PX}px;
       background: linear-gradient(70deg, #eeeeee, #bbbbbb);
       font-size: 0.85rem;
       border-right: 1px solid black;
   `
   static SquareButton = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.narrow_text_shadow}
       ${CoolStyles.narrow_box_shadow}
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       ${CoolStyles.pointer}
       ${CoolStyles.align_center}
       ${CoolStyles.noselect}
       width: 22px;
       height: 22px;
       margin: 1px 1px 0 2px;
       border-radius: 4px;
       border: 1px solid #444444;
       background-color: #eeeeee;
       font-size: 18px;
       color: black;
   `;

   static TreeIcon = styled(FontAwesomeIcon)`
       color: ${TREE_TEXT_COLOR};
       text-shadow: 0.125rem 0.125rem 0.125rem #222222;
       font-size: 0.85rem;
   `;

   static TreeTitleText = styled(CoolStyles.InlineBlock)`
       color: ${TREE_TEXT_COLOR};
       font-size: 0.85rem;
       margin: 0 0.125rem;
   `;
   static TreeTitleNumber = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       color: ${TREE_TEXT_COLOR};
       font-size: 0.85rem;
       margin: 0 0.125rem;
   `;
}

export default CompScriptStyles
