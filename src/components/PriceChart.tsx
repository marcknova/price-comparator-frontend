import ReactECharts from 'echarts-for-react';
import type { PricePoint } from '../graphql/products.queries';

interface PriceChartProps {
  history: PricePoint[];
  productName: string;
}

const STORE_COLORS = {
  amazon: '#ea580c',        
  mercadolibre: '#ca8a04',  
  walmart: '#2563eb',       
  liverpool: '#db2777',  
};

export function PriceChart({ history, productName }: PriceChartProps) {
  const dates = history.map((p) => p.date);
  const amazonPrices = history.map((p) => p.amazon ?? null);
  const mlPrices = history.map((p) => p.mercadolibre ?? null);
  const walmartPrices = history.map((p) => p.walmart ?? null);
  const liverpoolPrices = history.map((p) => p.liverpool ?? null);

  const option = {
    title: {
      text: 'Histórico de Precios (730 días)',
      subtext: productName,
      left: 10,
      top: 10,
      textStyle: { fontSize: 16, fontWeight: 600, color: '#111827' },
      subtextStyle: { fontSize: 12, color: '#6b7280' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any[]) => {
        if (!params || params.length === 0) return '';
        const date = params[0].axisValue;
        let html = `<div style="font-weight:600; margin-bottom: 6px;">${date}</div>`;
        params.forEach((item) => {
          if (item.value !== null && item.value !== undefined) {
            const formatted = new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              maximumFractionDigits: 0,
            }).format(item.value);
            html += `
              <div style="display:flex; justify-content:space-between; gap:16px; margin: 2px 0;">
                <span>${item.marker} ${item.seriesName}</span>
                <span style="font-weight:600;">${formatted}</span>
              </div>
            `;
          }
        });
        return html;
      },
    },
    legend: {
      data: ['Amazon', 'Mercado Libre', 'Walmart', 'Liverpool'],
      top: 15,
      right: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#9ca3af' } },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: (val: number) => `$${val.toLocaleString('es-MX')}`,
      },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 85, // Mostrar por defecto el último 15% del histórico (~100 días)
        end: 100,
        bottom: 10,
        height: 24,
      },
      {
        type: 'inside',
        xAxisIndex: [0],
      },
    ],
    series: [
      {
        name: 'Amazon',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: amazonPrices,
        itemStyle: { color: STORE_COLORS.amazon },
        lineStyle: { width: 2.2 },
      },
      {
        name: 'Mercado Libre',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: mlPrices,
        itemStyle: { color: STORE_COLORS.mercadolibre },
        lineStyle: { width: 2.2 },
      },
      {
        name: 'Walmart',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: walmartPrices,
        itemStyle: { color: STORE_COLORS.walmart },
        lineStyle: { width: 2.2 },
      },
      {
        name: 'Liverpool',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: liverpoolPrices,
        itemStyle: { color: STORE_COLORS.liverpool },
        lineStyle: { width: 2.2 },
      },
    ],
  };

  return (
    <div className="chart-wrapper">
      <ReactECharts option={option} style={{ height: '480px', width: '100%' }} />
    </div>
  );
}