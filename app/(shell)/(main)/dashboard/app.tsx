"use client";
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '@/app/(shell)/(main)/queries'; // Importing the query


export default function HomePage() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA, {
    variables: {
      organizationId: 'cm14mvrwe0000ue6ygx7gfevr', // Replace with dynamic value if needed
      userId: 'cm14mvrxe0002ue6ygbc4yyzr', // Replace with dynamic value if needed
    }, 
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Products</h1>
      {data.Product.map((product: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <a href={`/product/$${product.id}`}>edit product</a>
          {/* Render more product details */}
        </div>
      ))}

      <h1>Organization</h1>
      {data.Organization.map((org: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; createdAt: string | number | Date; }) => (
        <div key={org.id}>
          <h2>{org.name}</h2>
          <p>Created At: {new Date(org.createdAt).toLocaleDateString()}</p>
          {/* Render more organization details */}
        </div>
      ))}

      <h1>User</h1>
      {data.User.map((user: { id: React.Key | null | undefined; username: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; role: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
        <div key={user.id}>
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          {/* Render more user details */}
        </div>
      ))}
    </div>
  );
}