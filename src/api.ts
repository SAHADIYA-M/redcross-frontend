// API Client for RedCross Nexus
// The backend API handles reports, need clusters, fusion candidates, and verification.
// Configured to support both relative paths (integrated deployment) and cross-origin endpoints.

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
// If VITE_API_BASE_URL is not provided, default to '/api' so requests are handled by the backend server
// on the same origin, completely preventing connection failure and CORS blocking.
export const API_BASE_URL = (rawBaseUrl && rawBaseUrl.trim().length > 0)
  ? rawBaseUrl.trim().replace(/\/+$/, '')
  : '/api';

// --- Types ---

export interface Report {
  id?: string;
  original_text: string;
  reporter: string;
  timestamp?: string;
  location?: string;
  incident?: string;
  evidence?: string[];
  source?: string;
  status?: string;
  needs?: string[];
  severity?: string;
  location_status?: string;
  affected_population?: number;
  infrastructure_status?: string;
  available_needs?: string[];
  vulnerability?: string[];
  time_sensitivity?: string;
  verification_status?: string;
}

export interface EvidenceItem {
  id: string;
  role: 'supports' | 'conflicts';
  author: string;
  time: string;
  text: string;
}

export interface TimelineItem {
  time: string;
  id: string;
  text: string;
  level: string;
}

export interface FusionCandidate {
  id: string;
  type: 'POSSIBLE_DUPLICATE' | 'POSSIBLE_CONFLICT';
  report_ids: string[];
  cluster_id: string;
  reason: string;
  similarity?: number;
  status: 'PENDING' | 'RESOLVED';
  resolution?: 'MERGED' | 'KEPT_SEPARATE' | 'DISMISSED';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface NeedCluster {
  id: string;
  need: string;
  location: string;
  status: 'REVIEW' | 'VERIFIED' | 'MONITOR' | 'REJECTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  affected: string;
  observations: number;
  sources: number;
  photos: number;
  conflicts: number;
  firstSeen: string;
  lastUpdate: string;
  consistent: boolean;
  summary: string;
  fusionReasons: string[];
  confidence: number;
  evidence: EvidenceItem[];
  timeline: TimelineItem[];
  conflict: { prev: string; latest: string } | null;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Helper to construct full URL safely whether API_BASE_URL is relative or absolute
function buildUrl(path: string, params?: Record<string, string | number>): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  let baseStr: string;

  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    baseStr = `${API_BASE_URL}${cleanPath}`;
  } else {
    const origin = typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost:3000';
    const cleanBase = API_BASE_URL.startsWith('/') ? API_BASE_URL : `/${API_BASE_URL}`;
    baseStr = `${origin}${cleanBase}${cleanPath}`;
  }

  const url = new URL(baseStr);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

/**
 * Formats timestamps into the viewer's local browser timezone.
 * Handles ISO strings ('2026-09-24T11:25:47.467Z'), date strings, and passes through simple time strings ('10:32 AM').
 */
export function formatReportTime(ts?: string): string {
  if (!ts) return '—';
  // If it's already a simple time string like "10:32 AM", return it directly
  if (!ts.includes('T') && !ts.includes('-')) return ts;
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return ts;
  }
}

/**
 * Formats time-only into viewer's local browser timezone ('4:45 AM').
 */
export function formatTimeOnly(ts?: string): string {
  if (!ts) return '—';
  if (!ts.includes('T') && !ts.includes('-')) return ts;
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return ts;
  }
}

// --- Fetch Wrapper ---

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  const requestOptions: RequestInit = {
    ...options,
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
  };

  try {
    res = await fetch(url, requestOptions);
  } catch (err) {
    console.error('Network request failed for URL:', url, err);
    throw new Error('Network failure: Unable to reach backend API');
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.detail) {
        msg = Array.isArray(errData.detail)
          ? errData.detail.map((e: any) => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join(', ')
          : errData.detail;
      } else if (errData.message) {
        msg = errData.message;
      }
    } catch {
      // JSON parse failed, keep generic status msg
    }

    if (res.status === 404) {
      throw new Error(`Not Found (404). ${msg}`);
    } else if (res.status === 422) {
      throw new Error(`Validation Error (422): ${msg}`);
    } else if (res.status >= 500) {
      throw new Error(`Server Error (${res.status}): The backend encountered an unexpected problem.`);
    }
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

// --- API Methods ---

export const api = {
  // 1. Reports
  submitReport: (data: Partial<Report>): Promise<Report> =>
    request<Report>(buildUrl('/reports'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getReportStatus: (id: string): Promise<Report> =>
    request<Report>(buildUrl(`/reports/${encodeURIComponent(id)}`)),

  // 2. Clusters
  getClusters: (params?: Record<string, string | number>): Promise<PaginatedResponse<NeedCluster>> => {
    return request<PaginatedResponse<NeedCluster>>(buildUrl('/clusters', params));
  },

  getClusterDetail: (id: string): Promise<NeedCluster> =>
    request<NeedCluster>(buildUrl(`/clusters/${encodeURIComponent(id)}`)),

  // 3. Fusion
  getFusionCandidates: (): Promise<FusionCandidate[]> =>
    request<FusionCandidate[]>(buildUrl('/fusion')),

  resolveFusionCandidate: (
    id: string,
    action: 'MERGED' | 'KEPT_SEPARATE' | 'DISMISSED'
  ): Promise<FusionCandidate> =>
    request<FusionCandidate>(buildUrl(`/fusion/${encodeURIComponent(id)}/resolve`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }),

  resolveAllFusion: (
    action: 'MERGED' | 'KEPT_SEPARATE' | 'DISMISSED' = 'DISMISSED'
  ): Promise<{ message: string; count: number }> =>
    request<{ message: string; count: number }>(buildUrl('/fusion/resolve-all'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }),

  resetData: (): Promise<{ message: string }> =>
    request<{ message: string }>(buildUrl('/reset'), { method: 'POST' }),

  deleteReport: (id: string): Promise<{ success: boolean }> =>
    request<{ success: boolean }>(buildUrl(`/reports/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    }),

  deleteCluster: (id: string): Promise<{ success: boolean }> =>
    request<{ success: boolean }>(buildUrl(`/clusters/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    }),
};
