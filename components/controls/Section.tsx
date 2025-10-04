/**
 * @file Section.tsx
 * A simple layout component to create a titled section with a bottom border.
 */
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isDark?: boolean;
}

/**
 * @description A simple layout component that wraps its children in a titled section with consistent styling, including a bottom border on the title.
 * @param {SectionProps} props The props for the component.
 * @param {string} props.title The title to be displayed for the section.
 * @param {React.ReactNode} props.children The content to be rendered within the section.
 * @param {boolean} [props.isDark=false] Whether dark mode is enabled.
 * @returns {React.ReactElement} The rendered section component.
 */
const Section: React.FC<SectionProps> = ({ title, children, isDark = false }) => (
    <div className="space-y-4">
        <h3 className={`text-lg font-semibold border-b pb-2 ${
          isDark ? 'text-cyan-400 border-gray-700' : 'text-gray-600 border-gray-200'
        }`}>{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

export default Section;
