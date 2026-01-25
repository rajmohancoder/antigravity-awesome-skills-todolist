import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top + window.scrollY, // Add scroll Y to keep persistent with page
                left: rect.left + rect.width / 2 + window.scrollX, // Center horizontally
            });
        }
    }, [isVisible]);

    const tooltipContent = (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate(${position.left}px, ${position.top}px) translate(-50%, ${isVisible ? '-100%' : 'calc(-100% + 10px)'}) translateY(-8px)`,
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                color: '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: 9999,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                visibility: isVisible ? 'visible' : 'hidden',
            }}
        >
            {content}
            <div
                style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderWidth: '4px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(15, 23, 42, 0.95) transparent transparent transparent',
                }}
            />
        </div>
    );

    return (
        <>
            <div
                ref={triggerRef}
                style={{ position: 'relative', display: 'inline-flex' }}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {createPortal(tooltipContent, document.body)}
        </>
    );
};
