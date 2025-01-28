import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NonEmptyObject } from 'type-fest';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type BreakpointValues<T> = NonEmptyObject<Partial<Record<Breakpoint, T>>>;

export const useBreakpointValue = <T>(values: BreakpointValues<T> | T) => {
  const isXXL = useMediaQuery({ minWidth: 1600 });
  const isXL = useMediaQuery({ minWidth: 1200 });
  const isLG = useMediaQuery({ minWidth: 992 });
  const isMD = useMediaQuery({ minWidth: 768 });
  const isSM = useMediaQuery({ minWidth: 576 });

  const value = useMemo(() => {
    if (
      !(
        values &&
        typeof values === 'object' &&
        ('xxl' in values ||
          'xl' in values ||
          'lg' in values ||
          'md' in values ||
          'sm' in values ||
          'xs' in values)
      )
    ) {
      return values;
    }

    if (isXXL && values.xxl) return values.xxl;
    if (isXL && values.xl) return values.xl;
    if (isLG && values.lg) return values.lg;
    if (isMD && values.md) return values.md;
    if (isSM && values.sm) return values.sm;
    if (values.xs) return values.xs;
  }, [isLG, isMD, isSM, values, isXL, isXXL]);

  return value as T;
};
