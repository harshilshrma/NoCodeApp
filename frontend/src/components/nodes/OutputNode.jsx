// OutputNode.jsx

import React, { useState } from 'react';
import { Position } from 'reactflow';
import NodeBase from './NodeBase';
import { MdOutlineOutput } from "react-icons/md";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('output-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const [response, setResponse] = useState(data?.response || '');

  const handleDelete = () => {
    console.log('Delete output node:', id);
  };

  return (
    <NodeBase
      id={id}
      title="Output"
      icon={<MdOutlineOutput size={20} color="#555" />}
      description="Display responses to users in chat interface"
      nodeName={currName}
      onNameChange={setCurrName}
      fields={[
        {
          label: 'Output Type',
          type: 'select',
          value: outputType,
          onChange: (e) => setOutputType(e.target.value),
          options: ['Text', 'Markdown', 'JSON'],
          helper: 'Format for displaying responses',
        },
        {
          label: 'Response',
          type: 'textarea',
          value: response,
          onChange: (e) => setResponse(e.target.value),
          placeholder: 'Response will be generated based on query...',
          helper: 'The final response to display to the user',
        },
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-input`,
        },
      ]}
      onDelete={handleDelete}
    />
  );
};