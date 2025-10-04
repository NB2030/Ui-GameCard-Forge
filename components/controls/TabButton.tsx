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
 * @description A button component designed for tab-style navigation, featuring distinct visual states for active and inactive tabs.
 * @param {TabButtonProps} props The props for the component.
 * @param {boolean} props.active Indicates whether the tab is currently active, which determines its styling.
 * @param {() => void} props.onClick The callback function to be executed when the button is clicked.
 * @param {React.ReactNode} props.children The content to be rendered inside the button, typically the tab's title.
 * @param {boolean} [props.isDark=false] Whether dark mode is enabled.
 * @returns {React.ReactElement} The rendered tab button element.
 */
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, isDark = false }) => {
    const activeClasses = isDark
      ? 'border-cyan-400 text-cyan-400'
      : 'border-indigo-500 text-indigo-600';
    const inactiveClasses = isDark
      ? 'border-transparent text-gray-400 hover:text-cyan-400 hover:border-[#334155]'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${active ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};

export default TabButton;
