import { Concept } from "./types";

/**
 * Graph helper utility for Concept Directed Acyclic Graphs (DAG).
 * Validates acyclicity and provides prerequisite ancestry resolution.
 */

export class ConceptGraph {
  private conceptsMap: Map<string, Concept>;
  private adjacencyList: Map<string, string[]>; // concept -> prerequisites

  constructor(concepts: Concept[]) {
    this.conceptsMap = new Map();
    this.adjacencyList = new Map();

    for (const c of concepts) {
      this.conceptsMap.set(c.id, c);
      this.adjacencyList.set(c.id, [...c.prerequisites]);
    }
  }

  public getConcept(id: string): Concept | undefined {
    return this.conceptsMap.get(id);
  }

  public getAllConcepts(): Concept[] {
    return Array.from(this.conceptsMap.values());
  }

  /**
   * Checks for cycles in the prerequisite graph using 3-color DFS.
   * Returns { hasCycle: boolean, cyclePath?: string[] }
   */
  public detectCycle(): { hasCycle: boolean; cyclePath?: string[] } {
    const visited = new Map<string, "unvisited" | "visiting" | "visited">();
    const parent = new Map<string, string | null>();

    for (const id of Array.from(this.conceptsMap.keys())) {
      visited.set(id, "unvisited");
      parent.set(id, null);
    }

    const dfs = (
      node: string,
      path: string[]
    ): { hasCycle: boolean; cyclePath?: string[] } => {
      visited.set(node, "visiting");
      path.push(node);

      const prereqs = this.adjacencyList.get(node) || [];
      for (const p of prereqs) {
        if (!this.conceptsMap.has(p)) {
          // Handled as invalid reference, not cycle
          continue;
        }
        if (visited.get(p) === "visiting") {
          const cycleStartIndex = path.indexOf(p);
          const cycle = path.slice(cycleStartIndex);
          cycle.push(p);
          return { hasCycle: true, cyclePath: cycle };
        }
        if (visited.get(p) === "unvisited") {
          parent.set(p, node);
          const res = dfs(p, path);
          if (res.hasCycle) return res;
        }
      }

      visited.set(node, "visited");
      path.pop();
      return { hasCycle: false };
    };

    for (const id of Array.from(this.conceptsMap.keys())) {
      if (visited.get(id) === "unvisited") {
        const res = dfs(id, []);
        if (res.hasCycle) return res;
      }
    }

    return { hasCycle: false };
  }

  /**
   * Returns all transitive prerequisites for a concept in topological order
   * (foundations first, leading up to the target concept).
   */
  public getPrerequisiteChain(conceptId: string): Concept[] {
    const visited = new Set<string>();
    const chain: Concept[] = [];

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const concept = this.conceptsMap.get(id);
      if (!concept) return;

      for (const prereqId of concept.prerequisites) {
        traverse(prereqId);
      }

      chain.push(concept);
    };

    const target = this.conceptsMap.get(conceptId);
    if (!target) return [];

    // Traverse prerequisites only (omit self from prereqs if needed, or include at end)
    for (const prereqId of target.prerequisites) {
      traverse(prereqId);
    }

    return chain;
  }

  /**
   * Traces back to find the earliest unmastered foundational gap
   * given a set of known mastered concept IDs.
   */
  public findRootGap(
    targetConceptId: string,
    masteredConceptIds: Set<string>
  ): Concept | null {
    const chain = this.getPrerequisiteChain(targetConceptId);
    // Chain is sorted foundations-first
    for (const concept of chain) {
      if (!masteredConceptIds.has(concept.id)) {
        return concept;
      }
    }
    return null;
  }
}
