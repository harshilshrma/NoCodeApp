// UserInputNode.jsx

import React, { useState } from 'react';
import { Position } from 'reactflow';
import NodeBase from './NodeBase';
import { MdInput } from "react-icons/md";

export const UserInputNode = ({ id, data, onDelete }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('user-input-', 'user_input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const [query, setQuery] = useState(data?.query || '');

  const handleDelete = () => {
    console.log('UserInputNode handleDelete called for:', id)
    if (onDelete) {
      onDelete(id);
    } else {
      console.log('onDelete prop not provided')
    }
  };

  return (
    <NodeBase
      id={id}
      title="User Query"
      icon={<MdInput size={20} color="#555" />}
      description="Accepts user queries via a simple interface"
      nodeName={currName}
      onNameChange={setCurrName}
      fields={[
        {
          label: 'Input Type',
          type: 'select',
          value: inputType,
          onChange: (e) => setInputType(e.target.value),
          options: ['Text', 'File'],
          helper: 'Select how users will input their queries',
        },
        {
          label: 'Query',
          type: 'textarea',
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: 'Enter your query here...',
          helper: 'The user query to process',
        },
      ]}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-query`,
        },
      ]}
      onDelete={handleDelete}
    />
  );
};