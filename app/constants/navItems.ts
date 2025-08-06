export interface NavItem {
    label: string;
    to: string;
}

export const navItems: NavItem[] = [
    { label: "صفحه اصلی", to: "/" },
    { label: "محصولات", to: "/products" },
    { label: "درباره ما", to: "/about-us" },
];

export interface ContactItem {
    label: string;
    value?: string;
    icon?: string;
    href: string;
    target?: string;
}
    
export const contactItems: ContactItem[] = [
    { label: "ایمیل: info@velvetrose.com", href: "mailto:info@velvetrose.com" },
    { label: "شماره تماس: 1122 933 98+", href: "tel:+98112293398" },
];

export interface SocialItem {
    label: string;
    href: string;
    icon: string;
}

export const socialItems: SocialItem[] = [
    { label: "اینستاگرام", href: "https://www.instagram.com/velvetrose.ir", icon: 'Instagram' },
    { label: "توییتر", href: "https://www.twitter.com/velvetrose.ir", icon: 'X' },
    { label: "تلگرام", href: "https://www.facebook.com/velvetrose.ir", icon: 'Telegram' },
];