/**
 * Hero quick picks — opens SearchPanel with city / category / query seeds.
 * Cities and categories stay aligned with `searchDiscoveryProperties` (searchCities / searchCategories).
 */
export const heroSearchSuggestionGroups = [
  {
    id: 'cities',
    label: 'Cities',
    items: [
      { id: 'cy-limassol', label: 'Limassol', variant: 'city', seed: { city: 'Limassol', query: '' } },
      { id: 'cy-nicosia', label: 'Nicosia', variant: 'city', seed: { city: 'Nicosia', query: '' } },
      { id: 'cy-paphos', label: 'Paphos', variant: 'city', seed: { city: 'Paphos', query: '' } },
      { id: 'cy-larnaca', label: 'Larnaca', variant: 'city', seed: { city: 'Larnaca', query: '' } },
      { id: 'cy-protaras', label: 'Protaras', variant: 'city', seed: { city: 'Protaras', query: '' } },
      { id: 'cy-ayia-napa', label: 'Ayia Napa', variant: 'city', seed: { city: 'Ayia Napa', query: '' } },
    ],
  },
  {
    id: 'listings',
    label: 'Listings',
    items: [
      {
        id: 'cat-featured',
        label: 'Featured',
        variant: 'category',
        seed: { category: 'Featured Properties' },
      },
      {
        id: 'cat-new-dev',
        label: 'New developments',
        variant: 'category',
        seed: { category: 'New Developments' },
      },
      {
        id: 'cat-signature',
        label: 'Signature',
        variant: 'category',
        seed: { category: 'Signature Listings' },
      },
    ],
  },
  {
    id: 'popular',
    label: 'Popular',
    items: [
      { id: 'kw-sea', label: 'Sea view', variant: 'keyword', seed: { query: 'sea view' } },
      { id: 'kw-marina', label: 'Marina', variant: 'keyword', seed: { query: 'marina' } },
      { id: 'kw-penthouse', label: 'Penthouse', variant: 'keyword', seed: { query: 'penthouse' } },
      { id: 'kw-villa', label: 'Villa', variant: 'keyword', seed: { query: 'villa' } },
      { id: 'kw-investment', label: 'Investment', variant: 'keyword', seed: { query: 'investment' } },
    ],
  },
]
