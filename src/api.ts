// API Client for RedCross Nexus
// Updated to match the FastAPI backend architecture

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

// --- Fetch Wrapper ---
async function fetchWithAuth(url: string | URL, options: RequestInit = {}) {
  const token = localStorage.getItem('nexus_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new Error('Network failure: Unable to reach backend API');
  }
  
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.detail) {
        msg = Array.isArray(errData.detail) 
          ? errData.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ') 
          : errData.detail;
      }
    } catch (e) {
      // JSON parse failed
    }
    
    if (res.status === 401) {
      throw new Error(`Authentication required (401). ${msg}`);
    } else if (res.status === 403) {
      throw new Error(`Permission denied (403). You lack the required role. ${msg}`);
    } else if (res.status === 422) {
      throw new Error(`Validation Error (422): ${msg}`);
    } else if (res.status >= 500) {
      throw new Error(`Server Error (${res.status}): The backend encountered an unexpected problem.`);
    }
    throw new Error(msg);
  }
  return res;
}

// --- API Methods ---

export const api = {
  login: async (
    username = import.meta.env.VITE_DEV_ADMIN_USERNAME || 'dev_admin',
    password = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'dev_admin_password'
  ) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('nexus_token', data.access_token);
    return data;
  },

  // 1. Reports
  submitReport: async (data: Partial<Report>): Promise<Report> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getReportStatus: async (id: string): Promise<Report> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/reports/${id}`);
    return res.json();
  },

  // 2. Clusters
  getClusters: async (params?: Record<string, string | number>): Promise<PaginatedResponse<NeedCluster>> => {
    const url = new URL(`${API_BASE_URL}/clusters`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.append(key, String(value));
      });
    }
    const res = await fetchWithAuth(url.toString());
    return res.json();
  },

  getClusterDetail: async (id: string): Promise<NeedCluster> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/clusters/${id}`);
    return res.json();
  },



  // 4. Fusion
  getFusionCandidates: async (): Promise<FusionCandidate[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/fusion`);
    return res.json();
  },

  resolveFusionCandidate: async (id: string, action: 'MERGED' | 'KEPT_SEPARATE' | 'DISMISSED'): Promise<FusionCandidate> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/fusion/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    return res.json();
  }
};