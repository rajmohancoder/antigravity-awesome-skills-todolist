import React, { useState, useCallback } from 'react';
import type { Todo } from '@/types/todo';
import { Tooltip } from '@/components/Tooltip';

interface TodoItemProps {
    todo: Todo;
    onRemove: (id: string) => void;
    onDeleteForever?: (id: string) => void;
    onEdit?: (id: string, text: string) => void;
    onTogglePriority?: (id: string) => void;
    variant?: 'active' | 'removed';
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onRemove, onDeleteForever, onEdit, onTogglePriority, variant = 'active' }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleAction = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(todo.id);
        }, 400);
    }, [todo.id, onRemove]);

    const handleDeleteForever = useCallback(() => {
        if (!onDeleteForever) return;
        setIsExiting(true);
        setTimeout(() => {
            onDeleteForever(todo.id);
        }, 400);
    }, [todo.id, onDeleteForever]);

    const handleEditSave = () => {
        if (editText.trim() && editText !== todo.text && onEdit) {
            onEdit(todo.id, editText.trim());
        } else {
            setEditText(todo.text); // Reset if empty or unchanged
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEditSave();
            e.preventDefault();
        } else if (e.key === 'Escape') {
            setEditText(todo.text);
            setIsEditing(false);
            e.preventDefault();
        }
    };

    return (
        <div
            className={`todo-row ${isExiting ? 'exiting' : ''}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                marginBottom: '8px',
                backgroundColor: variant === 'removed'
                    ? 'rgba(255, 255, 255, 0.015)'
                    : todo.isPriority
                        ? 'rgba(129, 140, 248, 0.08)'
                        : 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                borderLeft: todo.isPriority && variant === 'active' ? '3px solid var(--accent-color)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                opacity: 1,
                transform: 'translateX(0)',
            }}
        >
            {variant === 'active' && onTogglePriority && (
                <Tooltip content={todo.isPriority ? "Remove priority" : "Mark as priority"}>
                    <button
                        onClick={() => onTogglePriority(todo.id)}
                        aria-label={todo.isPriority ? "Remove priority" : "Mark as priority"}
                        style={{
                            width: '24px',
                            height: '24px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            marginRight: '12px',
                            color: todo.isPriority ? '#fbbf24' : 'var(--text-secondary)',
                            opacity: todo.isPriority ? 1 : 0.5,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = todo.isPriority ? '1' : '0.5';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={todo.isPriority ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                </Tooltip>
            )}

            {isEditing ? (
                <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleEditSave}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1,
                        fontSize: '1.1rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--accent-color)',
                        color: 'var(--text-primary)',
                        padding: '4px 0',
                        marginRight: '16px',
                        outline: 'none',
                    }}
                />
            ) : (
                <div
                    style={{
                        flex: 1,
                        fontSize: '1.1rem',
                        color: variant === 'removed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                        textDecoration: variant === 'removed' ? 'line-through' : 'none',
                        opacity: variant === 'removed' ? 0.7 : 1,
                        cursor: onEdit ? 'text' : 'default',
                    }}
                    onDoubleClick={() => onEdit && setIsEditing(true)}
                >
                    {todo.text}
                </div>
            )}

            {!isEditing && onEdit && (
                <Tooltip content="Edit task">
                    <button
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit task"
                        style={{
                            width: '24px',
                            height: '24px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            marginLeft: '8px',
                            color: 'var(--text-secondary)',
                            opacity: 0.6
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.opacity = '0.6';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </Tooltip>
            )}

            {!isEditing && (
                <>
                    <Tooltip content={variant === 'removed' ? "Restore task" : "Complete task"}>
                        <button
                            onClick={handleAction}
                            aria-label={variant === 'removed' ? "Restore task" : "Complete task"}
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: variant === 'removed' ? 'none' : '2px solid var(--accent-color)',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                marginLeft: '8px',
                                color: 'var(--accent-color)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(129, 140, 248, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {variant === 'removed' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 14 4 9 9 4"></polyline>
                                    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                                </svg>
                            ) : (
                                /* Empty ring for active tasks */
                                null
                            )}
                        </button>
                    </Tooltip>

                    {variant === 'removed' && onDeleteForever && (
                        <Tooltip content="Delete forever">
                            <button
                                onClick={handleDeleteForever}
                                aria-label="Delete forever"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    marginLeft: '8px',
                                    color: '#ef4444',
                                    opacity: 0.6
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.borderRadius = '50%';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.opacity = '0.6';
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </Tooltip>
                    )}
                </>
            )}

            <style>{`
        .todo-row.exiting {
          opacity: 0 !important;
          transform: translateX(50px) !important;
          margin-bottom: -58px !important; /* Collapses space */
        }
      `}</style>
        </div>
    );
};
