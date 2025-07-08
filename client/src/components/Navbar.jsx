const Navbar = () => {
  return (
    <nav className="fixed bottom-8 right-8 z-40">
      <ul className="space-y-3 text-sm  text-right">
        <li>
          <a href="/" className="text-gray-900 hover:text-gray-600 transition-colors block">
            Home
          </a>
        </li>
        <li>
          <a href="/list" className="text-gray-900 hover:text-gray-600 transition-colors block">
            List
          </a>
        </li>
        <li>
          <a href="/dict" className="text-gray-900 hover:text-gray-600 transition-colors block">
            Dictionary
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar