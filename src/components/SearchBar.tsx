import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useDebounce } from '../hooks/useDebounce';
import {
  SEARCH_PRODUCTS_QUERY,
  type SearchResult,
} from '../graphql/products.queries';
import './SearchBar.css';

interface SearchBarProps {
  onSelectProduct: (productId: string) => void;
  selectedProductId: string | null;
}

export function SearchBar({ onSelectProduct, selectedProductId }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(searchTerm.trim(), 300);

  const { data, loading } = useQuery(SEARCH_PRODUCTS_QUERY, {
    variables: { query: debouncedQuery },
    skip: debouncedQuery.length < 2,
    fetchPolicy: 'cache-first',
  });

  const results = data?.searchProducts ?? [];

  const handleSelect = (product: SearchResult) => {
    setSearchTerm(product.name);
    setIsOpen(false);
    onSelectProduct(product.id);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar producto (ej. iPhone, Sony, Nintendo)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {loading && <span className="search-spinner" />}
      </div>

      {isOpen && debouncedQuery.length >= 2 && (
        <ul className="search-dropdown">
          {results.length > 0 ? (
            results.map((item) => (
              <li
                key={item.id}
                className={`search-item ${item.id === selectedProductId ? 'active' : ''}`}
                onClick={() => handleSelect(item)}
              >
                <img src={item.image} alt={item.name} className="search-thumb" />
                <div className="search-info">
                  <span className="search-name">{item.name}</span>
                  <span className={`store-badge store-${item.store}`}>
                    {item.store}
                  </span>
                </div>
              </li>
            ))
          ) : (
            !loading && <li className="search-empty">No se encontraron productos</li>
          )}
        </ul>
      )}
    </div>
  );
}