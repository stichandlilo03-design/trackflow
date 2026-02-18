export function verifyAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return token === adminPassword;
}
