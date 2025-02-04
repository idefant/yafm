import { forwardRef, ReactNode } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Except } from 'type-fest';

import { InputBase, InputBaseProps } from '#ui/InputBase';

interface CustomInputProps extends InputBaseProps {
  prefixProp?: ReactNode;
  suffixProp?: ReactNode;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ prefixProp, suffixProp, ...props }, ref) => (
    <InputBase prefix={prefixProp} suffix={suffixProp} ref={ref} {...props} />
  ),
);

export interface InputNumberBaseProps
  extends Except<NumericFormatProps<InputBaseProps>, 'prefix' | 'suffix'> {
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const InputNumberBase = forwardRef<HTMLInputElement, InputNumberBaseProps>(
  ({ prefix, suffix, ...props }, ref) => (
    <NumericFormat<CustomInputProps>
      allowedDecimalSeparators={[',']}
      thousandSeparator=" "
      customInput={CustomInput}
      prefixProp={prefix}
      suffixProp={suffix}
      getInputRef={ref}
      {...props}
    />
  ),
);
