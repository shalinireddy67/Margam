import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://margam-learningspace.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/learn", "/privacy", "/terms", "/cookies"],
      disallow: ["/login", "/student", "/student/*", "/teacher", "/teacher/*", "/demo", "/api", "/api/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
