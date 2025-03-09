export function deepEntries(
  obj: Record<any, any>,
  parentKey = "",
): [string, any][] {
  const entries: any[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      entries.push(...deepEntries(value, fullKey));
    } else {
      entries.push([fullKey, value]);
    }
  });

  return entries;
}
