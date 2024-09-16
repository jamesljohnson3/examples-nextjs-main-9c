import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the query
export const GET_DASHBOARD_DATA = gql`
  query {
    totalProducts: product_aggregate {
      aggregate {
        count
      }
    }
    totalRevenue: sum {
      revenue
    }
    recentActivities: activity(order_by: {createdAt: desc}, limit: 10) {
      id
      name
      createdAt
    }
    organizations: organization(order_by: {createdAt: desc}) {
      id
      name
      createdAt
    }
    recentDesignElements: designElement(order_by: {createdAt: desc}, limit: 10) {
      id
      elementType
      createdAt
    }
    recentMediaFiles: mediaFile(order_by: {createdAt: desc}, limit: 10) {
      id
      name
      url
      createdAt
    }
  }
`;
