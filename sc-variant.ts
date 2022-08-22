declare module 'sc-variant' {
  type KeyType<
    Props extends object,
    Key extends keyof Props,
  > = Required<Props>[Key] extends string | number | symbol ? Key : never;
  type VariantType<
    Props extends object,
    Key extends keyof Props,
  > = Required<Props>[Key] extends string | number | symbol
    ? Partial<Record<Required<Props>[Key] | 'DEFAULT', string | null>>
    : never;

  export default function v<Props extends object, Key extends keyof Props>(
    key: KeyType<Props, Key>,
    variants: Props[Key] extends string | number | symbol | undefined
      ? Record<Exclude<Props[Key], undefined>, string | null> &
          (Props[Key] extends Exclude<Props[Key], undefined>
            ? {}
            : {
                DEFAULT?: string | null;
              })
      : never,
    required: true,
  ): (props: Props) => string | undefined | null;
  export default function v<Props extends object, Key extends keyof Props>(
    key: KeyType<Props, Key>,
    variants: VariantType<Props, Key>,
  ): (props: Props) => string | undefined | null;
}
