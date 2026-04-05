import type {StructureResolver} from 'sanity/structure'

const HIDDEN_TYPES = new Set(['property', 'development', 'bazarakiSettings', 'media.tag'])

/**
 * Desk sidebar: same `property` documents appear in more than one list when they match
 * (e.g. for sale + featured). Editors set flags on one document — these are views, not folders.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Bazaraki integration')
        .id('bazarakiSettingsSingleton')
        .child(
          S.document().schemaType('bazarakiSettings').documentId('bazarakiSettings').title('Bazaraki integration'),
        ),

      S.divider(),

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

      S.listItem()
        .title('New development (off-plan units)')
        .id('properties-new-development')
        .schemaType('property')
        .child(
          S.documentList()
            .title('New development listings — flag on the property')
            .filter('_type == "property" && newDevelopment == true'),
        ),

      S.divider(),

      S.listItem()
        .title('Bazaraki feed (flagged)')
        .schemaType('property')
        .child(
          S.documentList()
            .title('Include in Bazaraki XML')
            .filter('_type == "property" && publishToBazaraki == true'),
        ),

      S.divider(),

      S.listItem()
        .title('Development projects')
        .schemaType('development')
        .child(S.documentTypeList('development').title('Development projects (schemas)')),

      ...S.documentTypeListItems().filter((item) => !HIDDEN_TYPES.has(item.getId() ?? '')),
    ])
