// LLMEngineNode.jsx

import React, { useState } from 'react';
import { Position } from 'reactflow';
import NodeBase from './NodeBase';
import { SiOpenai } from "react-icons/si";

const MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-turbo'];

export const LLMEngineNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.llmName || id.replace('llm-engine-', 'llm_'));
  const [model, setModel] = useState(data?.model || MODELS[0]);
  const [apiKey, setApiKey] = useState(data?.apiKey || '');
  const [systemPrompt, setSystemPrompt] = useState(data?.systemPrompt || 'You are a helpful AI assistant.');
  const [temperature, setTemperature] = useState(data?.temperature || 0.7);
  const [enableWebSearch, setEnableWebSearch] = useState(data?.enableWebSearch || false);
  const [serpApiKey, setSerpApiKey] = useState(data?.serpApiKey || '');

  const handleDelete = () => {
    console.log('Delete LLM engine node:', id);
  };

  return (
    <NodeBase
      id={id}
      title="LLM Engine"
      icon={<SiOpenai size={20} color="#555" />}
      description="Process queries with language models"
      nodeName={currName}
      onNameChange={setCurrName}
      fields={[
        {
          label: 'Model',
          type: 'select',
          value: model,
          onChange: (e) => setModel(e.target.value),
          options: MODELS,
          helper: 'Select the LLM model to use',
        },
        {
          label: 'API Key',
          type: 'text',
          value: apiKey,
          onChange: (e) => setApiKey(e.target.value),
          placeholder: 'Enter your OpenAI API key',
          helper: 'Required for LLM API calls',
        },
        {
          label: 'System Prompt',
          type: 'textarea',
          value: systemPrompt,
          onChange: (e) => setSystemPrompt(e.target.value),
          placeholder: 'You are a helpful AI assistant...',
          helper: 'Instructions for the AI model',
        },
        {
          label: 'Temperature',
          type: 'text',
          value: temperature,
          onChange: (e) => setTemperature(e.target.value),
          placeholder: '0.7',
          helper: 'Controls randomness (0.0 to 1.0)',
        },
        {
          label: 'Enable Web Search',
          type: 'checkbox',
          value: enableWebSearch,
          onChange: (e) => setEnableWebSearch(e.target.checked),
        },
        {
          label: 'SerpAPI Key',
          type: 'text',
          value: serpApiKey,
          onChange: (e) => setSerpApiKey(e.target.value),
          placeholder: 'Enter your SerpAPI key',
          helper: 'Required for web search functionality',
        },
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-query`,
          style: { top: '30%' },
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-context`,
          style: { top: '70%' },
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`,
        },
      ]}
      onDelete={handleDelete}
    />
  );
};