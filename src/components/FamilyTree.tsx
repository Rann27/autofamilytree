import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Member } from '../lib/members';
import { buildTreeLayout } from '../lib/tree-layout';
import MemberNode from './MemberNode';
import MemberModal from './MemberModal';

interface FamilyTreeProps {
  members: Member[];
  onMemberClick?: (member: Member) => void;
}

const nodeTypes = { memberNode: MemberNode };

export default function FamilyTree({ members }: FamilyTreeProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { initialNodes, initialEdges } = useMemo(() => {
    const layout = buildTreeLayout(members, isMobile);
    return {
      initialNodes: layout.nodes as Node[],
      initialEdges: layout.edges as Edge[],
    };
  }, [members, isMobile]);

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node<Member>) => {
    setSelectedMember(node.data);
  }, []);

  const handleSelectMember = useCallback((member: Member) => {
    setSelectedMember(member);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: `calc(100vh - var(--header-height))`,
      marginTop: 'var(--header-height)',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="var(--color-border-light)"
          gap={24}
          size={1}
          style={{ backgroundColor: 'var(--color-bg)' }}
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
        />
        {!isMobile && (
          <MiniMap
            position="bottom-left"
            nodeColor={() => 'var(--color-sepia-light)'}
            style={{ background: 'var(--color-bg-dark)', border: '1.5px solid var(--color-border)' }}
          />
        )}
      </ReactFlow>

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          allMembers={members}
          onClose={() => setSelectedMember(null)}
          onSelectMember={handleSelectMember}
        />
      )}
    </div>
  );
}
