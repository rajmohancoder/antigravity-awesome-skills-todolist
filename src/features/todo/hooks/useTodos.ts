import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '@/types/todo';

const STORAGE_KEY = 'zen-todos';
const REMOVED_STORAGE_KEY = 'zen-removed-todos';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [removedTodos, setRemovedTodos] = useState<Todo[]>(() => {
        try {
            const stored = localStorage.getItem(REMOVED_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist to LocalStorage whenever todos change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    // Persist removed todos
    useEffect(() => {
        localStorage.setItem(REMOVED_STORAGE_KEY, JSON.stringify(removedTodos));
    }, [removedTodos]);

    const addTodo = useCallback((text: string) => {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            createdAt: Date.now(),
        };
        // Add to top of list
        setTodos((prev) => [newTodo, ...prev]);
    }, []);

    const removeTodo = useCallback((id: string) => {
        // Find item in current state to avoid side-effects in setState updater
        const todoToRemove = todos.find((t) => t.id === id);
        if (todoToRemove) {
            setRemovedTodos((prev) => [todoToRemove, ...prev]);
            setTodos((prev) => prev.filter((t) => t.id !== id));
        }
    }, [todos]);

    const removeAllTodos = useCallback(() => {
        setRemovedTodos((prev) => [...todos, ...prev]);
        setTodos([]);
    }, [todos]);

    const restoreTodo = useCallback((id: string) => {
        const todoToRestore = removedTodos.find((t) => t.id === id);
        if (todoToRestore) {
            setTodos((prev) => [todoToRestore, ...prev]);
            setRemovedTodos((prev) => prev.filter((t) => t.id !== id));
        }
    }, [removedTodos]);

    const deleteForever = useCallback((id: string) => {
        setRemovedTodos((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clearAllRemoved = useCallback(() => {
        setRemovedTodos([]);
    }, []);

    const restoreAllRemoved = useCallback(() => {
        setTodos((prev) => [...removedTodos, ...prev]);
        setRemovedTodos([]);
    }, [removedTodos]);

    const updateTodo = useCallback((id: string, newText: string) => {
        setTodos((prev) => prev.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
        ));
        setRemovedTodos((prev) => prev.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
        ));
    }, []);

    const togglePriority = useCallback((id: string) => {
        setTodos((prev) => prev.map((todo) =>
            todo.id === id ? { ...todo, isPriority: !todo.isPriority } : todo
        ));
    }, []);

    // Sort todos: priority tasks first, then by creation date
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return b.createdAt - a.createdAt; // Newest first within same priority
    });

    return {
        todos: sortedTodos,
        removedTodos,
        addTodo,
        removeTodo,
        removeAllTodos,
        restoreTodo,
        deleteForever,
        clearAllRemoved,
        restoreAllRemoved,
        updateTodo,
        togglePriority,
    };
};
