export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold mb-2">EduJobs Scholars</h3>
          <p className="text-sm opacity-80">A comprehensive solution for managing information and registrations.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1">
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/csm" className="hover:text-blue-500">CSM</a></li>
            <li><a href="/login" className="hover:text-blue-500">Sign In</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Connect</h3>
          <div className="flex gap-3 text-xl">
            <a aria-label="WhatsApp" className="hover:text-green-500" href="https://wa.me/0787846344" target="_blank" rel="noreferrer">🟢</a>
            <a aria-label="Twitter" className="hover:text-sky-500" href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
            <a aria-label="LinkedIn" className="hover:text-blue-600" href="https://linkedin.com" target="_blank" rel="noreferrer">in</a>
            <a aria-label="Facebook" className="hover:text-blue-500" href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs opacity-70 py-3">© {new Date().getFullYear()} EduJobs Scholars</div>

      <a href="https://wa.me/0787846344" target="_blank" rel="noreferrer" aria-label="WhatsApp"
         className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-green-500 text-white grid place-items-center shadow-lg hover:scale-105 transition">
        ☎
      </a>
    </footer>
  )
}


