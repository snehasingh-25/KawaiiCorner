import React from "react";
import { Link } from "react-router-dom";

const NavItem = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="font-bold text-2xl px-2 py-1 rounded 
                 text-[color:var(--color-text-primary)]
                 hover:text-[color:var(--color-accent)]
                 transition-colors duration-200"
    >
      {children}
    </Link>
  );
};

export default NavItem;
