import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/splash-screen/splash-screen";
import { ReduxProvider } from "@/redux/Provider";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alazhargraduates.in";

export async function generateMetadata() {
  let siteLogo = `${siteUrl}/logo.png`;
  let favicon = `${siteUrl}/favicon.ico`;
  let seoTitle = "World Association for Al-Azhar Graduates - India Branch";
  let seoDesc = "The India Branch works to connect Al-Azhar graduates throughout India and promote Al-Azhar's message of knowledge, moderation, dialogue and service.";
  let seoKeywords = [
    "Al-Azhar Graduates",
    "World Association for Al-Azhar Graduates",
    "Al-Azhar India Branch",
    "Islamic Scholarship",
  ];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    // Fetch site content
    const res = await fetch(`${apiUrl}/site-content`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      const logoContent = data?.contents?.find((c) => c.key === "site_logo");
      if (logoContent?.content) {
        const parsed = JSON.parse(logoContent.content);
        if (parsed.logo) siteLogo = parsed.logo;
        if (parsed.favicon) favicon = parsed.favicon;
      }

      const seoContent = data?.contents?.find((c) => c.key === "site_seo");
      if (seoContent?.content) {
        const parsed = JSON.parse(seoContent.content);
        if (parsed.title) seoTitle = parsed.title;
        if (parsed.description) seoDesc = parsed.description;
        if (parsed.keywords) seoKeywords = parsed.keywords.split(",").map(k => k.trim());
      }
    }
  } catch (error) {
    console.error("Failed to fetch settings for metadata:", error);
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seoTitle,
      template: `%s | ${seoTitle.split('-')[0].trim() || 'Website'}`,
    },
    description: seoDesc,
    keywords: seoKeywords,
    authors: [{ name: seoTitle }],
    creator: seoTitle,
    publisher: seoTitle,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: siteLogo,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: siteUrl,
      siteName: seoTitle,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport = {
  colorScheme: "light",
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  let seoTitle = "World Association for Al-Azhar Graduates - India Branch";
  let seoDesc = "The India Branch works to connect Al-Azhar graduates throughout India and promote Al-Azhar's message of knowledge, moderation, dialogue and service.";
  let siteLogo = `${siteUrl}/logo.png`;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${apiUrl}/site-content`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const seoContent = data?.contents?.find((c) => c.key === "site_seo");
      if (seoContent?.content) {
        const parsed = JSON.parse(seoContent.content);
        if (parsed.title) seoTitle = parsed.title;
        if (parsed.description) seoDesc = parsed.description;
      }
      const logoContent = data?.contents?.find((c) => c.key === "site_logo");
      if (logoContent?.content) {
        const parsed = JSON.parse(logoContent.content);
        if (parsed.logo) siteLogo = parsed.logo;
      }
    }
  } catch(e) {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoTitle,
    alternateName: "Al-Azhar Graduates",
    url: siteUrl,
    logo: siteLogo,
    description: seoDesc,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressCountry: "IN",
    },
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://youtube.com",
    ],
  };

  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){for(var i of r)i.unregister()})}`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cinzel:wght@400;500;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Aref+Ruqaa:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ReduxProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ReduxProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
