import { useState } from 'react';
import { SearchBar } from './components/SearchBar';

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-001');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#111827', margin: 0 }}>
          Comparador de Precios Históricos
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Monitoreo cronológico de 730 días en tiendas líderes de México
        </p>
      </header>

      <SearchBar
        selectedProductId={selectedProductId}
        onSelectProduct={(id) => setSelectedProductId(id)}
      />

      <section style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#374151' }}>
          Producto activo actualmente: <strong>{selectedProductId}</strong>
        </p>
      </section>
    </div>
  );
}