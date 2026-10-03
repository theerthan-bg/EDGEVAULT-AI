import type { Memory, SyncItem, Conflict, ActivityLogEntry, NodeStatus } from '../types';

const now = Date.now();
const m = 60_000;

export const initialMemories: Memory[] = [
  { id: 'MEM-001', text: 'Machine 07 experienced overheating during operation.', category: 'NORMAL', source: 'EDGE-NODE-01', device: 'EDGE-NODE-01', createdAt: now - 240*m, updatedAt: now - 240*m, syncStatus: 'SYNCED', tags: ['machine-07','temperature','overheating'] },
  { id: 'MEM-002', text: 'Cooling fan of Machine 07 was replaced last week.', category: 'NORMAL', source: 'EDGE-NODE-01', device: 'EDGE-NODE-01', createdAt: now - 180*m, updatedAt: now - 180*m, syncStatus: 'SYNCED', tags: ['machine-07','maintenance','cooling'] },
  { id: 'MEM-003', text: 'Production line B scheduled for maintenance on Saturday.', category: 'HIGH PRIORITY', source: 'EDGE-NODE-02', device: 'EDGE-NODE-02', createdAt: now - 120*m, updatedAt: now - 120*m, syncStatus: 'SYNCED', tags: ['production','maintenance'] },
  { id: 'MEM-004', text: 'Operator credentials rotated for shift change protocol.', category: 'PRIVATE', source: 'EDGE-NODE-01', device: 'EDGE-NODE-01', createdAt: now - 90*m, updatedAt: now - 90*m, syncStatus: 'LOCAL ONLY', tags: ['security','credentials'] },
  { id: 'MEM-005', text: 'Sensor calibration data for floor sector 3 uploaded.', category: 'NORMAL', source: 'EDGE-NODE-03', device: 'EDGE-NODE-03', createdAt: now - 60*m, updatedAt: now - 60*m, syncStatus: 'SYNCED', tags: ['sensors','calibration'] },
  { id: 'MEM-006', text: 'Machine 12 temperature warning exceeded threshold 78°C.', category: 'HIGH PRIORITY', source: 'EDGE-NODE-02', device: 'EDGE-NODE-02', createdAt: now - 45*m, updatedAt: now - 45*m, syncStatus: 'PENDING SYNC', tags: ['machine-12','temperature'] },
  { id: 'MEM-007', text: 'Power consumption anomaly detected in grid sector A.', category: 'NORMAL', source: 'EDGE-NODE-04', device: 'EDGE-NODE-04', createdAt: now - 30*m, updatedAt: now - 30*m, syncStatus: 'PENDING SYNC', tags: ['power','anomaly'] },
  { id: 'MEM-008', text: 'Internal access key for maintenance portal stored locally.', category: 'PRIVATE', source: 'EDGE-NODE-01', device: 'EDGE-NODE-01', createdAt: now - 20*m, updatedAt: now - 20*m, syncStatus: 'LOCAL ONLY', tags: ['security','access'] },
];

export const initialSyncQueue: SyncItem[] = [
  { id: 'SQ-001', memoryId: 'MEM-006', text: 'Machine 12 temperature warning exceeded threshold 78°C.', category: 'HIGH PRIORITY', priority: 'HIGH', status: 'READY', retryCount: 0, createdAt: now - 45*m, lastAttempt: null },
  { id: 'SQ-002', memoryId: 'MEM-007', text: 'Power consumption anomaly detected in grid sector A.', category: 'NORMAL', priority: 'MEDIUM', status: 'PENDING', retryCount: 0, createdAt: now - 30*m, lastAttempt: null },
  { id: 'SQ-003', memoryId: 'MEM-004', text: 'Operator credentials rotated for shift change protocol.', category: 'PRIVATE', priority: 'NONE', status: 'LOCAL ONLY', retryCount: 0, createdAt: now - 90*m, lastAttempt: null },
  { id: 'SQ-004', memoryId: 'MEM-008', text: 'Internal access key for maintenance portal stored locally.', category: 'PRIVATE', priority: 'NONE', status: 'LOCAL ONLY', retryCount: 0, createdAt: now - 20*m, lastAttempt: null },
];

export const initialConflicts: Conflict[] = [
  { id: 'CFL-001', memoryId: 'MEM-003', device: 'EDGE-NODE-02', timestamp: now - 50*m, localVersion: 'Production line B scheduled for maintenance on Saturday.', remoteVersion: 'Production line B scheduled for maintenance on Sunday.', field: 'text', status: 'UNRESOLVED' },
  { id: 'CFL-002', memoryId: 'MEM-005', device: 'EDGE-NODE-03', timestamp: now - 15*m, localVersion: 'Sensor calibration data for floor sector 3 uploaded.', remoteVersion: 'Sensor calibration data for floor sector 4 uploaded.', field: 'text', status: 'UNRESOLVED' },
];

