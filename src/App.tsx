import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'overview' | 'fusion' | 'clusters' | 'cluster-detail'
type FusionFilter = 'All' | 'Possible Match' | 'Duplicate' | 'Conflict'
type VerifyState = 'pending' | 'confirmed' | 'rejected'

// ─── Data ─────────────────────────────────────────────────────────────────────

const CLUSTERS = [
  {
    id: 'NEX-007',
    need: 'Drinking Water Shortage',
    location: 'Government UP School',
    status: 'REVIEW' as const,
    priority: 'HIGH' as const,
    affected: '40–45 families',
    observations: 5,
    sources: 3,
    photos: 1,
    conflicts: 1,
    firstSeen: '10:32 AM',
    lastUpdate: '11:16 AM',
    consistent: false,
    summary: 'Multiple field observations indicate a drinking-water shortage around Government UP School.',
    fusionReasons: [
      'Same need type',
      'Same geographic area',
      'Reports within 44 minutes',
      'Similar affected population',
      '3 independent observations',
    ],
    confidence: 91,
    evidence: [
      { id: 'REPORT #021', role: 'supports' as const, author: 'Field volunteer', time: '10:32 AM', text: '"No drinking water available near school."' },
      { id: 'REPORT #034', role: 'supports' as const, author: 'Volunteer Team B', time: '10:41 AM', text: '"40 families waiting for water near the relief centre."' },
      { id: 'REPORT #038', role: 'supports' as const, author: 'Field Team C', time: '10:58 AM', text: '"Water tanker delayed — families still without access."' },
      { id: 'REPORT #045', role: 'conflicts' as const, author: 'Field Team D', time: '11:14 AM', text: '"Tanker arrived at 11:14. Distribution underway."' },
      { id: 'PHOTO #008', role: 'supports' as const, author: 'Photo evidence', time: '11:16 AM', text: 'AI observation: Empty water containers visible. Tanker present.' },
    ],
    timeline: [
      { time: '10:32', id: 'Report #021', text: 'Water unavailable', level: 'high' },
      { time: '10:41', id: 'Report #034', text: '40 families affected', level: 'high' },
      { time: '10:58', id: 'Report #038', text: 'Tanker delayed', level: 'mid' },
      { time: '11:14', id: 'Report #045', text: 'Tanker reportedly arrived', level: 'conflict' },
      { time: '11:16', id: 'Photo #008', text: 'Supporting photograph', level: 'photo' },
    ],
    conflict: {
      prev: '"No drinking water available."',
      latest: '"Tanker arrived at 11:14."',
    },
  },
  {
    id: 'NEX-006',
    need: 'Shelter Damage',
    location: 'Ward 4',
    status: 'VERIFIED' as const,
    priority: 'HIGH' as const,
    affected: '12 families',
    observations: 4,
    sources: 2,
    photos: 0,
    conflicts: 0,
    firstSeen: '09:15 AM',
    lastUpdate: '10:22 AM',
    consistent: true,
    summary: 'Structural damage to residential buildings in Ward 4 displacing 12 families.',
    fusionReasons: ['Same need type', 'Same ward', 'Consistent population estimate', '2 independent sources'],
    confidence: 84,
    evidence: [
      { id: 'REPORT #018', role: 'supports' as const, author: 'Field Team A', time: '09:15 AM', text: '"12 houses damaged in Ward 4."' },
      { id: 'REPORT #019', role: 'supports' as const, author: 'Volunteer Team E', time: '09:22 AM', text: '"12 homes damaged. Families need temporary shelter."' },
    ],
    timeline: [
      { time: '09:15', id: 'Report #018', text: '12 houses damaged', level: 'high' },
      { time: '09:22', id: 'Report #019', text: 'Families need shelter', level: 'high' },
    ],
    conflict: null,
  },
  {
    id: 'NEX-005',
    need: 'Medical Assistance',
    location: 'Relief Centre',
    status: 'REVIEW' as const,
    priority: 'HIGH' as const,
    affected: '8 people',
    observations: 3,
    sources: 2,
    photos: 0,
    conflicts: 0,
    firstSeen: '11:02 AM',
    lastUpdate: '11:30 AM',
    consistent: true,
    summary: 'Medical supplies running low; injured persons require immediate assistance at the relief centre.',
    fusionReasons: ['Same location', 'Same need type', 'Reports within 30 minutes'],
    confidence: 78,
    evidence: [
      { id: 'REPORT #041', role: 'supports' as const, author: 'Volunteer Team F', time: '11:02 AM', text: '"Medical supplies critically low. 8 people need attention."' },
    ],
    timeline: [
      { time: '11:02', id: 'Report #041', text: 'Medical supplies low', level: 'high' },
      { time: '11:30', id: 'Report #047', text: 'Situation unchanged', level: 'mid' },
    ],
    conflict: null,
  },
  {
    id: 'NEX-004',
    need: 'Road Access',
    location: 'Ward 2',
    status: 'MONITOR' as const,
    priority: 'MEDIUM' as const,
    affected: 'Unknown',
    observations: 3,
    sources: 2,
    photos: 0,
    conflicts: 0,
    firstSeen: '10:10 AM',
    lastUpdate: '10:55 AM',
    consistent: true,
    summary: 'Road blockage in Ward 2 limiting access for emergency vehicles.',
    fusionReasons: ['Same road segment', 'Consistent description'],
    confidence: 69,
    evidence: [
      { id: 'REPORT #029', role: 'supports' as const, author: 'Field Team G', time: '10:10 AM', text: '"Main road blocked by fallen trees near Ward 2 junction."' },
    ],
    timeline: [
      { time: '10:10', id: 'Report #029', text: 'Road blocked', level: 'mid' },
    ],
    conflict: null,
  },
]

