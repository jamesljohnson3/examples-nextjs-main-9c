"use client"
import { useState } from 'react';
import { saveProductVersions, generateProductVersion } from '@/app/(shell)/(main)/queries';;

interface VersionProps {
  id: string;
  versions: Array<{
    id: string;
    versionNumber: number;
    changes: string;
    data: any;
    createdAt: string;
  }>;
}

const Version: React.FC<VersionProps> = ({ id, versions }) => {
  const [localVersions, setLocalVersions] = useState(versions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    const { status, message, savedVersions } = await saveProductVersions(id, localVersions);
    if (status === 200) {
      alert(message);
      setLocalVersions(savedVersions);  // Update local versions after save
    } else {
      setError(message);
    }
    setLoading(false);
  }

  async function handleGenerate() {
    setLoading(true);
    const { status, message, savedVersion } = await generateProductVersion(id);
    if (status === 200) {
      alert(message);
      setLocalVersions(prevVersions => [...prevVersions, savedVersion]);  // Append new version
    } else {
      setError(message);
    }
    setLoading(false);
  }

  return (
    <div>
      <ul>
        {localVersions.map(version => (
          <li key={version.id}>
            <strong>Version {version.versionNumber}:</strong>
            <p>Changes: {version.changes}</p>
            <pre>Data: {JSON.stringify(version.data, null, 2)}</pre>
            <p>Created At: {new Date(version.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      {/* Save and Generate Buttons */}
      <button onClick={handleSave} disabled={loading}>
        Save
      </button>
      <button onClick={handleGenerate} disabled={loading}>
        Generate New Version
      </button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Version;
