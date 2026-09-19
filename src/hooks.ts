import { useState, useEffect } from 'react';
import { api, NeedCluster, Need, Priority } from './api';

export function useClusters(params?: { status?: string; priority_id?: number }) {
  const [clusters, setClusters] = useState<NeedCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    api.getClusters(params)
      .then(res => {
        if (isMounted) {
          setClusters(res.results);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [JSON.stringify(params)]);

  return { clusters, loading, error };
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
