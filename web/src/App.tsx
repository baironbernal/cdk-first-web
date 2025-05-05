import { useEffect, useState } from 'react'

interface Employee {
  id: string;
  name: string;
  possition: string;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://lifr6etgcj.execute-api.us-east-2.amazonaws.com/prod/empl', {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => {
        setEmployees(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <main className='w-full min-h-screen bg-amber-950 text-white p-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Employees</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && employees.length > 0 && (
        <ul className="space-y-4 max-w-xl mx-auto">
          {employees.map((emp) => (
            <li key={emp.id} className="bg-amber-800 p-4 rounded shadow">
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>Position:</strong> {emp.possition}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && employees.length === 0 && (
        <p className="text-center text-gray-400">No employees found.</p>
      )}
    </main>
  )
}

export default App