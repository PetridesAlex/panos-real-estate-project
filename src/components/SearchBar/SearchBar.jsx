import { Search } from 'lucide-react'
import './SearchBar.css'

function SearchBar() {
  return (
    <form className="search-bar card-luxury" onSubmit={(event) => event.preventDefault()}>
      <div className="search-bar__field">
        <label htmlFor="intent">Buy / Rent</label>
        <select id="intent" defaultValue="Buy">
          <option>Buy</option>
          <option>Rent</option>
        </select>
      </div>
      <div className="search-bar__field">
        <label htmlFor="location">Location</label>
        <select id="location" defaultValue="Limassol">
          <option>Limassol</option>
          <option>Nicosia</option>
          <option>Larnaca</option>
          <option>Paphos</option>
          <option>Protaras</option>
        </select>
      </div>
      <div className="search-bar__field">
        <label htmlFor="type">Type</label>
        <select id="type" defaultValue="Any">
          <option>Any</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Penthouse</option>
          <option>Holiday Home</option>
        </select>
      </div>
      <div className="search-bar__field">
        <label htmlFor="minPrice">Min Price</label>
        <input id="minPrice" type="number" placeholder="150000" />
      </div>
      <div className="search-bar__field">
        <label htmlFor="maxPrice">Max Price</label>
        <input id="maxPrice" type="number" placeholder="3000000" />
      </div>
      <button className="btn btn-gold search-bar__button" type="submit">
        <Search size={18} />
        Search
      </button>
    </form>
  )
}

export default SearchBar
