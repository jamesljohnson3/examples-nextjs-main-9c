import { gql } from '@apollo/client';

// Fetch product details
export const GET_PRODUCT = gql`
  query GetProduct($productId: String!) {
    Product(where: { id: { _eq: $productId } }) {
      id
      name
      description
      price
      quantity
      category
      organizationId
      createdById
      primaryPhoto
      imageGallery
      ogImage
      metadata
      createdAt
      updatedAt
    }
  }
`;

// Fetch product versions by product ID
export const GET_PRODUCT_VERSIONS = gql`
  query GetProductVersions($productId: String!) {
    ProductVersion(where: { productId: { _eq: $productId } }) {
      id
      versionNumber
      changes
      data
      createdAt
    }
  }
`;

// Fetch design concepts by product ID
export const GET_DESIGN_CONCEPTS = gql`
  query GetDesignConcepts($productId: String!) {
    DesignConcept(where: { productId: { _eq: $productId } }) {
      id
      title
      image
      createdAt
    }
  }
`;

// Fetch AI suggestions by product ID
export const GET_AI_SUGGESTIONS = gql`
  query GetAISuggestions($productId: String!) {
    AISuggestion(where: { productId: { _eq: $productId } }) {
      id
      content
      createdAt
    }
  }
`;

// Fetch design elements by design concept ID
export const GET_DESIGN_ELEMENTS = gql`
  query GetDesignElements($designConceptId: String!) {
    DesignElement(where: { designConceptId: { _eq: $designConceptId } }) {
      id
      domainId
      elementType
      currentVersion
      createdAt
      updatedAt
    }
  }
`;

// Fetch media files related to a design element by design element ID
export const GET_MEDIA_FILES = gql`
  query GetMediaFiles($designElementId: String!) {
    MediaFile(where: { designElements: { id: { _eq: $designElementId } } }) {
      id
      name
      url
      type
      createdAt
    }
  }
`;

// Fetch user details by user ID
export const GET_USER_DETAILS = gql`
  query GetUserDetails($userId: String!) {
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

// Fetch domain details by domain ID
export const GET_DOMAIN = gql`
  query GetDomain($domainId: String!) {
    Domain(where: { id: { _eq: $domainId } }) {
      id
      domain
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
