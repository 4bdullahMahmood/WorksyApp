export async function GET() {
    const users = [
      { id: 1, name: "Alice", role: "Contractor" },
      { id: 2, name: "Bob", role: "Handyman" },
      { id: 3, name: "Charlie", role: "HVAC Tech" }
    ];
  
    return Response.json(users);
  }