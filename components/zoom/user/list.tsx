"use client";

import { useZoomUsers } from "@/hooks/use-zoom-users";

export default function ZoomUserList() {
  const { data, isLoading, error } = useZoomUsers();

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {(error as Error).message}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((user) => (
        <div key={user.id} className="border p-4 rounded shadow">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
      ))}
    </div>
  );
}
