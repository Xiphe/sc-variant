import cjs from 'sc-variant';
// @ts-ignore
import mjs from 'sc-variant-mjs';
import styled from 'styled-components';
import css from './getCss';

describe.each<{ mod: Promise<typeof cjs>; m: string }>([
  { mod: cjs, m: 'cjs' },
  { mod: mjs, m: 'mjs' },
])('sc-variant $m', ({ mod }) => {
  it('creates a function accepting props', async () => {
    const variant = await mod;
    const Comp = styled.div<{ size: 'small' | 'big' }>`
      width: ${variant('size', { small: '1px' })};
    `;

    expect(css(<Comp size="small" />)).toBe(`width: 1px;`);
    expect(css(<Comp size="big" />)).toBe('');
  });

  it('supports default values', async () => {
    const variant = await mod;
    const Comp = styled.div<{ size: string }>`
      width: ${variant('size', { DEFAULT: '100px', small: null })};
    `;

    expect(css(<Comp size="small" />)).toBe('');
    expect(css(<Comp size="big" />)).toBe('width: 100px;');
    expect(css(<Comp size={Math.random().toString()} />)).toBe('width: 100px;');
  });

  it('supports numbers and symbols as keys', async () => {
    const variant = await mod;
    const sym = Symbol();
    const Comp = styled.div<{
      test: 1 | 2 | typeof sym;
    }>`
      width: ${variant('test', {
        DEFAULT: 'default',
        1: 'number',
        [sym]: 'symbol',
      })};
    `;

    expect(css(<Comp test={1} />)).toBe('width: number;');
    expect(css(<Comp test={sym} />)).toBe('width: symbol;');
    expect(css(<Comp test={2} />)).toBe('width: default;');
  });

  it('reports ts error when used with incompatible prop value', async () => {
    const variant = await mod;
    const Comp = styled.div<{
      test: () => void;
    }>`
      width: ${variant(
        // @ts-expect-error
        'test',
        { DEFAULT: 'default' },
      )};
    `;

    // Still gracefully renders default
    expect(css(<Comp test={() => {}} />)).toBe('width: default;');
  });

  it('reports ts error when variant used unknown prop value', async () => {
    const variant = await mod;
    const Comp = styled.div<{
      test: 'one' | 'two';
    }>`
      width: ${variant('test', {
        // @ts-expect-error
        three: '3px',
      })};
    `;

    // Does not throw though...
    expect(css(<Comp test="one" />)).toBe('');
  });

  it('reports missing variants when "required" is set to true', async () => {
    const variant = await mod;
    const Comp = styled.div<{
      test: 'one' | 'two';
    }>`
      width: ${variant(
        'test',
        // @ts-expect-error
        { one: '3px' },
        true,
      )};
    `;

    // Does not throw though...
    expect(css(<Comp test="two" />)).toBe('');
  });

  it('reports unexpected DEFAULT when "required" is set to true', async () => {
    const variant = await mod;
    const Comp = styled.div<{
      test: 'one' | 'two';
    }>`
      width: ${variant(
        'test',
        {
          one: '1px',
          two: '2px',
          // @ts-expect-error
          DEFAULT: '1000px',
        },
        true,
      )};
    `;

    // Does not throw though...
    expect(css(<Comp test="two" />)).toBe('width: 2px;');
  });

  it('allows DEFAULT when "required" is set to true but prop is optional', async () => {
    const variant = await mod;
    const Comp = styled.div<{
      test?: 'one' | 'two';
    }>`
      width: ${variant(
        'test',
        {
          one: '1px',
          two: '2px',
          DEFAULT: '1000px',
        },
        true,
      )};
    `;

    // Does not throw though...
    expect(css(<Comp />)).toBe('width: 1000px;');
  });
});
