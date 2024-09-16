"use client";
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { GET_DASHBOARD_DATA } from './queries'; // Importing the query


const DashboardPage = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Total Products</h2>
        <p>{data.totalProducts.aggregate.count}</p>
      </section>

      <section>
        <h2>Total Revenue</h2>
        <p>${data.totalRevenue.revenue.toFixed(2)}</p>
      </section>

      <section>
        <h2>Recent Activities</h2>
        <ul>
          {data.recentActivities.map((activity: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; createdAt: string | number | Date; }) => (
            <li key={activity.id}>
              <p><strong>{activity.name}</strong> - Created At: {new Date(activity.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Organizations</h2>
        <ul>
          {data.organizations.map((org: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; createdAt: string | number | Date; }) => (
            <li key={org.id}>
              <p><strong>{org.name}</strong> - Created At: {new Date(org.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Design Elements</h2>
        <ul>
          {data.recentDesignElements.map((element: { id: React.Key | null | undefined; elementType: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; createdAt: string | number | Date; }) => (
            <li key={element.id}>
              <p>Element Type: {element.elementType} - Created At: {new Date(element.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Media Files</h2>
        <ul>
          {data.recentMediaFiles.map((file: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; url: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined; createdAt: string | number | Date; }) => (
            <li key={file.id}>
              <p><strong>{file.name}</strong> - URL: <a>{file.url}</a> - Created At: {new Date(file.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;

