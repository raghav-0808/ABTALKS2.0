import { useState } from "react";

const nodes = [
  { id: "ai", label: "AI", x: 50, y: 18, r: 26 },
  { id: "web", label: "Web", x: 18, y: 40, r: 22 },
  { id: "cloud", label: "Cloud", x: 82, y: 38, r: 22 },
  { id: "java", label: "Java", x: 28, y: 76, r: 20 },
  { id: "sec", label: "Security", x: 72, y: 78, r: 20 },
  { id: "hub", label: "You", x: 50, y: 52, r: 30 },
];

const edges: [string, string][] = [
  ["hub", "ai"],
  ["hub", "web"],
  ["hub", "cloud"],
  ["hub", "java"],
  ["hub", "sec"],
  ["ai", "cloud"],
  ["web", "java"],
  ["cloud", "sec"],
];

const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

export function HeroNetwork() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <div className="animate-orbit absolute inset-6 rounded-full bg-primary/10 blur-3xl" />
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="An interactive network of ABTalks community topics connected to you"
        className="relative h-full w-full"
      >
        {edges.map(([from, to]) => {
          const a = byId[from]!;
          const b = byId[to]!;
          const highlighted = active === from || active === to;
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeWidth={highlighted ? 0.7 : 0.35}
              className={
                highlighted ? "text-primary transition-all" : "text-border transition-all"
              }
            />
          );
        })}
        {nodes.map((node) => {
          const isActive = active === node.id;
          const isHub = node.id === "hub";
          return (
            <g
              key={node.id}
              tabIndex={0}
              role="button"
              aria-label={`${node.label} community`}
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r / 3.2}
                className={
                  isHub
                    ? "fill-primary/25 stroke-primary"
                    : isActive
                      ? "fill-accent/25 stroke-accent"
                      : "fill-card stroke-border"
                }
                strokeWidth={0.5}
              />
              <text
                x={node.x}
                y={node.y + 1.2}
                textAnchor="middle"
                className="pointer-events-none fill-foreground text-[3px] font-medium"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
