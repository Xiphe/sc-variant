import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { renderToString } from 'react-dom/server';

export default function getCss(elm: JSX.Element) {
  const sheet = new ServerStyleSheet();
  renderToString(
    <StyleSheetManager sheet={sheet.instance}>{elm}</StyleSheetManager>,
  );
  const styleTags = sheet.getStyleTags();
  return styleTags
    .replace(/^<style .*?>.*?{/gm, '')
    .replace(/}(.|\n)*$/gm, '')
    .replace(/(:|;)/g, '$1 ')
    .trim();
}
