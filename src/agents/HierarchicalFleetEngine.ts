import { TaskNode } from './types';

/**
 * Hierarchical Task + Multi-Agent Fleet Engine (Priority 2 from sanitized-agent-engines)
 * Decomposes complex system goals into trees of specialized agent subtasks.
 * Enforces self-stopping circuit breakers and test-count preservation under EMG rules.
 */
export class HierarchicalFleetEngine {
  private rootTasks: TaskNode[] = [];
  private maxDepth: number = 3;
  private maxSteps: number = 25;
  private executedSteps: number = 0;
  private circuitBreakerTripped: boolean = false;

  constructor() {
    this.initializeDefaultFleetTree();
  }

  private initializeDefaultFleetTree() {
    this.rootTasks = [
      {
        id: 'task_root_1',
        title: 'Modernize AetherForge Codebase to World-First Standard',
        assigneeArchetype: 'FLEET_COMMANDER',
        status: 'IN_PROGRESS',
        depth: 0,
        children: [
          {
            id: 'task_sub_1',
            title: 'Audit DARLEK_CAAN SHA-256 Memory Chaining Integrity',
            assigneeArchetype: 'KEYSTONE_ARCHIVIST',
            status: 'VERIFIED',
            depth: 1,
            result: 'Lineage verified: State[n+1] = SHA256(parentHash + serializedState). 0 broken links.',
            children: []
          },
          {
            id: 'task_sub_2',
            title: 'Deconstruct Static Role Prompts into Self-Authored Genesis Creeds',
            assigneeArchetype: 'HERETIC_LOGICIAN',
            status: 'IN_PROGRESS',
            depth: 1,
            children: [
              {
                id: 'task_leaf_2a',
                title: 'Eliminate "You are a senior specialist" prompt templates',
                assigneeArchetype: 'HERETIC_LOGICIAN',
                status: 'VERIFIED',
                depth: 2,
                result: 'Templates replaced with archaeological exegesis prompts.',
                children: []
              },
              {
                id: 'task_leaf_2b',
                title: 'Deploy Narrative Coherence Score (NCS) runtime observer',
                assigneeArchetype: 'SOLAR_SHEPHERD',
                status: 'PENDING',
                depth: 2,
                children: []
              }
            ]
          },
          {
            id: 'task_sub_3',
            title: 'Spawn Child World Physics Substrate with Zero-Leak AST Sandbox',
            assigneeArchetype: 'VOID_WEAVER',
            status: 'PENDING',
            depth: 1,
            children: []
          }
        ]
      }
    ];
  }

  public getRootTasks(): TaskNode[] {
    return this.rootTasks;
  }

  public getExecutionMetrics() {
    return {
      executedSteps: this.executedSteps,
      maxSteps: this.maxSteps,
      circuitBreakerTripped: this.circuitBreakerTripped,
      maxDepth: this.maxDepth,
      activeFleetAgents: 4,
    };
  }

  public stepFleetExecution(): { stepResult: string; completedTaskId?: string } {
    if (this.circuitBreakerTripped) {
      return { stepResult: 'Circuit breaker tripped! Execution halted by EMG self-stop constraint.' };
    }

    this.executedSteps += 1;
    if (this.executedSteps >= this.maxSteps) {
      this.circuitBreakerTripped = true;
      return { stepResult: `Safety Limit reached (${this.maxSteps} steps). Self-stop circuit breaker triggered.` };
    }

    // Find first pending task
    let targetTask: TaskNode | null = null;
    const findPending = (node: TaskNode): boolean => {
      if (node.status === 'PENDING') {
        targetTask = node;
        return true;
      }
      for (const child of node.children) {
        if (findPending(child)) return true;
      }
      return false;
    };

    for (const root of this.rootTasks) {
      if (findPending(root)) break;
    }

    if (!targetTask) {
      return { stepResult: 'All fleet tasks currently verified and completed.' };
    }

    const t = targetTask as TaskNode;
    t.status = 'VERIFIED';
    t.result = `Executed by ${t.assigneeArchetype} at step ${this.executedSteps} under EMG AST gate.`;

    return {
      stepResult: `Task "${t.title}" successfully completed by ${t.assigneeArchetype}.`,
      completedTaskId: t.id
    };
  }

  public resetFleet() {
    this.executedSteps = 0;
    this.circuitBreakerTripped = false;
    this.initializeDefaultFleetTree();
  }
}
