import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {structure} from './sanity.structure'

/** Put Media library first when picking images — grid supports multi-select (Shift/Cmd+click). */
function imageAssetSourcesWithMediaFirst<T extends {name: string}>(prev: T[]): T[] {
  const mediaSource = prev.find((s) => s.name === 'media')
  const rest = prev.filter((s) => s.name !== 'media')
  return mediaSource ? [mediaSource, ...rest] : prev
}

/** Bazaraki XML-aligned defaults — confirm rubric & district IDs in https://www.bazaraki.com/business-xml-guide/ */
const bazarakiRentDefaults = {
  status: 'for-rent',
  featured: false,
  currency: 'EUR',
  publishToBazaraki: false,
  bazarakiListingStatus: 'active',
  bazarakiRubric: 682,
  phoneHide: false,
  negotiablePrice: false,
  exchange: false,
  disallowChat: false,
  delivery: 0,
}

const bazarakiSaleDefaults = {
  status: 'for-sale',
  featured: false,
  currency: 'EUR',
  publishToBazaraki: false,
  bazarakiListingStatus: 'active',
  phoneHide: false,
  negotiablePrice: false,
  exchange: false,
  disallowChat: false,
  delivery: 0,
}

export default defineConfig({
  name: 'default',
  title: 'United Properties',

  projectId: 'd7j11dpu',
  dataset: 'production',

  plugins: [
    media({
      creditLine: {enabled: false},
      directUploads: true,
      maximumUploadSize: 25000000,
    }),
    structureTool({structure}),
    visionTool(),
  ],

  form: {
    image: {
      assetSources: imageAssetSourcesWithMediaFirst,
    },
  },

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'property-for-sale',
        title: 'Property: Buy (for sale)',
        schemaType: 'property',
        value: {status: 'for-sale', featured: false, currency: 'EUR'},
      },
      {
        id: 'property-for-rent',
        title: 'Property: Rent',
        schemaType: 'property',
        value: {status: 'for-rent', featured: false, currency: 'EUR'},
      },
      {
        id: 'property-featured',
        title: 'Property: Featured listing',
        schemaType: 'property',
        value: {status: 'for-sale', featured: true, currency: 'EUR'},
      },
      {
        id: 'property-signature',
        title: 'Property: Signature collection',
        schemaType: 'property',
        value: {status: 'for-sale', featured: false, signature: true, currency: 'EUR'},
      },
      {
        id: 'property-new-development',
        title: 'Property: New development listing',
        schemaType: 'property',
        value: {status: 'for-sale', featured: false, newDevelopment: true, currency: 'EUR'},
      },
      {
        id: 'property-bazaraki-rent',
        title: 'Property: Bazaraki (rent) — XML defaults',
        schemaType: 'property',
        value: bazarakiRentDefaults,
      },
      {
        id: 'property-bazaraki-sale',
        title: 'Property: Bazaraki (sale) — set rubric ID',
        schemaType: 'property',
        value: bazarakiSaleDefaults,
      },
      {
        id: 'development-new',
        title: 'Development: New',
        schemaType: 'development',
        value: {status: 'off-plan', featured: false},
      },
    ],
  },
})
