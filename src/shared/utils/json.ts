export function parseJSON(json: string): object | null {
  try {
    return JSON.parse(json) as object;
  } catch {
    return null;
  }
}
