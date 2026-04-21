import { motion } from "framer-motion";
import { Trophy, Swords, Loader2, AlertTriangle } from "lucide-react";
import { heroIconUrl, type HeroStat } from "@/lib/opendota";

interface HeroResultsProps {
  loading: boolean;
  error: string | null;
  results: HeroStat[] | null;
}

export function HeroResults({ loading, error, results }: HeroResultsProps) {
  if (!loading && !error && !results) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-10 w-full max-w-3xl"
    >
      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-md border border-border bg-surface/60 p-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-ember" />
          <span className="font-display text-sm uppercase tracking-[0.2em]">
            Forging recommendations…
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-5 text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide">
              Recommendation failed
            </p>
            <p className="mt-1 text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {results && !loading && !error && (
        <div className="ornate-frame rounded-lg p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <Trophy className="h-5 w-5 text-gold" />
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.22em] text-gradient-gold">
              Top {results.length} Heroes — Last 20 Matches
            </h3>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {results.map((stat, idx) => (
              <motion.li
                key={stat.hero.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative flex flex-col items-center gap-3 rounded-md border border-border bg-surface/70 p-5 transition-colors hover:border-ember/60"
              >
                <span className="absolute left-3 top-3 font-display text-xs font-bold uppercase tracking-widest text-ember">
                  #{idx + 1}
                </span>
                <div className="relative h-20 w-32 overflow-hidden rounded border border-gold/30 shadow-[0_0_20px_oklch(0.6_0.22_35/0.3)]">
                  <img
                    src={heroIconUrl(stat.hero)}
                    alt={stat.hero.localized_name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-display text-base font-bold uppercase tracking-wide text-foreground">
                    {stat.hero.localized_name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.games} {stat.games === 1 ? "game" : "games"} ·{" "}
                    <span className="text-gold">
                      {Math.round(stat.winRate * 100)}% WR
                    </span>
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Swords className="h-3 w-3 text-ember" />
                    KDA {stat.avgKDA.toFixed(2)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      )}
    </motion.section>
  );
}