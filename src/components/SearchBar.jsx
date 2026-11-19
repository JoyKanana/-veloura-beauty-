import { useId } from 'react'

function SearchBar({ value, onChange, placeholder = 'Search...', label = 'Search' }) {
  const id = useId()

  return (
    <div className="search-bar">
      <label htmlFor={id} className="search-label">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  )
}

export default SearchBar
