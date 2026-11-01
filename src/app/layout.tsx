import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://anilpanchitha.dev';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Anil Panchitha | AI/ML Software Engineer',
  description:
    'Software Engineer specializing in Generative AI, LLMs, RAG, Python, FastAPI, Machine Learning and enterprise automation.',
  keywords: [
    'Anil Panchitha',
    'Software Engineer',
    'AI Engineer',
    'Machine Learning',
    'Generative AI',
    'LLMs',
    'RAG',
    'Python',
    'FastAPI',
    'Cisco Systems',
    'FarmerVerify AI',
  ],
  authors: [{ name: 'Anil Panchitha', url: appUrl }],
  creator: 'Anil Panchitha',
  publisher: 'Anil Panchitha',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anil Panchitha | AI/ML Software Engineer',
    description:
      'Software Engineer specializing in Generative AI, LLMs, RAG, Python, FastAPI, Machine Learning and enterprise automation.',
    url: appUrl,
    siteName: 'Anil Panchitha Engineering OS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/portrait_01.jpg',
        width: 1200,
        height: 630,
        alt: 'Anil Panchitha — AI/ML Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anil Panchitha | AI/ML Software Engineer',
    description:
      'Software Engineer specializing in Generative AI, LLMs, RAG, Python, FastAPI, Machine Learning and enterprise automation.',
    images: ['/portrait_01.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Person and WebSite schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Anil Panchitha',
        jobTitle: 'Software Engineer',
        worksFor: {
          '@type': 'Organization',
          name: 'Cisco Systems',
        },
        url: appUrl,
        image: `${appUrl}/portrait_01.jpg`,
        sameAs: [
          'https://github.com/Anilyadav1718',
          'https://www.linkedin.com/in/anil-panchitha-507694241/',
        ],
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Institute of Aeronautical Engineering',
        },
        knowsAbout: [
          'Artificial Intelligence',
          'Machine Learning',
          'Large Language Models',
          'Retrieval-Augmented Generation',
          'Python',
          'FastAPI',
          'Deep Learning',
        ],
      },
      {
        '@type': 'WebSite',
        name: 'Anil Panchitha Portfolio',
        url: appUrl,
        description:
          'Software Engineer specializing in Generative AI, LLMs, RAG, Python, FastAPI, Machine Learning and enterprise automation.',
        author: {
          '@type': 'Person',
          name: 'Anil Panchitha',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
