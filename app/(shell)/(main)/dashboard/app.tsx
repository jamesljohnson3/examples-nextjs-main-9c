"use client";
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from './queries'; // Importing the query

// Constants for fixed values
const PRODUCT_ID = 'cm14mvs2o000fue6yh6hb13yn';
const ORGANIZATION_ID = 'cm14mvrwe0000ue6ygx7gfevr';
const USER_ID = 'cm14mvrxe0002ue6ygbc4yyzr';
const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph';
const DOMAIN_ID = 'cm14mvrxe0008ue6y9xr15bph'; // Example domain ID for simplicity

const DashboardPage = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA, {
    variables: { 
      product_id: PRODUCT_ID, 
      organization_id: ORGANIZATION_ID, 
      user_id: USER_ID, 
      workspace_id: WORKSPACE_ID, 
      domain_id: DOMAIN_ID 
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Total Products</h2>
        <p>{data.total_products}</p>
      </section>

      <section>
        <h2>Recent Activities</h2>
        <ul>
          {data.recent_activities.map((activity: any) => (
            <li key={activity.created_at}>
              <p><strong>{activity.name}</strong> - Created At: {activity.created_at}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Total Revenue</h2>
        <p>${data.total_revenue.toFixed(2)}</p>
      </section>

      <section>
        <h2>Organizations</h2>
        <ul>
          {data.organizations.map((org: any) => (
            <li key={org.id}>
              <p><strong>{org.name}</strong> - Created At: {org.created_at}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Design Elements</h2>
        <ul>
          {data.recent_design_elements.map((element: any) => (
            <li key={element.id}>
              <p>Element Type: {element.element_type} - Created At: {element.created_at}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Media Files</h2>
        <ul>
          {data.recent_media_files.map((file: any) => (
            <li key={file.id}>
              <p><strong>{file.name}</strong> - URL: <a href={file.url}>{file.url}</a> - Created At: {file.created_at}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
