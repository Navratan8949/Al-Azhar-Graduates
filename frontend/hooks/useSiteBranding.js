import { useSelector } from "react-redux"
import { SITE } from "@/constants/site"

export function useSiteBranding() {
  const { data: siteContent } = useSelector((state) => state.siteContent || { data: null })
  
  let branding = {
    siteName: SITE.name,
    shortName: SITE.shortName,
    logo: SITE.logo,
    favicon: "/favicon.ico"
  }

  if (siteContent?.site_logo?.content) {
    try {
      const parsed = JSON.parse(siteContent.site_logo.content)
      if (parsed.siteName) branding.siteName = parsed.siteName
      if (parsed.shortName) branding.shortName = parsed.shortName
      if (parsed.logo) branding.logo = parsed.logo
      if (parsed.favicon) branding.favicon = parsed.favicon
    } catch (e) {
      // ignore
    }
  }

  return branding
}
