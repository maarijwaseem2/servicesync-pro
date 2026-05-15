export function decodeJwtPayload(token: string): Record<string, any> {
  return JSON.parse(atob(token.split(".")[1]));
}