const FUSION_ITEMS = [
  {
    type: 'match' as const,
    id: 'F-001',
    confidence: 91,
    a: { id: 'Report #021', text: '"No water near the school."', location: 'Same area', time: '10:32' },
    b: { id: 'Report #034', text: '"40 families waiting for water near the relief centre."', location: 'Same area', time: '10:41' },
    scores: [{ label: 'Semantic match', value: 92 }, { label: 'Location match', value: 87 }, { label: 'Time proximity', value: 94 }],
  },
  {
    type: 'conflict' as const,
    id: 'F-002',
    confidence: null,
    a: { id: 'Report #041', text: '"Tanker has not arrived."', location: 'Relief Centre', time: '11:02' },
    b: { id: 'Report #045', text: '"Tanker arrived at 11:14."', location: 'Relief Centre', time: '11:14' },
    scores: [],
    note: 'Same location · Same need · Conflicting status',
  },
  {
    type: 'duplicate' as const,
    id: 'F-003',
    confidence: 96,
    a: { id: 'Report #018', text: '"12 houses damaged."', location: 'Ward 4', time: '09:15' },
    b: { id: 'Report #019', text: '"12 homes damaged in Ward 4."', location: 'Ward 4', time: '09:22' },
    scores: [],
  },
  {
    type: 'match' as const,
    id: 'F-004',
    confidence: 74,
    a: { id: 'Report #029', text: '"Road blocked near Ward 2 junction."', location: 'Ward 2', time: '10:10' },
    b: { id: 'Report #033', text: '"Emergency vehicles unable to pass Ward 2."', location: 'Ward 2', time: '10:28' },
    scores: [{ label: 'Semantic match', value: 68 }, { label: 'Location match', value: 92 }, { label: 'Time proximity', value: 81 }],
  },
]

// ─── Small components ─────────────────────────────────────────────────────────

function StatusDot({ status }: { status: 'REVIEW' | 'VERIFIED' | 'MONITOR' }) {
  const map = { REVIEW: 'bg-red-500', VERIFIED: 'bg-emerald-500', MONITOR: 'bg-amber-400' }
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status]} shrink-0 mt-0.5`} />
}

function PriorityTag({ p }: { p: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const map = { HIGH: 'text-red-600 bg-red-50 border-red-200', MEDIUM: 'text-amber-600 bg-amber-50 border-amber-200', LOW: 'text-gray-500 bg-gray-50 border-gray-200' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${map[p]}`}>{p}</span>
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{children}</div>
}

// ─── Import Modal ─────────────────────────────────────────────────────────────

