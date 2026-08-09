import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Explore", to: "/explore" },
      { label: "Events", to: "/events" },
      { label: "Community", to: "/community" },
      { label: "Learn", to: "/learn" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Saved", to: "/saved" },
      { label: "Notifications", to: "/notifications" },
      { label: "ABTalks AI", to: "/ai" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <Hexagon className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-display text-lg font-semibold">ABTalks</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            An AI-powered community for students, developers, founders and technology
            enthusiasts. Learn together, build together, ship together.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ABTalks. Built as an open community project.
      </div>
    </footer>
  );
}
