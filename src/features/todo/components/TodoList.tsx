import React, { useState, useEffect } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoItem } from './TodoItem';
import { ConfirmModal } from '@/components/ConfirmModal';

const QUOTES = [
    "Time is more powerful than wealth. Use it wisely.",
    "The two most powerful warriors are patience and time.",
    "Time is what we want most, but what we use worst.",
    "Lost time is never found again.",
    "Your time is limited, so don't waste it living someone else's life.",
    "The key is in not spending time, but in investing it."
];

export const TodoList: React.FC = () => {
    const { todos, removedTodos, addTodo, removeTodo, restoreTodo, deleteForever, clearAllRemoved, updateTodo, togglePriority } = useTodos();
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
                setIsExiting(false);
            }, 500); // Wait for fade out animation
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleClearAll = () => {
        clearAllRemoved();
        setShowClearAllModal(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: '20px',
                width: '100%',
                maxWidth: '1200px',
                height: '85vh',
                margin: '0 20px',
            }}
        >
            {/* Main Todo Panel */}
            <div
                className="glass-panel animate-enter"
                style={{
                    flex: '1',
                    padding: '40px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '400px',
                }}
            >
                <h1
                    style={{
                        fontSize: '2rem',
                        marginBottom: '8px',
                        fontWeight: 600,
                        background: 'linear-gradient(to right, #818cf8, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Daily focus
                </h1>

                <div style={{ height: '24px', marginBottom: '32px' }}>
                    <p
                        style={{
                            color: 'var(--text-secondary)',
                            margin: 0,
                            transition: 'all 0.5s ease-in-out',
                            opacity: isExiting ? 0 : 0.8,
                            transform: isExiting ? 'translateY(-10px)' : 'translateY(0)',
                            fontStyle: 'italic',
                        }}
                    >
                        {QUOTES[quoteIndex]}
                    </p>
                </div>

                <TodoInput onAdd={addTodo} />

                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: '4px' }}>
                    {todos.length === 0 && removedTodos.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                marginTop: '40px',
                                fontStyle: 'italic',
                                opacity: 0.6
                            }}
                        >
                            All clear. Enjoy the moment.
                        </div>
                    ) : (
                        <>
                            {todos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onRemove={removeTodo}
                                    onEdit={updateTodo}
                                    onTogglePriority={togglePriority}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Removed Tasks Panel - Separate Section */}
            {removedTodos.length > 0 && (
                <div
                    className="glass-panel animate-enter"
                    style={{
                        width: '350px',
                        flexShrink: 0,
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h2 style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                            opacity: 0.8,
                            margin: 0,
                        }}>
                            Removed Tasks
                        </h2>

                        {removedTodos.length > 1 && (
                            <button
                                onClick={() => setShowClearAllModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: 0.7,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.opacity = '0.7';
                                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Clear All
                            </button>
                        )}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: '4px' }}>
                        {removedTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onRemove={restoreTodo}
                                onDeleteForever={deleteForever}
                                onEdit={updateTodo}
                                variant="removed"
                            />
                        ))}
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showClearAllModal}
                title="Delete All Removed Tasks?"
                message={`Are you sure you want to permanently delete all ${removedTodos.length} removed task${removedTodos.length === 1 ? '' : 's'}? This action cannot be undone.`}
                onConfirm={handleClearAll}
                onCancel={() => setShowClearAllModal(false)}
            />
        </div>
    );
};
