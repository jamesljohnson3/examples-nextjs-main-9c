import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DESIGN_ELEMENTS, GET_DOMAIN } from '@/app/(shell)/(main)/queries';

const DesignElementsForConcept = ({ designConceptId }) => {
  const [designElements, setDesignElements] = useState([]);
  const [domains, setDomains] = useState({});

  const { data: elementsData, loading: elementsLoading, error: elementsError } = useQuery(GET_DESIGN_ELEMENTS, { 
    variables: { designConceptId },
    skip: !designConceptId
  });

  useEffect(() => {
    if (elementsData) {
      setDesignElements(elementsData.DesignElement);

      // Fetch domains for each design element
      elementsData.DesignElement.forEach(async (element) => {
        const { data: domainData } = await client.query({
          query: GET_DOMAIN,
          variables: { domainId: element.domainId }
        });
        setDomains((prevDomains) => ({
          ...prevDomains,
          [element.domainId]: domainData.Domain
        }));
      });
    }
  }, [elementsData]);

  if (elementsLoading) return <p>Loading design elements...</p>;
  if (elementsError) return <p>Error loading design elements.</p>;

  return (
    <div>
      <h3>Design Elements</h3>
      {designElements.map(element => (
        <div key={element.id}>
          <p>Element Type: {element.elementType}</p>
          <p>Current Version: {element.currentVersion}</p>
          <p>Domain: {domains[element.domainId]?.domain || 'Loading domain...'}</p>
        </div>
      ))}
    </div>
  );
};

export default DesignElementsForConcept;
