// mutations.js or mutations.ts
import { gql } from '@apollo/client';

// Mutation to add a new version for a design element
export const ADD_DESIGN_ELEMENT_VERSION = gql`
  mutation AddDesignElementVersion(
    $designElementId: String!
    $versionNumber: Int!
    $elementData: Json!
    $screenshot: String!
    $createdById: String!
    $organizationId: String!
  ) {
    insert_DesignElementVersion_one(object: {
      designElementId: $designElementId
      versionNumber: $versionNumber
      elementData: $elementData
      screenshot: $screenshot
      createdById: $createdById
      organizationId: $organizationId
    }) {
      id
      versionNumber
      elementData
      screenshot
      createdById
      createdAt
    }
  }
`;

export const GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN = gql`
  query GetSegmentsByProductAndDomain($productId: String!, $domainId: String!) {
    Segment(where: { productId: { _eq: $productId }, domainId: { _eq: $domainId } }) {
      id
      name
      slug
      post
    }
  }
`;



// Query to get design element versions for a specific design element
export const GET_DESIGN_ELEMENT_VERSIONS = gql`
  query GetDesignElementVersions($designElementId: String!) {
    DesignElementVersion(where: { designElementId: { _eq: $designElementId } }) {
      id
      versionNumber
      elementData
      screenshot
      createdBy {
        id
        username
      }
      createdAt
    }
  }
`;


export const GET_DESIGN_ELEMENT_VERSION2S = gql`
  query GetDesignElementVersions($designElementId: String!, $versionNumber: Int!) {
    DesignElementVersion(
      where: { 
        designElementId: { _eq: $designElementId }, 
        versionNumber: { _eq: $versionNumber } 
      }
    ) {
      id
      versionNumber
      elementData
      
      createdAt
      blockchainHash
      ipfsHash
    }
  }
`;
export const GET_WORKSPACE = gql`
  query GetWorkspace($workspaceId: String!) {
    Workspace(where: { id: { _eq: $workspaceId } }) {
      id
     organizationId
     name
     createdAt
    }
  }
`;
// Query to get organization details
export const GET_ORGANIZATION = gql`
  query GetOrganization($organizationId: String!) {
    Organization(where: { id: { _eq: $organizationId } }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
// Define the queries
export const GET_PRODUCT = gql`
  query GetProduct($productId: String!) {
    Product(where: { id: { _eq: $productId } }) {
      id
      name
      price
      description
      primaryPhoto
      imageGallery
      metadata
      createdAt
      updatedAt
    }
  }
`;

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

export const GET_AI_SUGGESTIONS = gql`
  query GetAISuggestions($productId: String!) {
    AISuggestion(where: { productId: { _eq: $productId } }) {
      id
      content
      createdAt
    }
  }
`;



// Query to get design elements for a given domainId
export const GET_DESIGN_ELEMENTS = gql`
  query GetDesignElements($domainId: String!) {
    DesignElement(where: { domainId: { _eq: $domainId } }) {
      id
      domainId
      currentVersion
      createdAt
      updatedAt
    }
  }
`;


export const GET_MEDIA_FILES = gql`
  query GetMediaFiles($designElementId: String!) {
    MediaFile(where: { designElementId: { _eq: $designElementId } }) {
      id
      name
      url
      type
      createdAt
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails($userId: String!) {
    User(where: { id: { _eq: $userId } }) {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

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
