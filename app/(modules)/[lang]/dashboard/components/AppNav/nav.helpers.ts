/** The dashboard's own item is active only on itself; others on sub-pages too. */
export const isNavItemActive = (
  pathname: string,
  href: string,
  route: string,
) =>
  route === ''
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
