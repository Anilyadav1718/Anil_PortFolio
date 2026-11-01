import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Workstation // Anil Panchitha',
  description: 'Private administrative console for portfolio management',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D0D11] text-[#E4E4E7]">
      {children}
    </div>
  );
}
