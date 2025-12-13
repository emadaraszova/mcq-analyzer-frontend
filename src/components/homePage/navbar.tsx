import { Link, useLocation } from "react-router-dom";

/** --- Top navigation bar with active link highlighting --- **/
const Navbar = () => {
  const { pathname } = useLocation();

  // --- Utility: determine active link styling ---
  const isActive = (path: string) =>
    pathname === path
      ? "text-sky-700 underline underline-offset-4"
      : "text-slate-600 hover:text-sky-700";

  // --- Layout ---
  return (
    <nav className="sticky top-0 z-60 w-full bg-blue-50 shadow-md py-4 px-6">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <ul className="flex gap-6 font-bold text-lg">
          <li>
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/generator" className={isActive("/generator")}>
              Generator
            </Link>
          </li>
          <li>
            <Link to="/analyzer" className={isActive("/analyzer")}>
              Analyzer
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
