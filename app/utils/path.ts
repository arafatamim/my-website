export function normalizePathname(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}
