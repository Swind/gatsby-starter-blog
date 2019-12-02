import styled, { CreateStyled } from '@emotion/styled'
export type Theme = {
    spacingPx: number,
    spacing: string,
    headerHeight: string,
    textColor: string,
    accentColor: string,
    maxWidthPx: number,
    minWidthPx: number
    smallMedia: string,
    largeMedia: string,
    centerPadding: Record<string, string | Record<string, string>>
}

const minWidthPx = 680;
const maxWidthPx = 960;
const spacingPx = 10;
const centerPadding = `calc((100vw - ${maxWidthPx - (2 * spacingPx)}px) / 2)`;
const smallMedia = `@media(max-width: ${minWidthPx}px)`;
const largeMedia = `@media(min-width: ${maxWidthPx}px)`;
const textColor = '#333';
const accentColor = '#ab4642';

const theme: Theme = {
  spacingPx,
  spacing: `${spacingPx}px`,
  headerHeight: '75px',
  textColor,
  accentColor,
  maxWidthPx,
  minWidthPx,
  smallMedia,
  largeMedia,
  centerPadding: {
    padding: `0 ${spacingPx}px`,
    [largeMedia]: {
      paddingLeft: centerPadding,
      paddingRight: centerPadding,
    },
  },
};

export default styled as CreateStyled<Theme>
export {theme}