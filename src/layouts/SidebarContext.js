import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext({
    isCollapsed: false,
    toggleSidebar: () => {},
    setIsCollapsed: () => {}
});

export const SidebarProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        try {
            const saved = localStorage.getItem('sidebar_collapsed');
            if (saved !== null) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error reading sidebar_collapsed from localStorage', e);
        }
        return false;
    });

    const toggleSidebar = () => {
        setIsCollapsed(prev => {
            const next = !prev;
            try {
                localStorage.setItem('sidebar_collapsed', JSON.stringify(next));
            } catch (e) {
                console.error('Error writing sidebar_collapsed to localStorage', e);
            }
            return next;
        });
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setIsCollapsed }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        return { isCollapsed: false, toggleSidebar: () => {}, setIsCollapsed: () => {} };
    }
    return context;
};
