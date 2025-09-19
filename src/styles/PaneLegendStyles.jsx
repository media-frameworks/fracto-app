import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export const HEADER_HEIGHT_PX = 18
export const THUMBNAIL_WIDTH_PX = 180
export const LABEL_WIDTH_PX = 120;

export class PaneLegendStyles {
   static HeaderWrapper = styled(CoolStyles.Block)`
       padding: 0;
       border-bottom: 1px solid black;
       background: linear-gradient(70deg, #999999, #eeeeee);
   `
   static LegendWrapper = styled(CoolStyles.InlineBlock)`
       height: 100%;
       padding: 0;
   `
   static LegendHeaderContent = styled(CoolStyles.Block)`
       margin: 0;
   `
   static LegendTitle = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.uppercase}
       ${CoolStyles.narrow_text_shadow}
       padding: 4px 4px;
       color: white;
       font-size: 0.65rem;
       letter-spacing: 0.25rem;
   `

   static ThumbnailWrapper = styled(CoolStyles.InlineBlock)`
       background: linear-gradient(70deg, #444444, #999999);
       overflow: hidden;
   `
   static TabsWrapper = styled(CoolStyles.InlineBlock)`
       background: linear-gradient(70deg, #999999, #eeeeee);
       overflow: hidden;
   `
   static TabsContentWrapper = styled(CoolStyles.Block)`
       background-color: white;
       padding: 0.125rem 0 0 8px;
   `
   static StatsLabel = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.italic}
       ${CoolStyles.align_right}
       color: #888888;
       width: ${LABEL_WIDTH_PX}px;
       font-size: 0.95rem;
       padding-right: 0.25rem;
   `
   static StatsContent = styled(CoolStyles.InlineBlock)`
       overflow: hidden;
       word-break: break-word;
   `
   static WaitSpan = styled.span`
       ${CoolStyles.monospace}
       color: lightcoral;
   `
   static ReadySpan = styled.span`
       ${CoolStyles.monospace}
       color: lightseagreen;
   `
   static BrandName = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       ${CoolStyles.uppercase}
       color: gold;
       letter-spacing: 16px;
       font-size: 0.85rem;
       font-family: "Book Antiqua", serif;
   `
   static BrandBlurb = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       ${CoolStyles.italic}
       color: white;
       font-size: 0.65rem;
       letter-spacing: 7px;
       padding-bottom: 5px;
   `

   static BrandWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       ${CoolStyles.pointer}
       text-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 1.0);
       border-bottom: 1px solid #aaaaaa;
       opacity: 0.65;
       &:hover {
           opacity: 1.0;
       }
   `

   static StatsTitle = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       ${CoolStyles.uppercase}
       color: #666666;
       letter-spacing: 16px;
       font-size: 1.05rem;
       background-color: white;
       padding-top: 0.5rem;
       border-bottom: 1px solid #cccccc;
   `
   static TransitWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
   `
}

export default PaneLegendStyles
