import type {StructureResolver} from 'sanity/structure'
import {HomeIcon, ImagesIcon} from '@sanity/icons'

/** Hide desk duplicates + legacy types (even if an old dataset still contains those documents). */
const HIDDEN_TYPES = new Set([
  'property',
  'mediaCleanupHelp',
  'media.tag',
  'development',
  'bazarakiSettings',
])

/**
 * Desk sidebar: same `property` documents appear in more than one list when they match
 * (e.g. for sale + featured). Editors set flags on one document — these are views, not folders.
 * Full **Media** UI (grid, bulk upload, tags): use the **grid icon on the far-left sidebar** (not the top tabs). You can also browse raw image assets below under “All uploaded images”.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Properties')
        .icon(HomeIcon)
        .id('properties-hub')
        .child(
          S.list()
            .title('Properties')
            .items([
              S.listItem()
                .title('All properties')
                .schemaType('property')
                .child(S.documentTypeList('property').title('All properties')),

              S.listItem()
                .title('Buy (for sale)')
                .id('properties-buy')
                .schemaType('property')
                .child(
                  S.documentList()
                    .title('Buy — listing status: for sale')
                    .filter('_type == "property" && status == "for-sale"'),
                ),

              S.listItem()
                .title('Rent')
                .id('properties-rent')
                .schemaType('property')
                .child(
                  S.documentList()
                    .title('Rent — listing status: for rent')
                    .filter('_type == "property" && status == "for-rent"'),
                ),

              S.divider(),

              S.listItem()
                .title('Featured listings')
                .id('properties-featured')
                .schemaType('property')
                .child(
                  S.documentList()
                    .title('Featured — “Featured” is on in the property document')
                    .filter('_type == "property" && featured == true'),
                ),

              S.listItem()
                .title('Signature collection')
                .id('properties-signature')
                .schemaType('property')
                .child(
                  S.documentList()
                    .title('Signature collection — “Signature listing” is on')
                    .filter('_type == "property" && signature == true'),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('All uploaded images (list view)')
        .icon(ImagesIcon)
        .id('sanity-image-assets')
        .child(
          S.documentList()
            .title('Image assets — simple list (for bulk uploads + grid, use the Media icon on the left)')
            .filter('_type == "sanity.imageAsset"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
            .apiVersion('2024-01-01'),
        ),

      S.listItem()
        .title('Unused images (safe bulk delete)')
        .icon(ImagesIcon)
        .id('sanity-image-assets-unused')
        .child(
          S.documentList()
            .title('Unused image assets — references = 0')
            .filter('_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
            .apiVersion('2024-01-01'),
        ),

      S.listItem()
        .title('Media cleanup help')
        .id('mediaCleanupHelpSingleton')
        .child(S.document().schemaType('mediaCleanupHelp').documentId('mediaCleanupHelp').title('Media cleanup help')),

      S.divider(),

      ...S.documentTypeListItems().filter((item) => !HIDDEN_TYPES.has(item.getId() ?? '')),
    ])
