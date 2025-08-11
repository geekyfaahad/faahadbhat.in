import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing your content..." }) => {
  // Custom Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true
    }
  }), []);

  // Custom Quill formats configuration
  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image', 'code-block'
  ], []);

  // Custom Quill theme configuration
  const quillTheme = useMemo(() => ({
    'ql-editor': {
      minHeight: '300px',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#e5e7eb',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: '16px',
      '&:focus': {
        outline: 'none',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
      }
    },
    '.ql-toolbar': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    '.ql-container': {
      border: 'none',
      fontFamily: 'inherit'
    },
    '.ql-toolbar button': {
      color: '#d1d5db',
      '&:hover': {
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
      '&.ql-active': {
        color: '#ffffff',
        backgroundColor: '#3b82f6'
      }
    },
    '.ql-toolbar .ql-stroke': {
      stroke: '#d1d5db'
    },
    '.ql-toolbar .ql-fill': {
      fill: '#d1d5db'
    },
    '.ql-toolbar .ql-picker': {
      color: '#d1d5db'
    },
    '.ql-toolbar .ql-picker-options': {
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px'
    },
    '.ql-toolbar .ql-picker-item': {
      color: '#d1d5db',
      '&:hover': {
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    '.ql-toolbar .ql-selected': {
      color: '#ffffff',
      backgroundColor: '#3b82f6'
    },
    '.ql-editor a': {
      color: '#60a5fa',
      textDecoration: 'underline',
      '&:hover': {
        color: '#93c5fd'
      }
    },
    '.ql-editor img': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      margin: '16px 0'
    },
    '.ql-editor pre': {
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      overflowX: 'auto',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#d1d5db'
    },
    '.ql-editor code': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '2px 4px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '14px'
    },
    '.ql-editor blockquote': {
      borderLeft: '4px solid #60a5fa',
      paddingLeft: '16px',
      margin: '16px 0',
      fontStyle: 'italic',
      color: '#9ca3af'
    },
    '.ql-editor h1, .ql-editor h2, .ql-editor h3': {
      color: '#ffffff',
      fontWeight: '600',
      margin: '24px 0 16px 0'
    },
    '.ql-editor h1': {
      fontSize: '2rem'
    },
    '.ql-editor h2': {
      fontSize: '1.5rem'
    },
    '.ql-editor h3': {
      fontSize: '1.25rem'
    },
    '.ql-editor p': {
      margin: '8px 0'
    },
    '.ql-editor ul, .ql-editor ol': {
      paddingLeft: '24px',
      margin: '8px 0'
    },
    '.ql-editor li': {
      margin: '4px 0'
    }
  }), []);

  // Handle content change
  const handleChange = (content, delta, source, editor) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="space-y-3">
      <style>
        {`
          .ql-editor {
            min-height: 300px !important;
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: #e5e7eb !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 8px !important;
            padding: 16px !important;
          }
          
          .ql-editor:focus {
            outline: none !important;
            border-color: rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
          }
          
          .ql-toolbar {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            padding: 12px !important;
            margin-bottom: 12px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          
          .ql-container {
            border: none !important;
            font-family: inherit !important;
          }
          
          .ql-toolbar button {
            color: #d1d5db !important;
          }
          
          .ql-toolbar button:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          .ql-toolbar button.ql-active {
            color: #ffffff !important;
            background-color: #3b82f6 !important;
          }
          
          .ql-toolbar .ql-stroke {
            stroke: #d1d5db !important;
          }
          
          .ql-toolbar .ql-fill {
            fill: #d1d5db !important;
          }
          
          .ql-toolbar .ql-picker {
            color: #d1d5db !important;
          }
          
          .ql-toolbar .ql-picker-options {
            background-color: #1a1a1a !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 4px !important;
          }
          
          .ql-toolbar .ql-picker-item {
            color: #d1d5db !important;
          }
          
          .ql-toolbar .ql-picker-item:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          .ql-toolbar .ql-selected {
            color: #ffffff !important;
            background-color: #3b82f6 !important;
          }
          
          .ql-editor a {
            color: #60a5fa !important;
            text-decoration: underline !important;
          }
          
          .ql-editor a:hover {
            color: #93c5fd !important;
          }
          
          .ql-editor img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 8px !important;
            margin: 16px 0 !important;
          }
          
          .ql-editor pre {
            background-color: #1f2937 !important;
            border: 1px solid #374151 !important;
            border-radius: 8px !important;
            padding: 16px !important;
            margin: 16px 0 !important;
            overflow-x: auto !important;
            font-family: monospace !important;
            font-size: 14px !important;
            color: #d1d5db !important;
          }
          
          .ql-editor code {
            background-color: rgba(255, 255, 255, 0.1) !important;
            padding: 2px 4px !important;
            border-radius: 4px !important;
            font-family: monospace !important;
            font-size: 14px !important;
          }
          
          .ql-editor blockquote {
            border-left: 4px solid #60a5fa !important;
            padding-left: 16px !important;
            margin: 16px 0 !important;
            font-style: italic !important;
            color: #9ca3af !important;
          }
          
          .ql-editor h1, .ql-editor h2, .ql-editor h3 {
            color: #ffffff !important;
            font-weight: 600 !important;
            margin: 24px 0 16px 0 !important;
          }
          
          .ql-editor h1 {
            font-size: 2rem !important;
          }
          
          .ql-editor h2 {
            font-size: 1.5rem !important;
          }
          
          .ql-editor h3 {
            font-size: 1.25rem !important;
          }
          
          .ql-editor p {
            margin: 8px 0 !important;
          }
          
          .ql-editor ul, .ql-editor ol {
            padding-left: 24px !important;
            margin: 8px 0 !important;
          }
          
          .ql-editor li {
            margin: 4px 0 !important;
          }
          
          .ql-editor::before {
            content: attr(data-placeholder);
            color: #9ca3af;
            position: absolute;
            pointer-events: none;
            font-style: italic;
          }
          
          .ql-editor:not(.ql-blank)::before {
            display: none;
          }
        `}
      </style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'transparent',
          border: 'none'
        }}
      />
    </div>
  );
};

export default RichTextEditor; 