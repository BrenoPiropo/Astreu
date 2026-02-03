import axios from "axios";

const API_KEY = "vTcJJVy4f6WFak3mmNpvwIkHarxPpQuQn1XefVaR";
const BASE_URL = "https://api.nasa.gov";

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// --- INTERFACES CONSOLIDADAS ---

export interface ApodResponse {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
}

export interface Asteroid {
  id: string;
  name: string;
  estimated_diameter: {
    meters: { estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: { kilometers_per_hour: string };
    miss_distance: { kilometers: string };
  }>;
}

export interface Exoplanet {
  name: string;
  hostname: string;
  distance: number;
  discovery_year: number;
  temp: number;
  habitual: boolean;
}

export interface StarNeighbor {
  id: string;
  name: string;
  dist_ly: number;
  magnitude: number;
  constellation: string;
  ra: number;
  dec: number;
}

// --- FUNÇÕES DE AUXÍLIO ---

function getConstellation(ra: number, dec: number): string {
  if (dec > 50) return "Ursa Maior";
  if (dec < -50) return "Cruzeiro do Sul";
  if (ra > 280 && ra < 300) return "Sagitário";
  if (ra > 70 && ra < 90) return "Órion";
  if (ra > 150 && ra < 180 && dec > -20 && dec < 20) return "Leão";
  return "Vizinhança Solar";
}

// Dados de backup caso a API da ESA falhe ou retorne HTML
const fallbackStars: StarNeighbor[] = [
  {
    id: "4321",
    name: "Próxima Centauri",
    dist_ly: 4.2,
    magnitude: 11.05,
    constellation: "Centaurus",
    ra: 217.42,
    dec: -62.67,
  },
  {
    id: "8765",
    name: "Estrela de Barnard",
    dist_ly: 5.9,
    magnitude: 9.51,
    constellation: "Ophiuchus",
    ra: 269.45,
    dec: 4.69,
  },
];

// --- MÉTODOS DE BUSCA ---

export const getApod = async (): Promise<ApodResponse> => {
  const response = await api.get<ApodResponse>("/planetary/apod");
  return response.data;
};

export const getAsteroids = async (): Promise<Asteroid[]> => {
  const today = new Date().toISOString().split("T")[0];
  const response = await api.get(
    `/neo/rest/v1/feed?start_date=${today}&end_date=${today}`,
  );
  return Object.values(response.data.near_earth_objects).flat() as Asteroid[];
};

export async function getExoplanets(): Promise<Exoplanet[]> {
  const query =
    "select+pl_name,hostname,sy_dist,st_teff,disc_year+from+pscomppars+order+by+disc_year+desc";
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.slice(0, 50).map((item: any) => ({
      name: item.pl_name,
      hostname: item.hostname,
      distance: item.sy_dist ? Math.round(item.sy_dist * 3.262) : 0,
      temp: item.st_teff || 0,
      discovery_year: item.disc_year,
      habitual: item.st_teff > 2500 && item.st_teff < 6000,
    }));
  } catch {
    return [];
  }
}

export async function getStarNeighbors(): Promise<StarNeighbor[]> {
  const url = "https://gea.esac.esa.int/tap-server/tap/sync";
  const params = new URLSearchParams();
  params.append("REQUEST", "doQuery");
  params.append("LANG", "ADQL");
  params.append("FORMAT", "json");
  params.append(
    "QUERY",
    "SELECT TOP 50 source_id, parallax, phot_g_mean_mag, ra, dec FROM gaiadr3.gaia_source WHERE parallax > 100 ORDER BY parallax DESC",
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });

    // CHECAGEM ANTIFALHA (Impede o erro de JSON Parse error)
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType?.includes("application/json")) {
      console.warn("API Gaia fora do ar ou retornou HTML. Usando fallback.");
      return fallbackStars;
    }

    const data = await response.json();
    const uniqueStarsMap = new Map();

    data.data.forEach((item: any) => {
      const sourceId = item[0].toString();
      if (!uniqueStarsMap.has(sourceId)) {
        uniqueStarsMap.set(sourceId, {
          id: sourceId,
          name: `Gaia DR3 ${sourceId.slice(-6)}`,
          dist_ly: Math.round((1000 / item[1]) * 3.262 * 10) / 10,
          magnitude: Math.round(item[2] * 100) / 100,
          constellation: getConstellation(item[3], item[4]),
          ra: item[3],
          dec: item[4],
        });
      }
    });

    return Array.from(uniqueStarsMap.values()).slice(0, 20);
  } catch (error) {
    console.error("Erro na API Gaia:", error);
    return fallbackStars;
  }
}
