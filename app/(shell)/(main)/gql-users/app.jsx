"use client"
import React from 'react';
import { useQuery } from '@apollo/client';
import {GET_USERS} from './queries'; // Importing the query

export default function Example() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.User.map((user) => (
          <li key={user.id}>
            <p>User ID: {user.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
