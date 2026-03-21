import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../services/api';
import { Product } from '../../types';

export default function SearchDropdown() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productApi.getAll({ search: query, limit: 5 }),
    enabled: query.length >= 2,
  });

  const results: Product[] = data?.data?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const product = results[selectedIndex];
      window.location.href = `/products/${product.id}`;
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="search-highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos..."
          className="w-48 lg:w-64 pl-9 pr-8 py-2 text-sm bg-rose-50 dark:bg-stone-700 border border-rose-100 dark:border-stone-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 placeholder-stone-400 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-stone-800 border border-rose-100 dark:border-stone-600 rounded-xl shadow-xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-stone-400 text-sm">
              No se encontraron productos para "{query}"
            </div>
          ) : (
            <>
              {results.map((product, i) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-rose-50 dark:hover:bg-stone-700 transition-colors ${
                    i === selectedIndex ? 'bg-rose-50 dark:bg-stone-700' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-stone-600 overflow-hidden flex-shrink-0">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-rose-300 text-lg">✂️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 dark:text-white truncate">
                      {highlightMatch(product.name)}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-400 truncate">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency', currency: 'COP', maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>
                  {!product.stock && (
                    <span className="text-xs text-red-400">Agotado</span>
                  )}
                </Link>
              ))}
              <Link
                to={`/products?search=${encodeURIComponent(query)}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="block px-4 py-3 text-center text-sm text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-stone-700 border-t border-rose-50 dark:border-stone-700 font-medium transition-colors"
              >
                Ver todos los resultados para "{query}"
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
