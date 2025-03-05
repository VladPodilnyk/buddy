export function getAuthToken(): string | undefined {
  return localStorage.getItem("authToken") ?? undefined;
}
