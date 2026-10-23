import type { PriceStats } from "../graphql/products.queries";


interface PriceStatsCardsProps {
  stats: PriceStats;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PriceStatsCards({ stats }: PriceStatsCardsProps) {
  const discountFromMax = Math.round(
    ((stats.globalMax - stats.currentPrice) / stats.globalMax) * 100,
  );

  return (
    <div className="stats-grid">
      <div className="stat-card current-stat">
        <span className="stat-label">Precio Más Bajo Hoy</span>
        <div className="stat-value">{formatCurrency(stats.currentPrice, stats.currency)}</div>
        <div className="stat-footer">
          Encontrado en <span className={`store-tag store-${stats.currentStore}`}>{stats.currentStore}</span>
        </div>
      </div>

      <div className="stat-card min-stat">
        <span className="stat-label">Mínimo Histórico (2 años)</span>
        <div className="stat-value text-green">{formatCurrency(stats.globalMin, stats.currency)}</div>
        <div className="stat-footer">
          <span>{stats.globalMinDate}</span> · <span className={`store-tag store-${stats.globalMinStore}`}>{stats.globalMinStore}</span>
        </div>
      </div>

      <div className="stat-card max-stat">
        <span className="stat-label">Máximo Registrado</span>
        <div className="stat-value text-red">{formatCurrency(stats.globalMax, stats.currency)}</div>
        <div className="stat-footer">
          <span>{stats.globalMaxDate}</span> · <span className={`store-tag store-${stats.globalMaxStore}`}>{stats.globalMaxStore}</span>
        </div>
      </div>

      <div className="stat-card saving-stat">
        <span className="stat-label">Margen vs. Techo Histórico</span>
        <div className="stat-value text-blue">
          {discountFromMax > 0 ? `-${discountFromMax}%` : 'Precio pico'}
        </div>
        <div className="stat-footer">
          Ahorro potencial de {formatCurrency(stats.globalMax - stats.currentPrice, stats.currency)}
        </div>
      </div>
    </div>
  );
}