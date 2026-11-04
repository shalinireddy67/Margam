import { Concept, GraphAuditReport } from "./types";

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
   * Detailed prerequisite chain resolution with edge metadata and teacher-review requirements.
   */
  public getPrerequisiteChainDetailed(conceptId: string): Array<{
    concept: Concept;
    depth: number;
    reason?: string;
    status: "verified" | "tentative, pending teacher review";
    requiresTeacherReview: boolean;
  }> {
    const chain = this.getPrerequisiteChain(conceptId);
    const result: Array<{
      concept: Concept;
      depth: number;
      reason?: string;
      status: "verified" | "tentative, pending teacher review";
      requiresTeacherReview: boolean;
    }> = [];

    for (let i = 0; i < chain.length; i++) {
      const c = chain[i];
      // Check if target concept or previous concept had an edge to c
      let metaReason = "Prerequisite foundational dependency.";
      let metaStatus: "verified" | "tentative, pending teacher review" = "tentative, pending teacher review";

      const target = this.conceptsMap.get(conceptId);
      if (target?.edgeMeta?.[c.id]) {
        metaReason = target.edgeMeta[c.id].reason;
        metaStatus = target.edgeMeta[c.id].status;
      }

      result.push({
        concept: c,
        depth: chain.length - i,
        reason: metaReason,
        status: metaStatus,
        requiresTeacherReview: metaStatus !== "verified",
      });
    }

    return result;
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

  /**
   * Audits the entire concept prerequisite graph:
   * 1. Inspects cycle detection.
   * 2. Identifies missing or invalid prerequisite links.
   * 3. Identifies duplicate prerequisite links.
   * 4. Flags grade inversions (prerequisite from higher grade).
   * 5. Flags questionable cross-domain links requiring educator review.
   * 6. Audits verification status: distinguishes tentative edges from verified edges.
   */
  public auditGraph(): GraphAuditReport {
    const totalConcepts = this.conceptsMap.size;
    let totalEdges = 0;
    const missingPrerequisites: Array<{ conceptId: string; missingPrereqId: string }> = [];
    const duplicatePrerequisites: Array<{ conceptId: string; duplicatePrereqId: string }> = [];
    const gradeInversions: Array<{
      conceptId: string;
      conceptClass: number;
      prereqId: string;
      prereqClass: number;
    }> = [];
    const questionableLinks: Array<{ conceptId: string; prereqId: string; reason: string }> = [];
    const tentativeEdges: Array<{ conceptId: string; prereqId: string; reason: string }> = [];
    const verifiedEdges: Array<{ conceptId: string; prereqId: string; reason: string }> = [];

    for (const [id, concept] of Array.from(this.conceptsMap.entries())) {
      const seenPrereqs = new Set<string>();

      for (const prereqId of concept.prerequisites) {
        totalEdges++;

        // Duplicate check
        if (seenPrereqs.has(prereqId)) {
          duplicatePrerequisites.push({ conceptId: id, duplicatePrereqId: prereqId });
        }
        seenPrereqs.add(prereqId);

        // Missing check
        const prereq = this.conceptsMap.get(prereqId);
        if (!prereq) {
          missingPrerequisites.push({ conceptId: id, missingPrereqId: prereqId });
          continue;
        }

        // Grade inversion check: prerequisite cannot belong to a higher class
        if (prereq.class > concept.class) {
          gradeInversions.push({
            conceptId: id,
            conceptClass: concept.class,
            prereqId,
            prereqClass: prereq.class,
          });
        }

        // Edge metadata audit
        const meta = concept.edgeMeta?.[prereqId];
        const reason = meta?.reason || "No explicit pedagogical reason documented.";
        const status = meta?.status || "tentative, pending teacher review";

        if (status === "verified") {
          verifiedEdges.push({ conceptId: id, prereqId, reason });
        } else {
          tentativeEdges.push({ conceptId: id, prereqId, reason });
        }

        // Questionable links: cross-domain (e.g., number system to geometry)
        if (
          (id.startsWith("c6-neg") && prereqId.startsWith("c6-geo")) ||
          (concept.chapter.toLowerCase().includes("zero") && prereq.chapter.toLowerCase().includes("lines"))
        ) {
          questionableLinks.push({
            conceptId: id,
            prereqId,
            reason: `Questionable cross-domain link: "${concept.name.en}" (Number Systems) is linked to "${prereq.name.en}" (Geometry). Marked as tentative, pending teacher review.`,
          });
        }
      }
    }

    const cycleCheck = this.detectCycle();

    const isValid =
      !cycleCheck.hasCycle &&
      missingPrerequisites.length === 0 &&
      duplicatePrerequisites.length === 0 &&
      gradeInversions.length === 0;

    return {
      totalConcepts,
      totalEdges,
      hasCycle: cycleCheck.hasCycle,
      cyclePath: cycleCheck.cyclePath,
      missingPrerequisites,
      duplicatePrerequisites,
      gradeInversions,
      questionableLinks,
      tentativeEdges,
      verifiedEdges,
      educatorReviewedCount: verifiedEdges.length,
      tentativeCount: tentativeEdges.length,
      isValid,
    };
  }
}
