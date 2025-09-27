export default function Files() {
  // For a real file index, you'd add a backend route. Here we link to uploads root.
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Files</h2>
      <p className="text-sm opacity-80 mb-2">Browse uploaded files directory.</p>
      <a className="text-blue-600 underline" href="/uploads/" target="_blank" rel="noreferrer">Open uploads folder</a>
    </div>
  )
}


