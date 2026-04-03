function CityFilters({ cities, activeCity, onSelect }) {
  return (
    <div className="search-panel__filter-block search-panel__filter-block--cities">
      <p className="search-panel__filter-label" id="search-panel-city-label">
        Location
      </p>
      <div
        className="search-panel__chip-row search-panel__chip-row--cities"
        role="group"
        aria-labelledby="search-panel-city-label"
      >
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            className={`search-panel__chip search-panel__chip--city ${activeCity === city ? 'is-active' : ''}`}
            onClick={() => onSelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CityFilters
