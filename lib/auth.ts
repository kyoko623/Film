export function checkAuth(request: Request): boolean {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!expected) return false;
  return token === expected;
}
