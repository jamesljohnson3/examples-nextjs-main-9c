"use client"
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/home');
      const result = await res.json();
      setData(result.data);
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>{data.title}</h1>
      <img src={data.image} alt={data.title} />
      <p>Duration: {data.duration}</p>
      <p>Views: {data.views}</p>
      <p>Rating: {data.rating}</p>
      <p>Uploaded: {data.uploaded}</p>
      <p>Upvoted: {data.upvoted}</p>
      <p>Downvoted: {data.downvoted}</p>
      <a href={data.source} target="_blank" rel="noopener noreferrer">Watch Source</a>
      <div>
       
       
      </div>
    </div>
  );
}
