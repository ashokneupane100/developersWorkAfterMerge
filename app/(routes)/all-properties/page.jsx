import AllProperties from '../../_components/AllProperties';

export const metadata = {
  title: 'All Properties - Browse Complete Property Listings',
  description: 'Browse our complete database of properties for sale and rent. Find houses, apartments, land, and commercial properties with advanced filtering and search options.',
  keywords: 'real estate, properties for sale, properties for rent, houses, apartments, land, commercial properties',
  openGraph: {
    title: 'All Properties - Complete Property Listings',
    description: 'Browse our complete database of properties for sale and rent with advanced filtering options.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Properties - Complete Property Listings',
    description: 'Browse our complete database of properties for sale and rent with advanced filtering options.',
  },
};

export default function AllPropertiesPage() {
  return (
    <div>
      <AllProperties />
    </div>
  );
}