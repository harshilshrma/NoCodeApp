import React, { useState, useRef, useEffect } from 'react';
import { Handle } from 'reactflow';
import './NodeBase.css';
import { IoMdCloseCircleOutline } from "react-icons/io";

const NodeBase = ({
  id,
  icon,
  title,
  description,
  nodeName,
  onNameChange,
  fields = [],
  handles = [],
  onDelete,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(nodeName);
  const [nameError, setNameError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingName && inputRef.current) inputRef.current.focus();
  }, [editingName]);

  const handleNameClick = () => {
    setEditingName(true);
    setTempName(nodeName);
    setNameError('');
  };
  
  const handleNameChange = (e) => {
    setTempName(e.target.value);
    setNameError(e.target.value.trim() === '' ? 'Name is required!' : '');
  };
  
  const saveName = () => {
    if (tempName.trim() === '') {
      setNameError('Name is required');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setEditingName(false);
    setNameError('');
    if (onNameChange && tempName !== nodeName) onNameChange(tempName);
  };
  
  const handleNameBlur = () => {
    if (tempName.trim() === '') {
      setNameError('Name is required');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    saveName();
  };
  
  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') {
      setEditingName(false);
      setTempName(nodeName);
      setNameError('');
    }
  };

  return (
    <div className="node-base">
      <div className="node-header">
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title}</span>
        {onDelete && (
          <button className="node-delete" onClick={onDelete} title="Delete node">
            <IoMdCloseCircleOutline style={{color: 'currentColor', marginTop: '5px'}} size={20}/>
          </button>
        )}
      </div>
      {description && <div className="node-desc">{description}</div>}
      {nodeName && (
        <div className="node-name" onClick={editingName ? undefined : handleNameClick}>
          {editingName ? (
            <>
              <input
                className="node-name-input"
                type="text"
                value={tempName}
                ref={inputRef}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
              />
              {nameError && <div className="node-name-error">{nameError}</div>}
            </>
          ) : (
            <span title="Click to edit name">{nodeName}</span>
          )}
        </div>
      )}
      <div className="node-fields">
        {fields.map((field, idx) => (
          <div className="node-field" key={idx}>
            <label className="node-label">
              {field.label}
              {field.required && <span className="node-required"> *</span>}
              {field.helper && <span className="node-helper" title={field.helper}>?</span>}
            </label>
            {field.type === 'text' && (
              <input
                className="node-input"
                type="text"
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
              />
            )}
            {field.type === 'textarea' && (
              <TextareaAutoResize
                className="node-input"
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                minRows={2}
                maxRows={8}
              />
            )}
            {field.type === 'select' && (
              <select
                className="node-select"
                value={field.value}
                onChange={field.onChange}
              >
                {field.options && field.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {field.type === 'checkbox' && (
              <div className="node-checkbox-container">
                <input
                  type="checkbox"
                  className="node-checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
                <span className="node-checkbox-label">{field.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {handles.map((handle, idx) => (
        <Handle
          key={idx}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
        />
      ))}
    </div>
  );
};

function TextareaAutoResize({ className, value, onChange, placeholder, minRows = 2, maxRows = 8 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.min(ref.current.scrollHeight, maxRows * 24) + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={minRows}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
}

export default NodeBase;
