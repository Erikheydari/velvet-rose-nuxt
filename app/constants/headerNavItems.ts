interface HeaderNavItem {
  label: string;
  to: string;
}

export const headerNavItems: HeaderNavItem[] = [
  { label: 'صفحه اصلی', to: '/' },
  { label: 'محصولات', to: '/products' },
  { label: 'درباره ما', to: '/about' },
  { label: 'تماس با ما', to: '/contact' },
];

interface HeaderUserItem {
  label: string;
  to: string;
}

export const headerUserItems: HeaderUserItem[] = [
  { label: 'ورود / ثبت نام', to: '/login' },
];