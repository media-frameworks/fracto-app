import styled from "styled-components";
import {CoolStyles} from "../../common/ui/CoolImports";

export class BailiwickStyles {
   
   static RowWrapper = styled(CoolStyles.Block)`
      vertical-align: center;
      padding: 0.125rem;
      &: hover{
         background-color: #eeeeee;
      }
   `;

   static BlockWrapper = styled(CoolStyles.InlineBlock)`
      ${CoolStyles.align_center}
      width: 2.5rem;
      vertical-align: center;
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

   static StatValue = styled(CoolStyles.InlineBlock)`
      ${CoolStyles.monospace}
      ${CoolStyles.bold}
      font-size: 0.95rem;
      color: black;
      width: 8rem;
   `;

   static InlineWrapper = styled(CoolStyles.InlineBlock)`
      margin-left: 0.25rem;
   `;

}

export default BailiwickStyles
