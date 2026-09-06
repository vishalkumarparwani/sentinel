import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getIssues } from '../api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [issues, setIssues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (err) {
        console.log('Failed to load issues: ', err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = query.toLowerCase();

  const results = query.trim()
    ? issues.filter((item) =>
        (item.title || '').toLowerCase().includes(q) ||
        String(item.id).includes(q) ||
        (item.service || '').toLowerCase().includes(q) ||
        (item.priority || '').toLowerCase().includes(q) ||
        (item.status || '').toLowerCase().includes(q) ||
        (item.severity || '').toLowerCase().includes(q)
      )
    : [];

  function handleSelect(issue) {
    setQuery('');
    setIsOpen(false);
    navigate('/issues', { state: { highlightId: issue.id } });
  }

  return (
    <div className="relative w-80" ref={containerRef}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />

      <input
        type="text"
        placeholder="Search specs, tickets, or AC criteria..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full bg-theme-secondary border border-theme-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-text/40"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full rounded-lg border border-theme-border bg-theme-primary shadow-xl z-50 max-h-64 overflow-y-auto">
          {results.map((issue) => (
            <button
              key={issue.id}
              onClick={() => handleSelect(issue)}
              className="w-full text-left px-3 py-2 text-xs text-theme-text hover:bg-theme-secondary transition-colors border-b border-theme-border last:border-0"
            >
              <span className="font-mono text-theme-muted mr-2">
                ISS-{issue.id}
              </span>

              {issue.title}
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute mt-1 w-full rounded-lg border border-theme-border bg-theme-primary shadow-xl z-50 px-3 py-2 text-xs text-theme-muted">
          No matching issues.
        </div>
      )}
    </div>
  );
}