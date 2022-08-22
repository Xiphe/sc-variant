# sc-variant

tiny _~100B_ helper to create variants of styled components

inspired by [styled-theming](https://jamie.build/styled-theming.html) but without the theming.

## install

```bash
npm i sc-variant
# yarn add sc-variant
```

## use

<!--
title: normal usage
before: import getCss from './getCss';
-->

```tsx
import styled from 'styled-components';
import variant from 'sc-variant';

interface CustomButtonProps {
  size?: 'small' | 'big' | 'custom';
  kind?: 'primary' | 'secondary';
}
const Button = styled.button<CustomButtonProps>`
  padding: ${variant('size', {
    // DEFAULT is optional and will be used when size="big"
    DEFAULT: '0.5rem',
    small: '0.125rem',
    // Setting null explicitly overwrites DEFAULT and no style is set
    custom: null,
  })};
  background-color: ${variant('kind', {
    primary: 'fuchsia',
    // kind="primary" is not covered here, so no background-color style is set for that variant
  })};
`;

expect(getCss(<Button />)).toBe('padding: 0.5rem;');
expect(getCss(<Button size="small" />)).toBe('padding: 0.125rem;');
expect(getCss(<Button kind="secondary" />)).toBe('padding: 0.5rem;');
expect(getCss(<Button kind="primary" />)).toBe(
  'padding: 0.5rem; background-color: fuchsia;',
);
expect(getCss(<Button kind="primary" size="custom" />)).toBe(
  'background-color: fuchsia;',
);
```

### Require extensive variants

We can require each variant to be set explicitly by passing `true` as third parameter.

Note that there are no runtime-checks. This exists only for dev convenience
with typescript.

<!--
title: extensive variants
-->

```tsx
import styled from 'styled-components';
import variant from 'sc-variant';

interface CustomButtonProps {
  size: 'small' | 'big' | 'normal';
}
const Button = styled.button<CustomButtonProps>`
  padding: ${variant(
    'size',
    // @ts-expect-error Property 'small' is missing
    {
      normal: '0.25rem',
      big: '0.5rem',
      // Note DEFAULT is not permitted here unless `size` prop is optional
    },
    true,
  )};
`;

expect(getCss(<Button size="big" />)).toBe('padding: 0.5rem;');
```
