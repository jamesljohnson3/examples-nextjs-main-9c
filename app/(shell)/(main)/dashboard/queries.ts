import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData(
    $product_id: ID!
    $organization_id: ID!
    $user_id: ID!
    $workspace_id: ID!
    $domain_id: ID!
  ) {
    total_products: countProducts(organizationId: $organization_id)
    total_revenue: calculateRevenue(organizationId: $organization_id)
    
    recent_activities: getRecentActivities(userId: $user_id, organizationId: $organization_id) {
      name
      created_at
    }
    
    organizations: getOrganizations(userId: $user_id) {
      id
      name
      created_at
    }
    
    recent_design_elements: getDesignElements(domainId: $domain_id, organizationId: $organization_id) {
      id
      element_type
      created_at
    }
    
    recent_media_files: getMediaFiles(organizationId: $organization_id) {
      id
      name
      url
      created_at
    }
  }
`;

export const GET_USERS = gql`
  query {
    User(order_by: { createdAt: desc }, limit: 4) {
      id
    }
  }
`;


