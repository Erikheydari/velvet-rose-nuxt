import { type ContactItem, type SocialItem } from './navItems'

interface HeaderNavItem {
  label: string;
  to: string;
}

interface ChildrenItem {
  value?: string
  label: string
  slug?: string
  href?: string
  icon?: string
}

export interface MainMenuItem {
  text: string
  link: string
  icon: string
  children?: ChildrenItem[]
}

export interface MainMenuData {
  mainMenu: MainMenuItem[]
  contact: ContactItem[]
  socials: SocialItem[]
}

interface Tab {
  id: string
  label: string
  icon: string
}


interface HeaderUserItem {
  label: string;
  to: string;
}

export const headerNavItems: HeaderNavItem[] = [
  { label: 'صفحه اصلی', to: '/' },
  { label: 'محصولات', to: '/products' },
  { label: 'درباره ما', to: '/about' },
  { label: 'تماس با ما', to: '/contact' },
];


export const headerUserItems: HeaderUserItem[] = [
  { label: 'ورود / ثبت نام', to: '/login' },
];

export const headerContact: ChildrenItem[] = [
  { label: "ایمیل", value: "info@velvetrose.com", icon: 'Mail', href: "mailto:info@velvetrose.com" },
  { label: "شماره تماس", value: "1122 933 98+", icon: 'Phone', href: "tel:+98112293398" },
];

export const headerSocials: ChildrenItem[] = [
  { label: "اینستاگرام", href: "https://www.instagram.com/velvetrose.ir", icon: 'Instagram' },
  { label: "توییتر", href: "https://www.twitter.com/velvetrose.ir", icon: 'X' },
  { label: "تلگرام", href: "https://www.facebook.com/velvetrose.ir", icon: 'Telegram' },
]

export const headerPages: MainMenuItem[] = [
  {
    text: 'محصولات',
    link: '/products',
    icon: 'Product',
  },
  {
    text: 'درباره ما',
    link: '/about',
    icon: 'About',
  },
  {
    text: 'تماس با ما',
    link: '/contact',
    icon: 'Contact',
    children: [
      ...headerContact,
      ...headerSocials,
    ]
  },
  {
    text: 'مجله',
    link: '/mag',
    icon: 'Mag',
  }
]


export const headerTabs: Tab[] = [
  {
    id: 'productCategories',
    label: 'دسته‌بندی‌ها',
    icon: 'mdi-store-outline'
  },
  {
    id: 'websitePages',
    label: 'صفحات و تماس',
    icon: 'mdi-menu'
  }
]