import styled from "styled-components";
import * as prime_factors from "prime-factors"

import {CoolStyles, CoolColors} from "common/ui/CoolImports";

import FractoUtil from "../FractoUtil";
import {round_places} from "../../pages/panes/comps/points/PointUtils";

const TitleBar = styled(CoolStyles.Block)`
    background: linear-gradient(120deg, #999999, #eeeeee);
    height: 1.125rem;
    width: 100%;
    border-bottom: 0.15rem solid #666666;
`;

const TitleSpan = styled.span`
    ${CoolStyles.uppercase}
    ${CoolStyles.noselect}
    ${CoolStyles.bold}
    font-size: 1.125rem;
    letter-spacing: 0.5rem;
    margin-left: 1rem;
    color: white;
    text-shadow: 0.01rem 0.01rem 0.2rem black;
`;

export const render_title_bar = (title) => <TitleBar><TitleSpan>{title}</TitleSpan></TitleBar>;

const MainLink = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.link}
    ${CoolStyles.italic}
    ${CoolStyles.underline}
    ${CoolColors.COLOR_COOL_BLUE};
    font-size: 1.125rem;
    margin: 0 1rem;
`;

export const render_main_link = (text, cb) => <MainLink onClick={e => cb(e)}>{text}</MainLink>

const ModalTitleBar = styled(CoolStyles.Block)`
    ${CoolStyles.centered};
    ${CoolStyles.uppercase};
    letter-spacing: 0.75rem;
    color: #888888;
    font-size: 0.85rem;
    border-bottom: 0.125rem solid ${CoolColors.HSL_COOL_BLUE};
    margin: 0.5rem 1rem;
`;

export const render_modal_title = (title) => <ModalTitleBar>{title}</ModalTitleBar>

const PatternBlock = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.monospace}
    border: 0.1rem solid #666666;
    border-radius: 0.25rem;
    color: white;
    padding: 0.125rem 0.125rem 0;
`;

const BigPatternBlock = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.monospace}
    ${CoolStyles.align_center}
    border: 0.1rem solid #666666;
    border-radius: 0.5rem;
    color: white;
    padding: 0.125rem 0.25rem 0;
    min-width: 2.5rem;
    font-size: 1.75rem;
`;

const FRACTO_COLOR_ITERATIONS = 200;

export const render_pattern_block = (pattern, font_size_px = 20) => {
   const pattern_color = FractoUtil.fracto_pattern_color(pattern, FRACTO_COLOR_ITERATIONS);
   const block_style = {
      backgroundColor: pattern_color,
      fontSize: `${font_size_px}px`,
   }
   return <PatternBlock
      style={block_style}>
      {pattern}
   </PatternBlock>
}

const getFactors = (num) => {
   const isEven = num % 2 === 0;
   const max = Math.sqrt(num);
   const inc = isEven ? 1 : 2;
   let factors = [1, num];
   for (let curFactor = isEven ? 2 : 3; curFactor <= max; curFactor += inc) {
      if (num % curFactor !== 0) continue;
      factors.push(curFactor);
      let compliment = num / curFactor;
      if (compliment !== curFactor) factors.push(compliment);
   }
   return factors.filter(n => n !== 1);
}

export const describe_pattern = (pattern, long_form = false) => {
   const factors = getFactors(pattern);
   if (factors.length === 1) {
      return long_form ? `prime factor ${pattern}` : `pf${pattern}`;
   }
   if (pattern % 2 !== 0) {
      return long_form ? `factor ${pattern}` : `f${pattern}`;
   }
   const primes = prime_factors(pattern)
   return primes
      .filter(n => n !== pattern)
      .sort((a, b) => a - b)
      .join(', ')
}

export const render_big_pattern_block = (pattern) => {
   const pattern_color = FractoUtil.fracto_pattern_color(pattern, FRACTO_COLOR_ITERATIONS);
   return <BigPatternBlock
      style={{backgroundColor: pattern_color}}>
      {pattern}
   </BigPatternBlock>
}

const ShortCodeSpan = styled.span`
    ${CoolStyles.monospace}
    ${CoolStyles.narrow_border_radius}
    ${CoolStyles.narrow_box_shadow}
    font-size: 1.5rem;
    color: white;
    padding: 0.25rem 0.5rem 0.125rem;
    background-color: ${CoolColors.deep_blue};
`;

export const render_short_code = (short_code) => {
   return <ShortCodeSpan>{short_code}</ShortCodeSpan>
}

export const NumberSpan = styled.span`
    ${CoolStyles.monospace}
    ${CoolStyles.deep_blue_text}
    font-size: 0.95rem;
`;

export const NumberInline = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.monospace}
    ${CoolStyles.deep_blue_text}
    font-size: 0.95rem;
`;

export const SmallNumberSpan = styled.span`
    ${CoolStyles.monospace}
    ${CoolStyles.ellipsis}
    ${CoolStyles.deep_blue_text}
    font-size: 0.75rem;
`;

export const SmallNumberInline = styled(CoolStyles.InlineBlock)`
    ${CoolStyles.monospace}
    ${CoolStyles.ellipsis}
    ${CoolStyles.deep_blue_text}
    font-size: 0.75rem;
`;

const ItalicSpan = styled.span`
    ${CoolStyles.bold}
    ${CoolStyles.italic}
    ${CoolStyles.deep_blue_text}
    font-family: Arial;
    font-size: 0.95rem;
`;

export const render_coordinates = (x, y, digits = 10) => {
   const x_rounded = round_places(x, digits);
   const y_rounded = round_places(y, digits);
   return [
      <NumberSpan key={'number-part'}>{`${x_rounded}+${y_rounded}`}</NumberSpan>,
      <ItalicSpan key={'just-i'}>i</ItalicSpan>
   ]
}
