export default async function Home() {
  // Fetch data from your backend API
  const res = await fetch("http://localhost:3000/api/users", { cache: "no-store" });
  const users = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Worksy Users 🚀</h1>
      <ul className="mt-6 space-y-2">
        {users.map(user => (
          <li key={user.id} className="border p-2 rounded">
            {user.name} — {user.role}
          </li>
        ))}
      </ul>
    </main>
  );
}
