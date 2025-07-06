import styled from "styled-components";
import {CoolStyles} from '../common/ui/CoolImports'

export class CompPointsStyles {
   static   ContentWrapper = styled(CoolStyles.Block)`
       padding: 0.25rem;
   `
   static ColumnWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0.25rem;
   `
   static ChartWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0;
   `
   static GraphWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0;
       background-color: #fcfcfc;
       overflow: auto;
   `
   static ZoomerStealth = styled(CoolStyles.InlineBlock)`
       overflow: hidden;
       margin: 0;
   `
   static ZoomerWrapper = styled(CoolStyles.InlineBlock)`
       margin: 5px 0;
   `
   static CaptionWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.align_center}
       font-family: ui-serif;
       font-size: 0.75rem;
       color: #666666;
       padding: 0.125rem 0 0.5rem;
       letter-spacing: 1px;
       width: 95%;
       margin: 0 auto;
       border-bottom: 0.15rem solid #aaaaaa;
   `
   static CaptionI = styled.span`
       ${CoolStyles.italic}
       color: #666666;
       letter-spacing: 1px;
   `
   static CaptionSubject = styled.span`
       ${CoolStyles.bold}
       color: #666666;
       letter-spacing: 1px;
   `
   static CaptionQualifier = styled.span`
       ${CoolStyles.italic}
       color: #666666;
       letter-spacing: 1px;
   `
   static ClickPoint = styled.span`
       ${CoolStyles.monospace}
       color: #444444;
   `
   static OptionsWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.align_middle}
       ${CoolStyles.noselect}
       font-size: 0.75rem;
       color: #666666;
       letter-spacing: 1px;
   `
   static ScatterTypePrompt = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.uppercase}
       ${CoolStyles.align_middle}
       ${CoolStyles.noselect}
       margin-left: 0.25rem;
       font-size: 0.75rem;
       padding-top: 0.125rem;
   `
   static Spacer = styled(CoolStyles.InlineBlock)`
       margin-left: 1rem;
   `
   static InputWrapper = styled(CoolStyles.InlineBlock)`
       ${CoolStyles.pointer}
       ${CoolStyles.align_middle}
       font-size: 0.75rem;
   `
}

export default CompPointsStyles
