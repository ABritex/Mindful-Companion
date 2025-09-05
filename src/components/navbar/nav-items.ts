export const NAV_ITEMS = [
    {
        id: "get-help",
        section: "get help",
        href: "/get-help",
        label: "Get Help",
        links: [
            { href: "/get-help/crisis-hotline", label: "Crisis Hotline" },
            { href: "/get-help/emergency", label: "Emergency Services" },
            { href: "/get-help/immediate-help", label: "Immediate Help" },
        ],
    },
    {
        id: "about",
        section: "about",
        href: "/about",
        label: "About",
        links: [
            { href: "/about/mission-vision", label: "Mission & Vision" },
            { href: "/about/impact", label: "Our Impact" },
            { href: "/about/team", label: "Our Team" },
        ],
    },
    {
        id: "resources",
        section: "resources",
        href: "/resources",
        label: "Resources",
        links: [
            { href: "/resources/articles", label: "Articles" },
            { href: "/resources/videos", label: "Videos" },
            { href: "/resources/self-help", label: "Self-Help Tools" },
        ],
    },
    {
        id: "services",
        section: "services",
        href: "/services",
        label: "Services",
        links: [
            { href: "/services/individual-therapy", label: "Individual Therapy" },
            { href: "/services/online-programs", label: "Online Programs" },
        ],
    },
];

export const getNavItems = () => {
    return NAV_ITEMS.map(item => ({
        id: item.id,
        label: item.label,
        href: item.href || undefined,
    }));
};
