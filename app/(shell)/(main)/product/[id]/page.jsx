// pages/product/[id].js
import { useQuery } from '@apollo/client';
import { 
  GET_PRODUCT, 
  GET_PRODUCT_VERSIONS, 
  GET_DESIGN_CONCEPTS, 
  GET_AI_SUGGESTIONS, 
  GET_DESIGN_ELEMENTS, 
  GET_MEDIA_FILES, 
  GET_USER_DETAILS 
} from '@/app/(main)/queries';

// Constants for fixed values
const PRODUCT_ID = 'cm14mvs2o000fue6yh6hb13yn';
const ORGANIZATION_ID = 'cm14mvrwe0000ue6ygx7gfevr';
const USER_ID = 'cm14mvrxe0002ue6ygbc4yyzr';
const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph';
const DOMAIN_ID = 'cm14mvrxe0008ue6y9xr15bph'; // Example domain ID for simplicity

const ProductPage = () => {
  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  
  // Fetch product versions
  const { data: versionsData, loading: versionsLoading, error: versionsError } = useQuery(GET_PRODUCT_VERSIONS, { variables: { productId: PRODUCT_ID } });
  
  // Fetch design concepts
  const { data: conceptsData, loading: conceptsLoading, error: conceptsError } = useQuery(GET_DESIGN_CONCEPTS, { variables: { productId: PRODUCT_ID } });
  
  // Fetch AI suggestions
  const { data: aiSuggestionsData, loading: aiSuggestionsLoading, error: aiSuggestionsError } = useQuery(GET_AI_SUGGESTIONS, { variables: { productId: PRODUCT_ID } });

  // Fetch user details
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_DETAILS, { variables: { userId: USER_ID } });

  if (productLoading || versionsLoading || conceptsLoading || aiSuggestionsLoading || userLoading) return <p>Loading...</p>;
  if (productError || versionsError || conceptsError || aiSuggestionsError || userError) return <p>Error loading data.</p>;

  const product = productData.Product;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.primaryPhoto} alt={product.name} />
      <div>
        <h2>Image Gallery</h2>
        {product.imageGallery.map((url, index) => (
          <img key={index} src={url} alt={`Gallery ${index}`} />
        ))}
      </div>

      <h2>Versions</h2>
      {versionsData.ProductVersion.map(version => (
        <div key={version.id}>
          <p>Version {version.versionNumber}</p>
          <p>{version.changes}</p>
        </div>
      ))}

      <h2>Design Concepts</h2>
      {conceptsData.DesignConcept.map(concept => (
        <div key={concept.id}>
          <p>{concept.title}</p>
          <img src={concept.image} alt={concept.title} />
          {/* Fetch and render design elements for this concept */}
        </div>
      ))}
      
      {/* Example of fetching and rendering design elements for the first concept */}
      {conceptsData.DesignConcept.length > 0 && (
        <DesignElementsForConcept designConceptId={conceptsData.DesignConcept[0].id} />
      )}
      
      <h2>AI Suggestions</h2>
      {aiSuggestionsData.AISuggestion.map(suggestion => (
        <div key={suggestion.id}>
          <p>{suggestion.content}</p>
        </div>
      ))}

      <h2>User Details</h2>
      {userData.User && (
        <div>
          <p>Username: {userData.User.username}</p>
          <p>Email: {userData.User.email}</p>
          <p>Role: {userData.User.role}</p>
        </div>
      )}
    </div>
  );
};

// Component to fetch and render design elements for a specific design concept
const DesignElementsForConcept = ({ designConceptId }) => {
  const { data: elementsData, loading: elementsLoading, error: elementsError } = useQuery(GET_DESIGN_ELEMENTS, { variables: { designConceptId } });

  if (elementsLoading) return <p>Loading design elements...</p>;
  if (elementsError) return <p>Error loading design elements.</p>;

  return (
    <div>
      <h3>Design Elements</h3>
      {elementsData.DesignElement.map(element => (
        <div key={element.id}>
          <p>Element Type: {element.elementType}</p>
          <p>Current Version: {element.currentVersion}</p>
        </div>
      ))}
    </div>
  );
};



export default ProductPage;
