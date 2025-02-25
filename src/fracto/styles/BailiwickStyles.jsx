import styled from "styled-components";
import {CoolStyles} from "../../common/ui/CoolImports";

export class BailiwickStyles {

   static RowWrapper = styled(CoolStyles.Block)`
       vertical-align: center;
       padding: 0.125rem;

       &: hover {
           background-color: #eeeeee;
       }
   `;

   static BlockWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.align_center}
       width: 2.5rem;
       vertical-align: center;
       font-size: 1.25rem;
   `;

   static SizeWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       ${CoolStyles.italic}
       ${CoolStyles.ellipsis}
       line-height: 1.5rem;
       letter-spacing: 0.1rem;
       font-size: 0.9rem;
       margin-left: 0.5rem;
       color: #666666;
       width: 7rem;
   `;

   static UpdatedWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       line-height: 1.5rem;
       letter-spacing: 0.1rem;
       font-size: 0.9rem;
       margin-left: 0.5rem;
       color: #666666;
       width: 8rem;
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
       font-size: 0.95rem;
       color: black;
       line-height: 1.25rem;
   `;

   static InlineWrapper = styled(CoolStyles.InlineBlock)`
       margin-left: 0.25rem;
   `;

   static LowerWrapper = styled(CoolStyles.Block)`
       margin: 0 1rem 0.125rem 1rem;
       overflow: hidden;
   `;

   static BigStatValue = styled(BailiwickStyles.StatValue)`
       font-size: 1.5rem;
   `
   static BailiwickNameBlock = styled(CoolStyles.InlineBlock)`
       margin-bottom: 0.25rem;
   `;

   static BailiwickNameSpan = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.bold}
       ${CoolStyles.monospace}
       ${CoolStyles.narrow_text_shadow}
       font-size: 2.0rem;
   `;

   static BigColorBox = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.narrow_border_radius}
       ${CoolStyles.narrow_text_shadow}
       ${CoolStyles.monospace}
       ${CoolStyles.bold}
       padding: 0 0.125rem;
       border: 0.1rem solid #555555;
       color: white;
       margin-right: 0.5rem;
       font-size: 2.5rem;
   `;

   static StatsWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.bold}
       ${CoolStyles.italic}
       font-size: 0.85rem;
       color: #444444;
       vertical-align: bottom;
   `;

   static ChartWrapper = styled(CoolStyles.Block)`
       background-color: white;
       margin:1rem;
   `;



}

export default BailiwickStyles
