import { gql, type TypedDocumentNode } from "@apollo/client";


export interface SearchResult {
    id: string;
    name: string;
    image: string;
    store: string;
}

export interface SearchResponse {
    searchProducts: SearchResult[];
}

export interface SearchProductsVariables {
    query: string;
}

export const SEARCH_PRODUCTS_QUERY : TypedDocumentNode<
    SearchResponse, 
    SearchProductsVariables> = gql`
    query SearchProducts($query: String!) {
        searchProducts(query: $query) {
            id
            name
            image
            store
        }
    }
`;  

export interface ProductInfo {
  id: string;
  name: string;
  image: string;
  brand?: string;
  model?: string;
  storage?: string;
  color?: string;
  category?: string;
}

export interface PriceStats {
  globalMin: number;
  globalMinDate: string;
  globalMinStore: string;
  globalMax: number;
  globalMaxDate: string;
  globalMaxStore: string;
  currentPrice: number;
  currentStore: string;
  currency: string;
}

export interface PricePoint {
  date: string;
  amazon?: number;
  mercadolibre?: number;
  walmart?: number;
  liverpool?: number;
}

export interface ProductDetail {
  product: ProductInfo;
  stats: PriceStats;
  history: PricePoint[];
}

export interface ProductDetailData {
  productDetail: ProductDetail;
}

export interface ProductDetailVariables {
  id: string;
}

export const PRODUCT_DETAIL_QUERY: TypedDocumentNode<
  ProductDetailData,
  ProductDetailVariables
> = gql`
  query GetProductDetail($id: ID!) {
    productDetail(id: $id) {
      product {
        id
        name
        image
        brand
        model
        storage
        color
        category
      }
      stats {
        globalMin
        globalMinDate
        globalMinStore
        globalMax
        globalMaxDate
        globalMaxStore
        currentPrice
        currentStore
        currency
      }
      history {
        date
        amazon
        mercadolibre
        walmart
        liverpool
      }
    }
  }
`;