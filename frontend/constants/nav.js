export const isGroup = (item) => item.children !== undefined

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "President's Message", href: "/founder-message" },
      { label: "Vision & Mission", href: "/vision-mission" },
      { label: "Objectives", href: "/objectives" },
      { label: "Management Team", href: "/team" },
      { label: "Awards & Recognition", href: "/awards" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    label: "Activities",
    children: [
      { label: "Programs & Activities", href: "/projects" },
      { label: "Events & Forums", href: "/events" },
      { label: "Crowdfunding", href: "/crowdfunding" },
    ],
  },
  { label: "Media Centre", href: "/news" },
  { label: "Publications & Resources", href: "/publications" },
  { label: "Gallery", href: "/gallery/photos" },
  { label: "Contact", href: "/contact" },
  { label: "Donate", href: "/donate" },
]

export const FOOTER_QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Programs & Activities", href: "/projects" },
  { label: "Events & Forums", href: "/events" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
  { label: "Donate", href: "/donate" },
]

export const FOOTER_RESOURCE_LINKS = [
  { label: "Publications & Resources", href: "/publications" },
  { label: "Media Centre", href: "/news" },
  { label: "Gallery", href: "/gallery/photos" },
  { label: "Crowdfunding", href: "/crowdfunding" },
  { label: "Awards", href: "/awards" },
  { label: "Testimonials", href: "/testimonials" },
]
