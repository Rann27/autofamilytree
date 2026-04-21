import dagre from '@dagrejs/dagre';
import { Member } from './members';

const NODE_WIDTH = 140;
const NODE_HEIGHT = 160;
const NODE_WIDTH_MOBILE = 120;
const NODE_HEIGHT_MOBILE = 140;

interface LayoutNode {
  id: string;
  position: { x: number; y: number };
  data: Member;
  type: string;
}

interface LayoutEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  style?: Record<string, string>;
  animated?: boolean;
}

interface LayoutResult {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
}

export function buildTreeLayout(members: Member[], isMobile = false): LayoutResult {
  if (members.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodeW = isMobile ? NODE_WIDTH_MOBILE : NODE_WIDTH;
  const nodeH = isMobile ? NODE_HEIGHT_MOBILE : NODE_HEIGHT;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    ranksep: 80,
    nodesep: 40,
    edgesep: 20,
  });

  const nodes: LayoutNode[] = members.map(m => ({
    id: m.id,
    position: { x: 0, y: 0 },
    data: m,
    type: 'memberNode',
  }));

  nodes.forEach(node => g.setNode(node.id, { width: nodeW, height: nodeH }));

  const edges: LayoutEdge[] = [];
  const addedEdges = new Set<string>();

  members.forEach(member => {
    // Parent → child edges
    const parentIds = member.parentIds || [];
    parentIds.forEach(parentId => {
      const edgeKey = `${parentId}-${member.id}`;
      if (!addedEdges.has(edgeKey) && members.find(m => m.id === parentId)) {
        g.setEdge(parentId, member.id);
        edges.push({
          id: edgeKey,
          source: parentId,
          target: member.id,
          type: 'smoothstep',
          style: { stroke: 'var(--color-edge)', strokeWidth: '1.5' },
        });
        addedEdges.add(edgeKey);
      }
    });

    // Spouse edges (only add once per pair)
    const spouseIds = member.spouseIds || [];
    spouseIds.forEach(spouseId => {
      const pairKey = [member.id, spouseId].sort().join('-spouse-');
      if (!addedEdges.has(pairKey) && members.find(m => m.id === spouseId)) {
        g.setEdge(member.id, spouseId, { weight: 0 });
        edges.push({
          id: pairKey,
          source: member.id,
          target: spouseId,
          type: 'smoothstep',
          style: {
            stroke: 'var(--color-edge-spouse)',
            strokeWidth: '1.5',
            strokeDasharray: '4 2',
          },
        });
        addedEdges.add(pairKey);
      }
    });
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map(node => {
    const nodeWithPos = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPos.x - nodeW / 2,
        y: nodeWithPos.y - nodeH / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
