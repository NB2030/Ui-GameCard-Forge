/**
 * @file TabButton.tsx
 * A button component used for the tab navigation in the control panel.
 */
import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isDark?: boolean;
}

/**
 * @description A button component designed for tab-style navigation, featuring distinct visual states for active and inactive tabs. This version uses a solid-filled style for the active tab.
 * @param {TabButtonProps} props The props for the component.
 * @param {boolean} props.active Indicates whether the tab is currently active, which determines its styling.
 * @param {() => void} props.onClick The callback function to be executed when the button is clicked.
 * @param {React.ReactNode} props.children The content to be rendered inside the button, typically the tab's title.
 * @param {boolean} [props.isDark=false] Whether dark mode is enabled.
 * @returns {React.ReactElement} The rendered tab button element.
 */
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, isDark = false }) => {
    // UPDATED: New classes for a solid, filled button style per user request.
    const activeClasses = isDark
      ? 'bg-cyan-500 text-white'
      : 'bg-[#06B6D4] text-white shadow';

    const inactiveClasses = isDark
      ? 'bg-transparent text-gray-400 hover:bg-[#334155] hover:text-cyan-400'
      : 'bg-transparent text-gray-500 hover:bg-gray-200 hover:text-cyan-600';

    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap rounded-md py-2 px-3 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                isDark ? 'focus:ring-offset-[#1a232e]' : 'focus:ring-offset-[#F9FAFB]'
            } ${active ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};

export default TabButton;