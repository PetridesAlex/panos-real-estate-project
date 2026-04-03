function CategoryFilters({ categories, activeCategory, onSelect, onReset }) {
  return (
    <div className="search-panel__filter-block search-panel__filter-block--categories">
      <div className="search-panel__filter-toolbar">
        <p className="search-panel__filter-label" id="search-panel-category-label">
          Listing type
        </p>
        <button type="button" className="search-panel__reset search-panel__reset--alt" onClick={onReset}>
          Clear all
        </button>
      </div>
      <div
        className="search-panel__chip-row search-panel__chip-row--categories"
        role="group"
        aria-labelledby="search-panel-category-label"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`search-panel__chip search-panel__chip--category ${
              activeCategory === category ? 'is-active' : ''
            }`}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilters
