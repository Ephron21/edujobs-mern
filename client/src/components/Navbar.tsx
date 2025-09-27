import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded hover:text-blue-500 ${isActive ? 'text-blue-600 font-semibold' : ''}`

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:text-gray-100 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          EduJobs Scholars
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>
          <NavLink to="/apply" className={linkClass}>
            Apply
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/csm" className={linkClass}>
            CSM
          </NavLink>
        </nav>

        {/* Language and Theme Controls */}
        <div className="hidden md:flex items-center space-x-2">
          <select 
            className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800"
            defaultValue="EN"
          >
            <option value="EN">EN</option>
            <option value="FR">FR</option>
            <option value="RW">RW</option>
          </select>
          
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900">
          <nav className="px-4 py-2 space-y-1">
            <NavLink to="/" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Home
            </NavLink>
            <NavLink to="/services" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Services
            </NavLink>
            <NavLink to="/apply" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Apply
            </NavLink>
            <NavLink to="/contact" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Contact
            </NavLink>
            <NavLink to="/login" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Login
            </NavLink>
            <NavLink to="/register" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                 Register
              </NavLink>
            
            <NavLink to="/csm" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              CSM
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}
