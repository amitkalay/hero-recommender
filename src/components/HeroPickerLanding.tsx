import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swords, Search, Shield, Crosshair, Sparkles, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchHeroes,
  fetchRecentMatches,
  topHeroes,
  type HeroStat,
} from "@/lib/opendota";
import { HeroResults } from "@/components/HeroResults";

const ROLES = [
  { value: "carry", label: "Carry", desc: "Late-game damage dealer", icon: Crosshair },
  { value: "mid", label: "Midlaner", desc: "Solo lane tempo controller", icon: Sparkles },
  { value: "offlane", label: "Offlaner", desc: "Frontline initiator", icon: Shield },
  { value: "support", label: "Support", desc: "Vision & utility", icon: Users },
  { value: "hard-support", label: "Hard Support", desc: "Sacrificial protector", icon: Shield },
];

export function HeroPickerLanding() {
  const [steamId, setSteamId] = useState("");
  const [role, setRole] = useState<string>("");
  const [includeProfile, setIncludeProfile] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<HeroStat[] | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const canSubmit = steamId.trim().length > 0 && role.length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!steamId.trim()) {
      setError("Please enter your Steam ID.");
      return;
    }
    if (!role) {
      setError("Please pick a role before revealing heroes.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const [heroes, matches] = await Promise.all([
        fetchHeroes(),
        fetchRecentMatches(steamId),
      ]);
      const top = topHeroes(matches, heroes, 3);
      if (top.length === 0) {
        setError("Couldn't compute hero stats from the recent matches.");
      } else {
        setResults(top);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
      </div>

      {/* Floating embers (client-only to avoid hydration mismatch) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {mounted && Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-ember"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              boxShadow: "0 0 8px var(--ember)",
            }}
            animate={{ y: [-20, -120], opacity: [0, 1, 0] }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        {/* Header */}
        <motion.header
          initial={mounted ? { opacity: 0, y: -16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-surface-elevated glow-ember">
            <Swords className="h-7 w-7 text-ember" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-[0.18em] text-gradient-gold sm:text-4xl">
              Dota 2
            </h1>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Hero Picker
            </p>
          </div>
        </motion.header>

        <div className="ember-divider mx-auto mt-8 w-3/4 max-w-md opacity-60" />

        {/* Hero copy */}
        <motion.section
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mt-12 max-w-3xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-ember">
            <Sparkles className="h-3.5 w-3.5" /> Powered by your match history
          </p>
          <h2 className="font-display text-5xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Find Your <span className="text-gradient-ember">IMPerfect</span> Match
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Drop your Steam ID, choose a role, and we&apos;ll forge three hero recommendations
            tuned to your playstyle and recent performance.
          </p>
        </motion.section>

        {/* Form Card */}
        <motion.section
          initial={mounted ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="ornate-frame mx-auto mt-14 w-full max-w-2xl rounded-lg p-8 sm:p-10"
        >
          <form onSubmit={onSubmit} className="space-y-7">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
              <h3 className="font-display text-xl font-bold uppercase tracking-[0.25em] text-gold">
                Summon Recommendations
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            {/* Steam ID */}
            <div className="space-y-2">
              <label
                htmlFor="steamId"
                className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
              >
                Enter Your Steam ID <span className="text-ember">(or Dotabuff URL)</span>
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="steamId"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  placeholder="Salty_Pudge or 76561198..."
                  className="h-12 border-border bg-input/60 pl-10 font-body text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ember focus-visible:ring-ember/30"
                  maxLength={120}
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-3">
              <label className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Select Desired Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 border-border bg-input/60 font-body text-base text-foreground focus:border-ember focus:ring-ember/30 [&_svg]:text-ember">
                  <SelectValue placeholder="Choose your battlefield position…" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  {ROLES.map(({ value, label, desc, icon: Icon }) => (
                    <SelectItem key={value} value={value} className="py-3 focus:bg-secondary">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-ember" />
                        <div className="flex flex-col">
                          <span className="font-display font-semibold uppercase tracking-wide text-foreground">
                            {label}
                          </span>
                          <span className="text-xs text-muted-foreground">{desc}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Include Profile */}
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-secondary/40 p-4 transition-colors hover:border-ember/50">
              <Checkbox
                checked={includeProfile}
                onCheckedChange={(v) => setIncludeProfile(Boolean(v))}
                className="mt-0.5 border-ember data-[state=checked]:bg-ember data-[state=checked]:text-primary-foreground"
              />
              <div className="space-y-1">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                  Include Profile Data
                </p>
                <p className="text-sm text-muted-foreground">
                  Pull last 30 matches for sharper recommendations. Uncheck for role-based only.
                </p>
              </div>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className="group relative h-14 w-full overflow-hidden rounded-md border border-gold/60 bg-gradient-to-r from-ember to-accent font-display text-base font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[0_0_30px_oklch(0.6_0.22_35/0.45)] transition-all hover:shadow-[0_0_45px_oklch(0.6_0.22_35/0.7)] disabled:opacity-50 disabled:shadow-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Swords className="h-5 w-5" />
                Reveal My Heroes
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Data sourced from <span className="text-gold">OpenDota</span> &amp;{" "}
              <span className="text-gold">Dotabuff</span>. We never store your Steam credentials.
            </p>
          </form>
        </motion.section>

        <HeroResults loading={loading} error={error} results={results} />

        {/* Footer */}
        <footer className="mt-auto pt-16 text-center text-xs text-muted-foreground">
          <div className="ember-divider mx-auto mb-4 w-40 opacity-50" />
          © {new Date().getFullYear()} Dota 2 Hero Picker — A fan project. Dota 2 is a trademark of Valve Corporation.
        </footer>
      </div>
    </main>
  );
}
