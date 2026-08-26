import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import baselineConfig from "#/raya/systems/baseline.json";
import terminalConfig from "#/raya/systems/terminal.json";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

type SystemChoice = "baseline" | "terminal" | "none";

const choices: SystemChoice[] = ["baseline", "terminal", "none"];

function applySystem(choice: SystemChoice) {
  const html = document.documentElement;
  if (choice === "none") {
    html.removeAttribute("data-raya");
  } else {
    html.setAttribute("data-raya", choice);
  }
}

function toggleDark() {
  document.documentElement.classList.toggle("dark");
}

function currentDark() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
}

function IndexRoute() {
  const [system, setSystem] = useState<SystemChoice>("none");
  const [dark, setDark] = useState(currentDark());

  const pick = (c: SystemChoice) => {
    applySystem(c);
    setSystem(c);
  };

  const flip = () => {
    toggleDark();
    setDark(currentDark());
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-10 font-sans">
      <header className="max-w-3xl mx-auto mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          PROTOTYPE — export round-trip (#5)
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          One component set, two Systems
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Both Systems were exported from the Studio model, served from a local
          registry at /r/*.json, and installed into this scratch TanStack Start
          app with the shadcn CLI. Switch below.
        </p>
      </header>

      <section className="max-w-3xl mx-auto mb-8 border border-border rounded-lg p-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground mr-1">Active System:</span>
        {choices.map((c) => (
          <button
            key={c}
            onClick={() => pick(c)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              system === c
                ? "bg-primary text-primary-foreground border-transparent"
                : "border-border hover:bg-accent"
            }`}
          >
            {c === "none" ? ":root (default)" : `data-raya="${c}"`}
          </button>
        ))}
        <button
          onClick={flip}
          className={`ml-auto px-3 py-1.5 text-sm rounded-md border ${
            dark
              ? "bg-primary text-primary-foreground border-transparent"
              : "border-border hover:bg-accent"
          }`}
        >
          .dark: {dark ? "on" : "off"}
        </button>
      </section>

      <section className="max-w-3xl mx-auto grid gap-6">
        <div className="raya-card">
          <h2 className="font-semibold">raya-card — knobs via CSS vars</h2>
          <p className="text-sm opacity-80">
            Padding/gap come from this System's card density knob. Buttons and
            badges below inherit variant/size defaults the same way.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="raya-button">Default action</button>
            <button className="raya-button">Secondary action</button>
            <span className="raya-badge">badge</span>
            <span className="raya-avatar">R</span>
            <span className="text-xs text-muted-foreground ml-auto font-mono">
              font: {system === "terminal" ? terminalConfig.fonts.sans[0] : baselineConfig.fonts.sans[0]}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[baselineConfig, terminalConfig].map((cfg) => (
            <div key={cfg.slug} className="border border-border rounded-lg p-4 text-sm">
              <div className="flex items-baseline justify-between">
                <strong>{cfg.name}</strong>
                <span className="text-xs text-muted-foreground">{cfg.isDefault ? "fills :root/.dark" : `data-raya="${cfg.slug}"`}</span>
              </div>
              <pre className="mt-2 text-xs bg-muted rounded p-2 overflow-x-auto">
                {JSON.stringify(cfg.knobs, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="rounded-lg p-5 bg-primary text-primary-foreground">
          <p className="font-medium">Semantic tokens through Tailwind utilities</p>
          <p className="text-sm opacity-85">
            This block uses bg-primary / text-primary-foreground utilities mapped
            by raya-core's @theme inline bridge — they re-skin live when the
            System switches.
          </p>
        </div>
      </section>
    </div>
  );
}