function ImportModal({ onClose, onProcess }: { onClose: () => void; onProcess: () => void }) {
  const [step, setStep] = useState<'idle' | 'processing' | 'done'>('idle')
  const [paste, setPaste] = useState('')
  const steps = [
    'Extracting needs', 'Normalizing locations', 'Finding related observations',
    'Detecting possible duplicates', 'Checking conflicting evidence',
    'Building need clusters', 'Preparing review queue',
  ]
  const [progress, setProgress] = useState(0)

  function runProcess() {
    setStep('processing')
    let i = 0
    const t = setInterval(() => {
      i++; setProgress(i)
      if (i >= steps.length) { clearInterval(t); setTimeout(() => setStep('done'), 400) }
    }, 380)
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-7">
        {step === 'idle' ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="font-semibold text-gray-900 text-sm">Import observations</div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Upload existing data</div>
                <div className="flex gap-2">
                  <button className="flex-1 border border-[#E4E7EC] text-sm text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">CSV</button>
                  <button className="flex-1 border border-[#E4E7EC] text-sm text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">JSON</button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex-1 h-px bg-gray-100" />OR<div className="flex-1 h-px bg-gray-100" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Paste observation</div>
                <textarea value={paste} onChange={e => setPaste(e.target.value)} placeholder="Paste field report text here…" rows={3} className="w-full border border-[#E4E7EC] rounded-lg text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700 placeholder-gray-300" />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex-1 h-px bg-gray-100" />OR<div className="flex-1 h-px bg-gray-100" />
              </div>
              <button onClick={runProcess} className="w-full border border-dashed border-gray-300 text-gray-500 text-sm py-2.5 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors">
                Load demo dataset
              </button>
            </div>
            <div className="mt-5 pt-5 border-t border-[#E4E7EC]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">15 observations ready</span>
              </div>
              <button onClick={runProcess} className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                Process with Nexus
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold text-gray-900 mb-5">
              {step === 'done' ? 'Processing complete' : 'Processing observations…'}
            </div>
            <div className="space-y-2.5 mb-6">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2.5 text-sm">
                  {step === 'done' || i < progress
                    ? <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
                    : i === progress && step === 'processing'
                    ? <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin inline-block" />
                    : <span className="w-3.5 h-3.5 rounded-full border border-gray-200 inline-block" />
                  }
                  <span className={i < progress || step === 'done' ? 'text-gray-700' : 'text-gray-400'}>{s}</span>
                </div>
              ))}
            </div>
            {step === 'done' && (
              <>
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2.5 font-mono mb-5">
                  15 observations → 4 need clusters → 3 items requiring review
                </div>
                <button onClick={() => { onProcess(); onClose() }} className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  View results
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function Overview({ setPage, setSelectedCluster }: { setPage: (p: Page) => void; setSelectedCluster: (id: string) => void }) {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Situation Overview</h1>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm text-gray-400">
          <span>Flood Response — Kerala</span>
          <span className="text-gray-200">·</span>
          <span>Nexus operational picture</span>
          <span className="text-gray-200">·</span>
          <span>Last processed: 11:18 AM</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { value: '15', label: 'Observations', sub: 'Raw inputs received' },
          { value: '4',  label: 'Need Clusters', sub: 'Consolidated situations' },
          { value: '2',  label: 'Need Review',   sub: 'Awaiting verification' },
          { value: '3',  label: 'Conflicts',     sub: 'Evidence disagrees' },
        ].map(m => (
          <div key={m.label} className="border border-[#E4E7EC] rounded-lg px-5 py-4 bg-white">
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{m.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{m.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: cluster cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-3">
          <SectionLabel>What Nexus Found</SectionLabel>
          {CLUSTERS.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedCluster(c.id); setPage('cluster-detail') }}
              className="w-full text-left border border-[#E4E7EC] bg-white rounded-xl px-5 py-4 hover:border-gray-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <StatusDot status={c.status} />
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{c.need}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.location}</div>
                    {c.affected !== 'Unknown' && (
                      <div className="text-xs text-gray-500 mt-1">{c.affected}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <PriorityTag p={c.priority} />
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                <span>{c.observations} observations</span>
                <span>{c.sources} sources</span>
                {c.conflicts > 0
                  ? <span className="text-amber-600">⚠ {c.conflicts} conflict</span>
                  : <span className="text-emerald-600">✓ consistent</span>
                }
                {c.status === 'REVIEW' && <span className="text-red-500 font-medium">Needs verification</span>}
                {c.status === 'VERIFIED' && <span className="text-emerald-600 font-medium">Verified</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Right sidebar (1/3 width) */}
        <div className="space-y-5">
          {/* Needs attention */}
          <div>
            <SectionLabel>Needs attention</SectionLabel>
            <div className="border border-amber-200 bg-amber-50 rounded-xl px-5 py-4 space-y-2.5">
              {[
                '2 possible duplicate groups',
                '3 conflicting observations',
                '2 clusters awaiting verification',
              ].map(item => (
                <button
                  key={item}
                  onClick={() => setPage('fusion')}
                  className="flex items-center gap-2 text-sm text-amber-800 hover:text-amber-900 w-full text-left"
                >
                  <span className="text-amber-500 shrink-0">⚠</span>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Status breakdown */}
          <div>
            <SectionLabel>Cluster status</SectionLabel>
            <div className="border border-[#E4E7EC] bg-white rounded-xl overflow-hidden divide-y divide-[#E4E7EC]">
              {[
                { label: 'Awaiting review', count: CLUSTERS.filter(c => c.status === 'REVIEW').length, color: 'bg-red-500' },
                { label: 'Verified', count: CLUSTERS.filter(c => c.status === 'VERIFIED').length, color: 'bg-emerald-500' },
                { label: 'Monitoring', count: CLUSTERS.filter(c => c.status === 'MONITOR').length, color: 'bg-amber-400' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className={`w-2 h-2 rounded-full ${row.color}`} />
                    {row.label}
                  </div>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence summary */}
          <div>
            <SectionLabel>AI confidence</SectionLabel>
            <div className="border border-[#E4E7EC] bg-white rounded-xl px-4 py-4 space-y-3">
              {CLUSTERS.map(c => (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 truncate pr-2">{c.need.split(' ').slice(0, 2).join(' ')}</span>
                    <span className="font-bold text-gray-700 shrink-0">{c.confidence}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-600 rounded-full" style={{ width: `${c.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Fusion Queue ─────────────────────────────────────────────────────────────

function FusionQueue() {
  const [filter, setFilter] = useState<FusionFilter>('All')
  const filters: FusionFilter[] = ['All', 'Possible Match', 'Duplicate', 'Conflict']
  const typeMap: Record<string, FusionFilter> = { match: 'Possible Match', duplicate: 'Duplicate', conflict: 'Conflict' }
  const visible = FUSION_ITEMS.filter(f => filter === 'All' || typeMap[f.type] === filter)

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Fusion Queue</h1>
        <p className="text-sm text-gray-400 mt-1">Review relationships detected between observations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: filters panel */}
        <div className="lg:col-span-1">
          <div className="border border-[#E4E7EC] bg-white rounded-xl p-4 sticky top-[68px]">
            <SectionLabel>Filter by type</SectionLabel>
            <div className="space-y-1">
              {filters.map(f => {
                const count = f === 'All' ? FUSION_ITEMS.length : FUSION_ITEMS.filter(i => typeMap[i.type] === f).length
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <span>{f}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E4E7EC] space-y-3">
              <SectionLabel>More filters</SectionLabel>
              {['Need type', 'Location', 'Time', 'Confidence'].map(f => (
                <button key={f} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-[#E4E7EC]">
                  <span>{f}</span>
                  <span className="text-gray-400">▾</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: cards */}
        <div className="lg:col-span-3 space-y-4">
          {visible.map(item => {
            if (item.type === 'match') return <MatchCard key={item.id} item={item} />
            if (item.type === 'duplicate') return <DuplicateCard key={item.id} item={item} />
            if (item.type === 'conflict') return <ConflictCard key={item.id} item={item} />
            return null
          })}
        </div>
      </div>
    </div>
  )
}

function MatchCard({ item }: { item: typeof FUSION_ITEMS[0] }) {
  return (
    <div className="border border-[#E4E7EC] bg-white rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E4E7EC] flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>🔗</span> Possible same situation
        </div>
        {item.confidence && (
          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">{item.confidence}% match</span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-[#E4E7EC]">
        {[item.a, item.b].map((side, i) => (
          <div key={i} className={`px-5 py-4 ${i === 0 ? 'border-b sm:border-b-0 border-[#E4E7EC]' : ''}`}>
            <div className="text-xs font-mono font-semibold text-gray-400 mb-1">{side.id}</div>
            <div className="text-sm text-gray-700 leading-relaxed">{side.text}</div>
            <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-400">
              <span>📍 {side.location}</span>
              <span>🕐 {side.time}</span>
            </div>
          </div>
        ))}
      </div>
      {item.scores.length > 0 && (
        <div className="border-t border-[#E4E7EC] px-5 py-3.5 flex flex-wrap gap-x-6 gap-y-2">
          {item.scores.map(s => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 w-24">{s.label}</span>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-600 rounded-full" style={{ width: `${s.value}%` }} />
              </div>
              <span className="font-medium text-gray-600 tabular-nums">{s.value}%</span>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-[#E4E7EC] px-5 py-3 flex gap-2">
        <button className="text-sm text-gray-600 border border-[#E4E7EC] px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">View evidence</button>
        <button className="text-sm text-gray-900 bg-gray-100 px-4 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">Merge into cluster</button>
      </div>
    </div>
  )
}

function DuplicateCard({ item }: { item: typeof FUSION_ITEMS[0] }) {
  return (
    <div className="border border-[#E4E7EC] bg-white rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E4E7EC] flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>🔁</span> Possible duplicate
        </div>
        {item.confidence && (
          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">Similarity: {item.confidence}%</span>
        )}
      </div>
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[item.a, item.b].map((side, i) => (
          <div key={i} className="border border-[#E4E7EC] rounded-lg px-3 py-3">
            <div className="text-xs font-mono font-semibold text-gray-400 mb-1">{side.id}</div>
            <div className="text-sm text-gray-700">{side.text}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E4E7EC] px-5 py-3 flex gap-2">
        <button className="text-sm text-gray-900 bg-gray-100 px-4 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">Merge</button>
        <button className="text-sm text-gray-600 border border-[#E4E7EC] px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Keep separate</button>
      </div>
    </div>
  )
}

function ConflictCard({ item }: { item: typeof FUSION_ITEMS[0] }) {
  return (
    <div className="border border-amber-200 bg-white rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-amber-200 bg-amber-50 flex items-center gap-2">
        <span>⚠</span>
        <span className="text-sm font-semibold text-amber-800">Conflict detected</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
        <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-[#E4E7EC]">
          <div className="text-xs font-mono font-semibold text-gray-400 mb-1">{item.a.id}</div>
          <div className="text-sm text-gray-700">{item.a.text}</div>
          <div className="text-xs text-gray-400 mt-1.5">🕐 {item.a.time}</div>
        </div>
        <div className="hidden sm:flex px-4 py-4 text-xs font-bold text-gray-400 items-center justify-center">VS</div>
        <div className="sm:hidden px-5 py-2 text-xs font-bold text-gray-400 text-center border-b border-[#E4E7EC]">VS</div>
        <div className="px-5 py-4">
          <div className="text-xs font-mono font-semibold text-gray-400 mb-1">{item.b.id}</div>
          <div className="text-sm text-gray-700">{item.b.text}</div>
          <div className="text-xs text-gray-400 mt-1.5">🕐 {item.b.time}</div>
        </div>
      </div>
      {'note' in item && item.note && (
        <div className="px-5 py-2 border-t border-[#E4E7EC] text-xs text-gray-400">{item.note as string}</div>
      )}
      <div className="border-t border-[#E4E7EC] px-5 py-3">
        <button className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium">Investigate</button>
      </div>
    </div>
  )
}

// ─── Clusters page ────────────────────────────────────────────────────────────

function ClustersPage({ setPage, setSelectedCluster }: { setPage: (p: Page) => void; setSelectedCluster: (id: string) => void }) {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Need Clusters</h1>
          <p className="text-sm text-gray-400 mt-1">Consolidated situations created from multiple observations. {CLUSTERS.length} clusters.</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block border border-[#E4E7EC] rounded-xl bg-white overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_160px_130px_110px] gap-4 px-5 py-3 border-b border-[#E4E7EC] bg-gray-50">
          {['Status', 'Need / Location', 'Population', 'Evidence', 'Confidence'].map(h => (
            <div key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</div>
          ))}
        </div>
        {CLUSTERS.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCluster(c.id); setPage('cluster-detail') }}
            className={`w-full text-left grid grid-cols-[100px_1fr_160px_130px_110px] gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group ${idx < CLUSTERS.length - 1 ? 'border-b border-[#E4E7EC]' : ''}`}
          >
            <div className="flex items-center gap-2">
              <StatusDot status={c.status} />
              <span className={`text-xs font-medium ${c.status === 'REVIEW' ? 'text-red-600' : c.status === 'VERIFIED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {c.status}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700">{c.need}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.location}</div>
            </div>
            <div className="text-sm text-gray-600 self-center">{c.affected}</div>
            <div className="self-center">
              <div className="text-xs text-gray-500">{c.observations} reports · {c.sources} sources</div>
              {c.photos > 0 && <div className="text-xs text-gray-400 mt-0.5">{c.photos} photo</div>}
              {c.conflicts > 0 && <div className="text-xs text-amber-600 mt-0.5">⚠ conflict</div>}
            </div>
            <div className="self-center">
              <div className="text-sm font-bold text-gray-800 tabular-nums">{c.confidence}%</div>
              <div className="mt-1 h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-600 rounded-full" style={{ width: `${c.confidence}%` }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {CLUSTERS.map(c => (
          <button
            key={c.id}
            onClick={() => { setSelectedCluster(c.id); setPage('cluster-detail') }}
            className="w-full text-left border border-[#E4E7EC] bg-white rounded-xl px-4 py-4 hover:border-gray-400 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <StatusDot status={c.status} />
                <span className="font-semibold text-gray-900 text-sm">{c.need}</span>
              </div>
              <PriorityTag p={c.priority} />
            </div>
            <div className="text-xs text-gray-400">{c.location} · {c.affected}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span>{c.observations} reports</span>
              <span>{c.confidence}% confidence</span>
              {c.conflicts > 0 && <span className="text-amber-600">⚠ conflict</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Cluster Detail ───────────────────────────────────────────────────────────

function ClusterDetail({ clusterId, setPage }: { clusterId: string; setPage: (p: Page) => void }) {
  const cluster = CLUSTERS.find(c => c.id === clusterId) ?? CLUSTERS[0]
  const [verifyState, setVerifyState] = useState<VerifyState>('pending')

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      {/* Back */}
      <button onClick={() => setPage('clusters')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        ← Back to clusters
      </button>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{cluster.need.toUpperCase()}</h1>
          <div className="text-sm text-gray-500 mt-1">{cluster.location}</div>
          <div className="text-xs font-mono text-gray-400 mt-0.5">Cluster {cluster.id}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityTag p={cluster.priority} />
          {cluster.status === 'REVIEW' && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">⚠ Needs verification</span>
          )}
          {cluster.status === 'VERIFIED' && (
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">✓ Verified</span>
          )}
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Situation */}
          <div className="border border-[#E4E7EC] bg-white rounded-xl px-6 py-5">
            <SectionLabel>Situation</SectionLabel>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{cluster.summary}</p>
            <div className="grid grid-cols-3 gap-4 border-t border-[#E4E7EC] pt-4">
              {[
                { label: 'Estimated affected', value: cluster.affected, note: 'AI estimate · unverified' },
                { label: 'First reported', value: cluster.firstSeen },
                { label: 'Latest update', value: cluster.lastUpdate },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-gray-400">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</div>
                  {item.note && <div className="text-xs text-gray-400 mt-0.5">{item.note}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Fusion reasoning */}
          <div className="border border-[#E4E7EC] bg-white rounded-xl px-6 py-5">
            <SectionLabel>Why Nexus grouped these reports</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 mb-5">
              {cluster.fusionReasons.map(r => (
                <div key={r} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span> {r}
                </div>
              ))}
            </div>
            <div className="border-t border-[#E4E7EC] pt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>Model confidence</span>
                <span className="font-bold text-gray-700">{cluster.confidence}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-700 rounded-full" style={{ width: `${cluster.confidence}%` }} />
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="border border-[#E4E7EC] bg-white rounded-xl px-6 py-5">
            <SectionLabel>{cluster.observations} observations · {cluster.sources} sources{cluster.photos > 0 ? ` · ${cluster.photos} photo` : ''}</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cluster.evidence.map(e => (
                <div key={e.id} className={`border rounded-xl px-4 py-3.5 ${e.role === 'conflicts' ? 'border-amber-200 bg-amber-50' : 'border-[#E4E7EC] bg-white'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-gray-400">{e.id}</span>
                    <span className="text-xs text-gray-400">{e.time}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1.5">{e.author}</div>
                  <div className="text-sm text-gray-700 italic leading-relaxed">{e.text}</div>
                  <div className={`mt-2 text-xs font-medium ${e.role === 'conflicts' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {e.role === 'conflicts' ? '⚠ Conflicts with cluster' : '✓ Supports cluster'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship diagram */}
          <div className="border border-[#E4E7EC] bg-white rounded-xl px-6 py-5">
            <SectionLabel>Evidence relationships</SectionLabel>
            <RelationshipDiagram evidence={cluster.evidence} need={cluster.need} />
          </div>
        </div>

        {/* Right column: timeline + conflict + verification (1/3) */}
        <div className="space-y-5">

          {/* Timeline */}
          <div className="border border-[#E4E7EC] bg-white rounded-xl px-5 py-5">
            <SectionLabel>Situation timeline</SectionLabel>
            <div className="relative pl-5">
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[#E4E7EC]" />
              {cluster.timeline.map((item, i) => {
                const color = item.level === 'high' ? 'bg-red-500' : item.level === 'conflict' ? 'bg-amber-500' : item.level === 'photo' ? 'bg-blue-400' : 'bg-orange-400'
                return (
                  <div key={i} className="relative mb-5 last:mb-0">
                    <div className={`absolute -left-[17px] top-1 w-2 h-2 rounded-full ${color}`} />
                    <div className="text-xs font-mono text-gray-400 mb-0.5">{item.time}</div>
                    <div className="text-sm text-gray-700 font-medium">{item.text}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.id}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Conflict panel */}
          {cluster.conflict && (
            <div className="border border-amber-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-amber-50 border-b border-amber-200">
                <span className="text-sm font-semibold text-amber-800">⚠ Conflicting information</span>
              </div>
              <div className="bg-white px-5 py-4 space-y-3 text-sm">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Previous observations</div>
                  <div className="text-gray-700 italic">{cluster.conflict.prev}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Latest observation</div>
                  <div className="text-amber-800 italic">{cluster.conflict.latest}</div>
                </div>
              </div>
              <div className="px-5 py-3 bg-white border-t border-amber-200">
                <div className="text-xs text-amber-700 mb-2">Status: <span className="font-bold">UNRESOLVED</span></div>
                <button className="text-xs text-amber-700 border border-amber-300 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                  Review evidence
                </button>
              </div>
            </div>
          )}

          {/* Verification */}
          <div className="border border-[#E4E7EC] bg-white rounded-xl px-5 py-5">
            <SectionLabel>Responder review</SectionLabel>
            {verifyState === 'confirmed' ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl px-4 py-5 text-center">
                <div className="text-emerald-700 font-semibold mb-1">✓ Verified by Responder</div>
                <div className="text-xs text-emerald-600">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-xs text-gray-500 mt-2">Cluster is now part of the verified operational picture.</div>
              </div>
            ) : verifyState === 'rejected' ? (
              <div className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-5 text-center">
                <div className="text-gray-600 font-semibold mb-1">✕ Cluster rejected</div>
                <div className="text-xs text-gray-400">Removed from operational picture.</div>
                <button onClick={() => setVerifyState('pending')} className="mt-3 text-xs text-gray-500 underline">Undo</button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Nexus assessment: These observations likely represent the same underlying {cluster.need.toLowerCase()}.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVerifyState('confirmed')}
                    className="col-span-2 flex items-center justify-center gap-1.5 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    ✓ Confirm cluster
                  </button>
                  <button className="border border-[#E4E7EC] text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    ✏ Edit
                  </button>
                  <button className="border border-[#E4E7EC] text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Split
                  </button>
                  <button
                    onClick={() => setVerifyState('rejected')}
                    className="col-span-2 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RelationshipDiagram({ evidence, need }: { evidence: typeof CLUSTERS[0]['evidence']; need: string }) {
  const supporters = evidence.filter(e => e.role === 'supports')
  const conflicts = evidence.filter(e => e.role === 'conflicts')
  return (
    <div className="border border-[#E4E7EC] rounded-xl bg-[#FAFAFA] p-6 overflow-x-auto">
      <div className="flex flex-col items-center gap-5 min-w-[360px]">
        <div className="border-2 border-gray-700 rounded-xl px-6 py-3 bg-white text-center">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{need.split(' ').slice(0, 2).join(' ')}</div>
          <div className="text-xs text-gray-400 mt-0.5">Need cluster</div>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-3 w-full">
          {supporters.map(e => (
            <div key={e.id} className="flex flex-col items-center gap-1.5">
              <div className="text-xs text-emerald-500 font-medium">supports ↑</div>
              <div className="border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-2 text-center">
                <div className="text-xs font-mono font-bold text-emerald-700">{e.id}</div>
                <div className="text-xs text-gray-500 mt-0.5">{e.time}</div>
              </div>
            </div>
          ))}
          {conflicts.map(e => (
            <div key={e.id} className="flex flex-col items-center gap-1.5">
              <div className="text-xs text-amber-500 font-medium">⚠ conflicts</div>
              <div className="border border-amber-300 bg-amber-50 rounded-lg px-3 py-2 text-center">
                <div className="text-xs font-mono font-bold text-amber-700">{e.id}</div>
                <div className="text-xs text-gray-500 mt-0.5">{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Shell ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('overview')
  const [selectedCluster, setSelectedCluster] = useState('NEX-007')
  const [showImport, setShowImport] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const pendingFusion = FUSION_ITEMS.length
  const clusterCount = CLUSTERS.length

  const navItems = [
    { id: 'overview' as Page, label: 'Overview' },
    { id: 'fusion' as Page, label: 'Fusion Queue', badge: pendingFusion },
    { id: 'clusters' as Page, label: 'Clusters', badge: clusterCount },
  ]

  const isActive = (id: Page) => page === id || (page === 'cluster-detail' && id === 'clusters')

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {/* Nav */}
      <header className="bg-white border-b border-[#E4E7EC] sticky top-0 z-40">
        <div className="px-6 lg:px-10 max-w-[1400px] mx-auto h-[52px] flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => setPage('overview')} className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm1 3.5H7v2.5H4.5v2H7V11.5h2V9h2.5V7H9V4.5z"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-red-600 leading-none">REDCROSS</div>
              <div className="text-xs font-bold text-gray-900 leading-none">NEXUS</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5 flex-1 mx-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${isActive(item.id) ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
              >
                {item.label}
                {item.badge !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isActive(item.id) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-medium text-gray-600 leading-none">Flood Response Demo</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Last updated 11:18</div>
            </div>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 border border-[#E4E7EC] text-sm text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
            >
              + Import
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="sm:hidden p-1.5 text-gray-600 hover:text-gray-900"
              aria-label="Menu"
            >
              {mobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileNavOpen && (
          <div className="sm:hidden border-t border-[#E4E7EC] bg-white px-6 py-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileNavOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.id) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page */}
      <main className="overflow-x-hidden">
        {page === 'overview' && <Overview setPage={setPage} setSelectedCluster={setSelectedCluster} />}
        {page === 'fusion' && <FusionQueue />}
        {page === 'clusters' && <ClustersPage setPage={setPage} setSelectedCluster={setSelectedCluster} />}
        {page === 'cluster-detail' && <ClusterDetail clusterId={selectedCluster} setPage={setPage} />}
      </main>

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onProcess={() => setPage('overview')} />
      )}
    </div>
  )
}
