// API Client for RedCross Nexus
// Based on the PostgreSQL + pgvector + Supabase backend architecture

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// --- Types ---

export interface Need {
  id: number;
  code: string; // e.g. WATER_SANITATION_AND_HYGIENE, HEALTH
  name: string;
}

export interface Priority {
  id: number;
  code: string; // CRITICAL, HIGH, MEDIUM, LOW
  name: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface EvidenceFile {
  id: string;
  report_id: string;
  file_url: string;
  file_type: string; // image/jpeg, application/pdf
  created_at: string;
}

export interface Report {
  id: string;
  raw_content: string;
  source_type: string; // text, photo, structured
  need_id: number;
  location_id: string;
  priority_id: number;
  affected_population: string;
  summary: string;
  created_at: string;
  evidence_files?: EvidenceFile[];
}

export interface ClusterReport {
  report_id: string;
  similarity_score: number;
  report?: Report;
}

export interface VerificationAction {
  id: string;
  action_type: 'confirm' | 'edit' | 'split' | 'reject';
  notes?: string;
  created_at: string;
}

export interface NeedCluster {
  id: string;
  need_id: number;
  location_id: string;
  priority_id: number;
  status: 'REVIEW' | 'VERIFIED' | 'MONITOR' | 'REJECTED';
  summary: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  need?: Need;
  location?: Location;
  priority?: Priority;
  reports?: ClusterReport[];
  verification_actions?: VerificationAction[];
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// --- API Methods ---

export const api = {
  // 1. Reports
  submitReport: async (data: Partial<Report>): Promise<Report> => {
    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },

  getReportStatus: async (id: string): Promise<Report> => {
    const res = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!res.ok) throw new Error('Failed to fetch report status');
    return res.json();
  },

  // 2. Clusters
  getClusters: async (params?: {
    status?: string;
    priority_id?: number;
    need_id?: number;
    location_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<NeedCluster>> => {
    const url = new URL(`${API_BASE_URL}/clusters`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.append(key, String(value));
      });
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch clusters');
    return res.json();
  },

  getClusterDetail: async (id: string): Promise<NeedCluster> => {
    const res = await fetch(`${API_BASE_URL}/clusters/${id}`);
    if (!res.ok) throw new Error('Failed to fetch cluster detail');
    return res.json();
  },

  verifyCluster: async (id: string, data: { action_type: 'confirm' | 'edit' | 'reject'; notes?: string }): Promise<VerificationAction> => {
    const res = await fetch(`${API_BASE_URL}/clusters/${id}/verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to verify cluster');
    return res.json();
  },

  splitCluster: async (id: string, data: { report_ids: string[]; new_summary: string }): Promise<NeedCluster> => {
    const res = await fetch(`${API_BASE_URL}/clusters/${id}/split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to split cluster');
    return res.json();
  },

  // 3. Lookups
  getNeeds: async (): Promise<Need[]> => {
    const res = await fetch(`${API_BASE_URL}/needs`);
    if (!res.ok) throw new Error('Failed to fetch needs');
    return res.json();
  },

  getPriorities: async (): Promise<Priority[]> => {
    const res = await fetch(`${API_BASE_URL}/priorities`);
    if (!res.ok) throw new Error('Failed to fetch priorities');
    return res.json();
  },
};

// --- Storage Helper (Supabase integration mock for evidence uploads) ---
// Assuming usage of @supabase/supabase-js in the future
export const storage = {
  uploadEvidence: async (file: File): Promise<string> => {
    // In a real implementation:
    // const { data, error } = await supabase.storage.from('evidence_files').upload(`public/${file.name}`, file);
    // return data.path;
    
    // Mock response for now
    console.log('Uploading file to Supabase storage...', file.name);
    return Promise.resolve(`https://mock-supabase-url.com/storage/v1/object/public/evidence_files/${file.name}`);
  }
};
