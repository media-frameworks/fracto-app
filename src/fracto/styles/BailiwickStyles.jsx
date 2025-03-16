import styled from "styled-components";
import {CoolStyles} from "../../common/ui/CoolImports";

const MINI_BLOCK_WIDTH_PX = 100

export class BailiwickStyles {

   static RowWrapper = styled(CoolStyles.InlineBlock)`
       border-radius: 0.5rem;

       &:hover {
           background-color: #eeeeee;
       }
   `;

   static BlockWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       min-width: 3rem;
       vertical-align: middle;
       font-size: 2.0rem;
   `;

   static SizeWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       ${CoolStyles.italic}
       ${CoolStyles.align_center}
       line-height: 1.25rem;
       letter-spacing: 0.1rem;
       font-size: 0.8rem;
       color: #666666;
       vertical-align: middle;
   `;

   static UpdatedWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       ${CoolStyles.align_center}
       letter-spacing: 0.1rem;
       font-size: 0.75rem;
       color: #666666;
       width: ${MINI_BLOCK_WIDTH_PX - 2}px;
   `;

   static StatLabel = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       vertical-align: text-bottom;
       font-size: 0.95rem;
       color: #444444;
       margin-right: 0.25rem;
       line-height: 1.25rem;
   `;

   static StatValue = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       font-size: 0.90rem;
       color: black;
       line-height: 1.25rem;
   `;

   static MuStyle = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       font-size: 0.90rem;
   `;

   static InlineWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.align_center}
       margin-right: 0.25rem;
   `;

   static LowerWrapper = styled(CoolStyles.Block)`
       margin: 0 1rem 0.125rem 1rem;
       overflow: hidden;
   `;

   static BigStatValue = styled(BailiwickStyles.StatValue)`
       font-size: 1.5rem;
       margin-right: 0.5rem;
   `
   static BailiwickNameBlock = styled(CoolStyles.InlineBlock)`
       margin-bottom: 0.25rem;
       padding-left: 1.0rem;
   `;

   static BailiwickNameSpan = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       ${CoolStyles.monospace}
       ${CoolStyles.narrow_text_shadow}
       font-size: 2.0rem;
   `;

   static BigColorBox = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.narrow_text_shadow}
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       padding: 0 0.125rem;
       border: 0.1rem solid #555555;
       color: white;
       margin-right: 0.5rem;
       font-size: 2.0rem;
       border-radius: 0.125rem;
       min-width: 3rem;
   `;

   static StatsWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.bold}
       ${CoolStyles.italic}
       font-size: 0.85rem;
       color: #444444;
       vertical-align: bottom;
   `;

   static ChartWrapper = styled(CoolStyles.InlineBlock)`
       background-color: white;
       margin: 0.5rem;
   `;

   static SideWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0.5rem;
   `;

   static QuadrantsWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.monospace}
       ${CoolStyles.align_center}
       ${CoolStyles.medium_box_shadow}
       margin-top: 1rem;
       color: #444444;
       font-size: 1.25rem;
   `;

   static CloseButton = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.bold}
       float: right;
       margin-right: 0.5rem;
   `;

   static MiniBlock = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.align_center}
       width: ${MINI_BLOCK_WIDTH_PX}px;
       margin: 0.5rem;
   `;
   static ThumbnailWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.narrow_text_shadow}
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       ${CoolStyles.pointer}
       border: 0.1rem solid #555555;
       color: white;
       font-size: 2.0rem;
       border-radius: 1.0rem;
       overflow: hidden;
       height: 100px;
   `;

   static PatternNumber = styled(CoolStyles.InlineBlock)`
       margin: auto;
   `

}

export default BailiwickStyles
