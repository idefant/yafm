import { ForwardedRef, forwardRef, useMemo } from 'react';
import ReactSelect, { GroupBase, Props, StylesConfig } from 'react-select';
import ReactSelectType from 'react-select/base';

import { SelectBaseSize } from './selectBaseType';

export interface SelectBaseProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group> {
  size?: SelectBaseSize;
  error?: string | boolean;
}

/* eslint-disable no-unused-vars */
type SelectBaseType = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectBaseProps<Option, IsMulti, Group> & {
    ref?: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>;
  },
) => JSX.Element;
/* eslint-enable no-unused-vars */

export const SelectBase = forwardRef(
  <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(
    { size = 'md', error, className, ...props }: SelectBaseProps<Option, IsMulti, Group>,
    ref: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>,
  ) => {
    const hasError = typeof error === 'string' || !!error;

    const styles: StylesConfig<Option, IsMulti, Group> = useMemo(() => {
      const sizeParams = (() => {
        if (size === 'sm') {
          return {
            base: { fontSize: 'var(--input-font-size-sm)' },
            control: { minHeight: 'var(--button-height-sm)' },
            indicator: { padding: 4 },
            option: { padding: '6px 10px' },
            multiValue: { margin: '1px 2px' },
            multiValueLabel: { padding: '1px 3px 1px 6px', lineHeight: 1.4 },
          };
        }
        if (size === 'md') {
          return {
            base: { fontSize: 'var(--input-font-size-md)' },
            control: { minHeight: 'var(--button-height-md)' },
            indicator: { padding: 7 },
            option: { padding: '8px 12px' },
            multiValue: { margin: '2px 2px' },
            multiValueLabel: { padding: '2px 3px 2px 6px', lineHeight: 1.5 },
          };
        }
        return {
          base: { fontSize: 'var(--input-font-size-lg)' },
          control: { minHeight: 'var(--button-height-lg)' },
          indicator: { padding: 10 },
          option: { padding: '8px 12px' },
          multiValue: { margin: '2px 3px' },
          multiValueLabel: { padding: '2px 4px 2px 8px', lineHeight: 1.5 },
        };
      })();

      return {
        control: (styles, { isFocused }) => {
          const boxShadow = (() => {
            if (!isFocused) return 'none';
            return hasError
              ? 'var(--input-focused-error-box-shadow)'
              : 'var(--input-focused-box-shadow)';
          })();

          const borderColor = (() => {
            if (hasError) {
              if (isFocused) return 'var(--input-focused-error-border-color)';
              return 'var(--input-error-border-color)';
            }
            if (isFocused) return 'var(--input-focused-border-color)';
            return 'var(--input-border-color)';
          })();

          return {
            ...styles,
            backgroundColor: 'var(--input-bg)',
            borderColor,
            boxShadow,
            borderRadius: 'var(--input-border-radius)',
            transition: 'var(--input-transition)',
            cursor: 'pointer',
            ':hover': {
              ...styles[':hover'],
              borderColor,
              boxShadow,
            },
            minHeight: sizeParams.control.minHeight,
          };
        },
        input: (styles) => ({
          ...styles,
          color: 'var(--input-color)',
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          fontSize: sizeParams.base.fontSize,
        }),
        placeholder: (styles, { isDisabled }) => ({
          ...styles,
          color: 'var(--input-placeholder-color)',
          opacity: isDisabled
            ? 'var(--input-disabled-placeholder-opacity)'
            : 'var(--input-placeholder-opacity)',
          fontSize: sizeParams.base.fontSize,
        }),
        singleValue: (styles, { isDisabled }) => ({
          ...styles,
          color: isDisabled ? 'var(--input-disabled-color)' : 'var(--input-color)',
          marginLeft: 4,
          fontSize: sizeParams.base.fontSize,
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: 'var(--input-multi-bg)',
          margin: sizeParams.multiValue.margin,
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: 'var(--input-color)',
          padding: sizeParams.multiValueLabel.padding,
          fontSize: sizeParams.base.fontSize,
          lineHeight: sizeParams.multiValueLabel.lineHeight,
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          ':hover': {
            ...styles[':hover'],
            backgroundColor: 'var(--input-multi-remove-bg)',
            color: 'var(--input-multi-remove-color)',
          },
        }),
        clearIndicator: (styles) => ({
          ...styles,
          color: 'var(--input-clear-color)',
          padding: sizeParams.indicator.padding,
          ':hover': {
            ...styles[':hover'],
            color: 'var(--input-clear-hovered-color)',
          },
        }),
        dropdownIndicator: (styles) => ({
          ...styles,
          color: 'var(--input-dropdown-color)',
          padding: sizeParams.indicator.padding,
          ':hover': {
            ...styles[':hover'],
            color: 'var(--input-dropdown-hovered-color)',
          },
        }),
        menu: (styles) => ({
          ...styles,
          backgroundColor: 'var(--input-menu-bg)',
          boxShadow: 'var(--input-menu-box-shadow)',
          border: '1px solid var(--input-menu-border-color)',
          borderRadius: 'var(--input-menu-border-radius)',
        }),
        option: (styles, { isFocused, isSelected }) => {
          const backgroundColor = (() => {
            if (isSelected) {
              if (isFocused) return 'var(--input-option-selected-focused-bg)';
              return 'var(--input-option-selected-bg)';
            }
            if (isFocused) return 'var(--input-option-focused-bg)';
            return 'var(--input-option-bg)';
          })();

          return {
            ...styles,
            backgroundColor,
            color: isSelected ? 'var(--input-option-selected-color)' : 'var(--input-option-color)',
            cursor: 'pointer',
            fontSize: sizeParams.base.fontSize,
            padding: sizeParams.option.padding,
          };
        },
      };
    }, [hasError, size]);

    return (
      <ReactSelect
        placeholder=""
        className={className}
        components={{
          IndicatorSeparator: null,
        }}
        styles={styles}
        ref={ref}
        {...props}
      />
    );
  },
) as SelectBaseType;
