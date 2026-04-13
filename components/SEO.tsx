import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Ethereum Arabia',
  publishedTime,
  modifiedTime,
  category
}) => {
  const siteName = 'إيثريوم العرب - Ethereum Arabia';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'المنصة العربية الأولى لتعلم أمن إيثريوم والخصوصية المالية. دروس تفاعلية، ألعاب أمان، ومقالات تعليمية متخصصة.';
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || 'Ethereum Arabia, إيثريوم العرب, Ethereum, Security, Crypto, Privacy, Blockchain, Arabic, Academy, أمن المعلومات, إيثريوم, بلوكشين, خصوصية';
  const siteUrl = 'https://academy.ethereum-arabia.xyz';
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;
  const metaImage = image || `${siteUrl}/logo.png`;

  return (
    <Helmet>
      {}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={metaUrl} />

      {}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />

      {}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@EthArabia" />

      {}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}

      {}
      <script type="application/ld+json">
        {JSON.stringify({
          "@type": type === 'course' ? 'Course' : type === 'article' ? 'Article' : 'WebSite',
          "name": fullTitle,
          "description": metaDescription,
          "url": metaUrl,
          "image": metaImage,
          ...(type === 'article' && {
            "datePublished": publishedTime,
            "dateModified": modifiedTime,
            "author": {
              "@type": "Person",
              "name": author
            }
          }),
          ...(type === 'course' && {
            "provider": {
              "@type": "Organization",
              "name": "إيثريوم العرب",
              "sameAs": siteUrl
            }
          })
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
