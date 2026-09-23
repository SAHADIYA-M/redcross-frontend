import { useState, useEffect } from 'react';
import { api, NeedCluster, Need, Priority, FusionCandidate } from './api';

export function useClusters(params?: { status?: string; priority_id?: number }) {
  const [clusters, setClusters] = useState<NeedCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClusters = () => {
    setLoading(true);
    api.getClusters(params)
      .then(res => {
        setClusters(res.results);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClusters();
  }, [JSON.stringify(params)]);

  return { clusters, loading, error, refetch: fetchClusters };
}

export function useClusterDetail(id: string) {
  const [cluster, setCluster] = useState<NeedCluster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await api.getClusterDetail(id);
      setCluster(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  return { cluster, loading, error, refetch: fetchDetail };
}

export function useLookups() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getNeeds(), api.getPriorities()])
      .then(([needsData, prioritiesData]) => {
        setNeeds(needsData);
        setPriorities(prioritiesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { needs, priorities, loading };
}

export function useFusionCandidates() {
  const [candidates, setCandidates] = useState<FusionCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await api.getFusionCandidates();
      setCandidates(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return { candidates, loading, error, refetch: fetchCandidates };
}




