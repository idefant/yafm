export const transforms = ['gzip', 'json'] as const;

export type Transform = (typeof transforms)[number];

export type TransformedData = {
  data: any;
  transforms: Transform[];
};
