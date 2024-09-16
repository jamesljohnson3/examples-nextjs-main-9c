// queries.js
import { gql } from '@apollo/client';

// Query to get basic product details
export const GET_PRODUCT = gql`
  query Product($productId: String!) {
    Product(where: { id: { _eq: $productId } }) {
      id
      name
      description
      price
      quantity
      category
      primaryPhoto
      imageGallery
      ogImage
      metadata
      createdById
      createdAt
      updatedAt
      organizationId
    }
  }
`;

// Query to get product versions
export const GET_PRODUCT_VERSIONS = gql`
  query ProductVersions($productId: String!) {
    ProductVersion(where: { productId: { _eq: $productId } }) {
      id
      versionNumber
      changes
      data
      createdAt
    }
  }
`;

// Query to get design concepts for a product
export const GET_DESIGN_CONCEPTS = gql`
  query DesignConcepts($productId: String!) {
    DesignConcept(where: { productId: { _eq: $productId } }) {
      id
      title
      image
      createdAt
    }
  }
`;

// Query to get AI suggestions for a product
export const GET_AI_SUGGESTIONS = gql`
  query AISuggestions($productId: String!) {
    AISuggestion(where: { productId: { _eq: $productId } }) {
      id
      content
      createdAt
    }
  }
`;

// Query to get design elements for a design concept
export const GET_DESIGN_ELEMENTS = gql`
  query DesignElements($designConceptId: String!) {
    DesignElement(where: { designConcepts: { id: { _eq: $designConceptId } } }) {
      id
      domainId
      elementType
      currentVersion
    }
  }
`;

// Query to get media files related to a design element
export const GET_MEDIA_FILES = gql`
  query MediaFiles($designElementId: String!) {
    MediaFile(where: { designElements: { id: { _eq: $designElementId } } }) {
      id
      name
      url
      type
      createdAt
      updatedAt
    }
  }
`;

// Query to get user details
export const GET_USER_DETAILS = gql`
  query User($userId: String!) {
    User(where: { id: { _eq: $userId } }) {
      id
      username
      email
      organizationId
      role
      createdAt
      updatedAt
    }
  }
`;

// Define the query
export const GET_DASHBOARD_DATA = gql`
  query MyQuery($organizationId: String!, $userId: String!) {
    Product(
      limit: 10
      where: { organizationId: { _eq: $organizationId } }
    ) {
      id
      name
      description
      price
      quantity
      category
      primaryPhoto
      imageGallery
      ogImage
      metadata
      createdById
      createdAt
      updatedAt
      organizationId
    }
    Organization(
      where: { id: { _eq: $organizationId } }
    ) {
      id
      name
      createdAt
      updatedAt
    }
    User(
      where: { id: { _eq: $userId } }
    ) {
      username
      email
      organizationId
      role
    }
  }
`;
