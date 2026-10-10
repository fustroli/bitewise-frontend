export const makeStringReadable = (str: string): string => {
  const res = str.replace(/_/g, ' ').toLowerCase();
  return res.charAt(0).toUpperCase() + res.slice(1);
};

/** Replaces `{key}` placeholders in a dictionary string. */
export const interpolate = (
  template: string,
  values: Record<string, string | number>,
): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
