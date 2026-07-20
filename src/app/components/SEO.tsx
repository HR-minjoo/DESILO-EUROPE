import { Helmet } from "react-helmet-async";

const SITE_URL = "https://luxdesilo.ai";
const OG_IMAGE = "https://luxdesilo.ai/og-image.jpg";
const DEFAULT_DESCRIPTION =
  "HOLMES lets European banks detect cross-institutional fraud together, without any bank sharing its raw customer data. Built on fully homomorphic encryption, aligned with AMLR Article 75.";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({ title, description = DEFAULT_DESCRIPTION, canonical, ogImage = OG_IMAGE }: SEOProps) {
  const fullTitle = title.includes("DESILO") ? title : `${title} | DESILO Europe`;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="DESILO Europe" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Misc */}
      <meta name="theme-color" content="#06081A" />
    </Helmet>
  );
}
