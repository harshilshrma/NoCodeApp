// KnowledgeBaseNode.jsx

import React, { useState } from 'react';
import { Position } from 'reactflow';
import NodeBase from './NodeBase';
import { MdLibraryBooks } from "react-icons/md";

export const KnowledgeBaseNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.kbName || id.replace('knowledge-base-', 'kb_'));
  const [embeddingModel, setEmbeddingModel] = useState(data?.embeddingModel || 'text-embedding-3-large');
  const [apiKey, setApiKey] = useState(data?.apiKey || '');
  const [enableSearch, setEnableSearch] = useState(data?.enableSearch || true);
  const [similarityThreshold, setSimilarityThreshold] = useState(data?.similarityThreshold || 0.7);

  const handleDelete = () => {
    console.log('Delete knowledge base node:', id);
  };

  return (
    <NodeBase
      id={id}
      title="Knowledge Base"
      icon={<MdLibraryBooks size={20} color="#555" />}
      description="Upload and process documents for knowledge retrieval"
      nodeName={currName}
      onNameChange={setCurrName}
      fields={[
        {
          label: 'Enable Document Search',
          type: 'checkbox',
          value: enableSearch,
          onChange: (e) => setEnableSearch(e.target.checked),
        },
        {
          label: 'Embedding Model',
          type: 'select',
          value: embeddingModel,
          onChange: (e) => setEmbeddingModel(e.target.value),
          options: ['text-embedding-3-large', 'text-embedding-ada-002', 'text-embedding-3-small'],
          helper: 'Select the embedding model for document processing',
        },
        {
          label: 'API Key',
          type: 'text',
          value: apiKey,
          onChange: (e) => setApiKey(e.target.value),
          placeholder: 'Enter your OpenAI API key',
          helper: 'Required for embedding generation',
        },
        {
          label: 'Similarity Threshold',
          type: 'text',
          value: similarityThreshold,
          onChange: (e) => setSimilarityThreshold(e.target.value),
          placeholder: '0.7',
          helper: 'Minimum similarity score for document retrieval',
        },
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-query`,
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-context`,
        },
      ]}
      onDelete={handleDelete}
    />
  );
};