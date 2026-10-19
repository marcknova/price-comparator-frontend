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
