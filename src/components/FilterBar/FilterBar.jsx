import { propertyStatuses, propertyTypes } from '../../data/properties'
import './FilterBar.css'

function FilterBar({ filters, setFilters, sort, setSort }) {
  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="filter-bar card-luxury">
      <div className="filter-bar__grid">
        <label>
          Location
          <select value={filters.location} onChange={(e) => updateFilter('location', e.target.value)}>
            <option value="">All</option>
            <option value="Limassol">Limassol</option>
            <option value="Nicosia">Nicosia</option>
            <option value="Larnaca">Larnaca</option>
            <option value="Paphos">Paphos</option>
            <option value="Protaras">Protaras</option>
          </select>
        </label>
        <label>
          Property Type
          <select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
            <option value="">All</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
            <option value="">All</option>
            {propertyStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Bedrooms
          <input
            min="0"
            type="number"
            value={filters.bedrooms}
            onChange={(e) => updateFilter('bedrooms', e.target.value)}
            placeholder="Any"
          />
        </label>
        <label>
          Bathrooms
          <input
            min="0"
            type="number"
            value={filters.bathrooms}
            onChange={(e) => updateFilter('bathrooms', e.target.value)}
            placeholder="Any"
          />
        </label>
        <label>
          Min Price
          <input
            min="0"
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            placeholder="No min"
          />
        </label>
        <label>
          Max Price
          <input
            min="0"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            placeholder="No max"
          />
        </label>
        <label>
          Keyword
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            placeholder="Title, area, feature"
          />
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="priceLow">Price low to high</option>
            <option value="priceHigh">Price high to low</option>
          </select>
        </label>
      </div>
    </section>
  )
}

export default FilterBar
