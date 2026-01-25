import React, { useState, useCallback } from 'react';

interface TodoInputProps {
    onAdd: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
    const [text, setText] = useState('');

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
            e.preventDefault();
            onAdd(text.trim());
            setText('');
        }
    }, [text, onAdd]);

    return (
        <div style={{ marginBottom: '32px' }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done?"
                autoFocus
                rows={1}
                style={{
                    width: '100%',
                    fontSize: '1.1rem',
                    padding: '12px 0',
                    color: 'var(--text-primary)',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                    transition: 'border-color 0.3s ease',
                    resize: 'none',
                    overflow: 'hidden',
                    minHeight: '40px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-color)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                onInput={(e) => {
                    // Auto-expand textarea
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
                }}
            />
        </div>
    );
};
