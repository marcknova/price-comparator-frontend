import { useQuery } from '@apollo/client/react';
import {
  PRODUCT_DETAIL_QUERY,
  type ProductDetailData,
  type ProductDetailVariables,
} from '../graphql/products.queries';
import { PriceStatsCards } from './PriceStatsCards';
import { PriceChart } from './PriceChart';
import './ProductDetailView.css';

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { data, loading, error } = useQuery<
    ProductDetailData,
    ProductDetailVariables
  >(PRODUCT_DETAIL_QUERY, {
    variables: { id: productId },
    fetchPolicy: 'cache-first',
  });

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner" />
        <p>Cargando serie cronológica de 730 días...</p>
      </div>
    );
  }

  if (error || !data?.productDetail) {
    return (
      <div className="detail-error">
        <p>Error al cargar el producto: {error?.message ?? 'Sin información'}</p>
      </div>
    );
  }

  const { product, stats, history } = data.productDetail;

  return (
    <div className="product-detail-view">
      <header className="product-header">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h2 className="product-title">{product.name}</h2>
          <div className="product-specs">
            {product.brand && <span><strong>Marca:</strong> {product.brand}</span>}
            {product.model && <span><strong>Modelo:</strong> {product.model}</span>}
            {product.storage && product.storage !== 'N/A' && (
              <span><strong>Capacidad:</strong> {product.storage}</span>
            )}
            {product.color && <span><strong>Color:</strong> {product.color}</span>}
          </div>
        </div>
      </header>

      <PriceStatsCards stats={stats} />

      <PriceChart history={history} productName={product.name} />
    </div>
  );
}