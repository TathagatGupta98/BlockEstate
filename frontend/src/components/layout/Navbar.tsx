import { NavLink } from "react-router-dom";

const links = [
  { to: "/society", label: "Society" },
  { to: "/proposals", label: "Proposals" },
  { to: "/payments", label: "Payments" }
];

export default function Navbar() {
  return (
    <nav className="flex gap-6 border-b border-taupe px-8 py-4">
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            isActive ? "text-gold" : "text-cream hover:text-gold"
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
