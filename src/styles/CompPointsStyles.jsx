import styled from "styled-components";
import {CoolColors, CoolStyles} from '../common/ui/CoolImports'

export class CompPointsStyles {
   static   ContentWrapper = styled(CoolStyles.Block)`
       padding: 0.25rem;
   `
   static ColumnWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0.25rem;
   `
   static ChartWrapper = styled(CoolStyles.InlineBlock)`
       margin-bottom: 0.5rem;
   `
   static DashboardWrapper = styled(CoolStyles.InlineBlock)`
       margin-top: 0.5rem;
   `
   static GraphWrapper = styled(CoolStyles.InlineBlock)`
       margin: 0;
       background-color: #f4f4f4;
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
   static DashboardContent = styled(CoolStyles.Block)`
       padding: 0.5rem;
       border-style: double;
       border-color: hsla(200, 90%, 50%, 35%);
       border-width: 5px;
       border-radius: 0.5rem;
       background-color: #f4f4f4;
   `
   static VertexListContent = styled(CoolStyles.Block)`
       padding: 0.5rem;
       margin-top: 0.5rem;
       background-color: #f4f4f4;
   `
   static DeclarationWrapper = styled(CoolStyles.Block)`
       ${CoolStyles.italic}
       font-size: 1rem;
       color: #888888;
   `
   static PreambleWrapper = styled(CoolStyles.InlineBlock)`
       font-family: serif;
       font-size: 0.75rem;
       margin-left: 0.5rem;
       border-bottom: 2px solid rgba(0, 0, 0, 15%);
       padding-bottom: 0.25rem;
   `
   static EmboldenedPreamble = styled.span`
       ${CoolStyles.bold}
       ${CoolStyles.uppercase}
       font-style: normal;
       color: #666666;
       letter-spacing: 1px;
   `
   static NotPreambleWrapper = styled(CoolStyles.Block)`
       margin-top: 0.5rem;
       font-size: 1rem;
       color: #444444;
   `
   static SeekButton = styled.button`
       ${CoolStyles.italic}
       ${CoolStyles.pointer}
       ${CoolStyles.noselect}
       margin: 5% 10%;
       padding: 0.25rem 0.5rem;
       color: white;
       font-size: 1rem;
       border-radius: 0.25rem;
       background-color: ${CoolColors.cool_blue};
   `
}

export default CompPointsStyles
