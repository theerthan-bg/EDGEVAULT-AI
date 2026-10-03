import { useCallback, useRef } from 'react';
import type { SystemState } from './useSystemState';

interface DemoControllers {
  setOnline: (val: boolean) => void;
  createMemory: (text: string, category: 'PRIVATE' | 'NORMAL' | 'HIGH PRIORITY', tags: string[], device: string, source: string) => void;
  runSync: () => void;
  log: (entry: { event: any; device: string; memoryId: string | null; status: any; message: string }) => void;
  setDemoActive: (val: boolean) => void;
  resetDemo: () => void;
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export function useLiveDemo(controllers: DemoControllers, state: SystemState) {
  const runningRef = useRef(false);
  const cancelRef = useRef(false);

  const runDemo = useCallback(async (onPhase: (phase: string, description: string) => void) => {
    if (runningRef.current) return;
    runningRef.current = true;
    cancelRef.current = false;
    controllers.setDemoActive(true);
    controllers.resetDemo();
    await wait(500);

    const checkCancel = () => { if (cancelRef.current) { runningRef.current = false; controllers.setDemoActive(false); return true; } return false; };

    try {
      onPhase('PHASE 1', 'System Online');
      await wait(1500);
      if (checkCancel()) return;

      onPhase('PHASE 2', 'Creating memory: "Machine 07 experienced overheating during operation."');
      controllers.createMemory('Machine 07 experienced overheating during operation.', 'NORMAL', ['machine-07', 'temperature', 'overheating'], 'EDGE-NODE-01', 'EDGE-NODE-01');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 3', 'Generating embedding via FastEmbed (BAAI/bge-small-en-v1.5)');
      await wait(1500);
      if (checkCancel()) return;

      onPhase('PHASE 4', 'Storing in Qdrant Edge local vector collection');
      await wait(1500);
      if (checkCancel()) return;

      onPhase('PHASE 5', 'LOCAL MEMORY CREATED');
      await wait(1500);
      if (checkCancel()) return;

      onPhase('PHASE 6', 'Enabling Offline Mode — disconnecting from Qdrant Cloud');
      controllers.setOnline(false);
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 7', 'Semantic search: "Have we seen a heating problem before?"');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 8', 'Returning local semantic results from Qdrant Edge');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 9', 'Creating offline memory: "Machine 12 reported abnormal temperature readings."');
      controllers.createMemory('Machine 12 reported abnormal temperature readings.', 'HIGH PRIORITY', ['machine-12', 'temperature'], 'EDGE-NODE-02', 'EDGE-NODE-02');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 10', 'PENDING SYNC: 1 — Memory queued for priority sync');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 11', 'Restoring online connection');
      controllers.setOnline(true);
      await wait(1500);
      if (checkCancel()) return;

      onPhase('PHASE 12', 'CONNECTION RESTORED — Sync engine activated');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 13', 'Processing synchronization queue');
      controllers.runSync();
      await wait(3000);
      if (checkCancel()) return;

      onPhase('PHASE 14', 'SYNC COMPLETED — All eligible memories synced to Qdrant Cloud');
      await wait(2000);
      if (checkCancel()) return;

      onPhase('PHASE 15', 'PRIVATE memory policy: remains LOCAL ONLY — never synced');
      controllers.createMemory('Private maintenance key stored for local access only.', 'PRIVATE', ['security', 'private'], 'EDGE-NODE-01', 'EDGE-NODE-01');
      await wait(2500);
      if (checkCancel()) return;

      onPhase('COMPLETE', 'Live demo finished — All phases demonstrated successfully');
      await wait(1500);
    } finally {
      runningRef.current = false;
      controllers.setDemoActive(false);
      onPhase('', '');
    }
  }, [controllers]);

  const cancelDemo = useCallback(() => {
    cancelRef.current = true;
  }, []);

  return { runDemo, cancelDemo };
}
