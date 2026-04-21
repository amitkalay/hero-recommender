export interface OpenDotaHero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
}

export interface RecentMatch {
  match_id: number;
  hero_id: number;
  radiant_win: boolean;
  player_slot: number;
  kills: number;
  deaths: number;
  assists: number;
  duration: number;
  start_time: number;
}

export interface HeroStat {
  hero: OpenDotaHero;
  games: number;
  wins: number;
  winRate: number;
  avgKDA: number;
}

const HEROES_URL = "https://api.opendota.com/api/heroes";
const RECENT_MATCHES_URL = (id: string) =>
  `https://api.opendota.com/api/players/${id}/recentMatches`;

export function heroIconUrl(hero: OpenDotaHero): string {
  const short = hero.name.replace("npc_dota_hero_", "");
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${short}.png`;
}

export function isRadiant(playerSlot: number): boolean {
  return playerSlot < 128;
}

export function isWin(match: RecentMatch): boolean {
  return isRadiant(match.player_slot) === match.radiant_win;
}

function extractAccountId(input: string): string {
  const trimmed = input.trim();
  // Match a long numeric run (Steam32 ID) in URLs like dotabuff.com/players/144112392
  const match = trimmed.match(/(\d{4,})/);
  return match ? match[1] : trimmed;
}

export async function fetchHeroes(): Promise<OpenDotaHero[]> {
  const res = await fetch(HEROES_URL);
  if (!res.ok) throw new Error(`Failed to load heroes (${res.status})`);
  return res.json();
}

export async function fetchRecentMatches(steamId: string): Promise<RecentMatch[]> {
  const accountId = extractAccountId(steamId);
  const res = await fetch(RECENT_MATCHES_URL(accountId));
  if (!res.ok) {
    if (res.status === 404) throw new Error("Player not found. Check your Steam ID.");
    throw new Error(`Failed to load matches (${res.status})`);
  }
  const data = (await res.json()) as RecentMatch[];
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No recent matches found for this player.");
  }
  return data;
}

export function topHeroes(
  matches: RecentMatch[],
  heroes: OpenDotaHero[],
  limit = 3,
): HeroStat[] {
  const heroById = new Map(heroes.map((h) => [h.id, h]));
  const buckets = new Map<
    number,
    { games: number; wins: number; kills: number; deaths: number; assists: number }
  >();

  for (const m of matches.slice(0, 20)) {
    const b = buckets.get(m.hero_id) ?? {
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
    };
    b.games += 1;
    if (isWin(m)) b.wins += 1;
    b.kills += m.kills;
    b.deaths += m.deaths;
    b.assists += m.assists;
    buckets.set(m.hero_id, b);
  }

  const stats: HeroStat[] = [];
  for (const [heroId, b] of buckets) {
    const hero = heroById.get(heroId);
    if (!hero) continue;
    const deaths = Math.max(b.deaths, 1);
    stats.push({
      hero,
      games: b.games,
      wins: b.wins,
      winRate: b.wins / b.games,
      avgKDA: (b.kills + b.assists) / deaths,
    });
  }

  // Rank by games, then win rate, then KDA
  stats.sort(
    (a, b) =>
      b.games - a.games || b.winRate - a.winRate || b.avgKDA - a.avgKDA,
  );

  return stats.slice(0, limit);
}