export const initialActivity: ActivityLogEntry[] = [
  { id: 'LOG-001', timestamp: now - 240*m, event: 'MEMORY_CREATED', device: 'EDGE-NODE-01', memoryId: 'MEM-001', status: 'SUCCESS', message: 'Memory stored in Qdrant Edge' },
  { id: 'LOG-002', timestamp: now - 240*m, event: 'EMBEDDING_GENERATED', device: 'EDGE-NODE-01', memoryId: 'MEM-001', status: 'INFO', message: '384-dim vector generated via BAAI/bge-small-en-v1.5' },
  { id: 'LOG-003', timestamp: now - 240*m, event: 'LOCAL_VECTOR_INSERTED', device: 'EDGE-NODE-01', memoryId: 'MEM-001', status: 'SUCCESS', message: 'Vector inserted into local collection' },
  { id: 'LOG-004', timestamp: now - 120*m, event: 'SYNC_COMPLETED', device: 'EDGE-NODE-01', memoryId: 'MEM-002', status: 'SUCCESS', message: 'Synced to Qdrant Cloud' },
  { id: 'LOG-005', timestamp: now - 90*m, event: 'POLICY_EVALUATED', device: 'EDGE-NODE-01', memoryId: 'MEM-004', status: 'INFO', message: 'Policy: PRIVATE → LOCAL ONLY' },
  { id: 'LOG-006', timestamp: now - 45*m, event: 'SYNC_QUEUED', device: 'EDGE-NODE-02', memoryId: 'MEM-006', status: 'INFO', message: 'Memory queued for priority sync' },
  { id: 'LOG-007', timestamp: now - 50*m, event: 'CONFLICT_DETECTED', device: 'EDGE-NODE-02', memoryId: 'MEM-003', status: 'WARNING', message: 'Local and cloud versions diverge' },
  { id: 'LOG-008', timestamp: now - 15*m, event: 'CONFLICT_DETECTED', device: 'EDGE-NODE-03', memoryId: 'MEM-005', status: 'WARNING', message: 'Field mismatch: text' },
];

export const edgeNodes: NodeStatus[] = [
  { id: 'EDGE-NODE-01', label: 'EDGE-NODE-01', status: 'ONLINE', x: 0.28, y: 0.38, type: 'edge' },
  { id: 'EDGE-NODE-02', label: 'EDGE-NODE-02', status: 'ONLINE', x: 0.48, y: 0.52, type: 'edge' },
  { id: 'EDGE-NODE-03', label: 'EDGE-NODE-03', status: 'ONLINE', x: 0.68, y: 0.30, type: 'edge' },
  { id: 'EDGE-NODE-04', label: 'EDGE-NODE-04', status: 'ONLINE', x: 0.82, y: 0.55, type: 'edge' },
  { id: 'CLOUD-01', label: 'QDRANT CLOUD', status: 'ONLINE', x: 0.50, y: 0.18, type: 'cloud' },
];

export const connections: [string, string][] = [
  ['EDGE-NODE-01', 'CLOUD-01'],
  ['EDGE-NODE-02', 'CLOUD-01'],
  ['EDGE-NODE-03', 'CLOUD-01'],
  ['EDGE-NODE-04', 'CLOUD-01'],
  ['EDGE-NODE-01', 'EDGE-NODE-02'],
  ['EDGE-NODE-02', 'EDGE-NODE-03'],
];

// Simple keyword-based semantic similarity for demo search
export function computeSimilarity(query: string, text: string): number {
  const q = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const t = text.toLowerCase();
  if (q.length === 0) return 0;
  let hits = 0;
  for (const word of q) {
    if (t.includes(word)) hits++;
  }
  const base = hits / q.length;
  // Add semantic-ish boost for related terms
  const synonyms: Record<string, string[]> = {
    'heat': ['temperature','overheating','cooling','thermal','hot'],
    'heating': ['temperature','overheating','cooling','thermal','hot'],
    'overheating': ['temperature','heat','cooling','thermal'],
    'temperature': ['heat','overheating','thermal','cooling'],
    'cooling': ['fan','temperature','overheating'],
    'fan': ['cooling','machine'],
    'machine': ['device','equipment'],
    'maintenance': ['repair','replaced','scheduled'],
    'power': ['grid','consumption','energy'],
    'sensor': ['calibration','data'],
  };
  let extra = 0;
  for (const word of q) {
    const syns = synonyms[word];
    if (syns) {
      for (const syn of syns) {
        if (t.includes(syn)) { extra += 0.15; break; }
      }
    }
  }
  return Math.min(0.98, Math.max(0, base * 0.7 + extra + 0.05));
}

export function searchMemories(query: string, memories: Memory[]): { memory: Memory; similarity: number }[] {
  return memories
    .map(m => ({ memory: m, similarity: computeSimilarity(query, m.text) }))
    .filter(r => r.similarity > 0.15)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 8);
}
