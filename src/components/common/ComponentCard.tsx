import React from 'react';

interface ComponentCardProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling

}

const ComponentCard: React.FC<ComponentCardProps> = ({
  content,
  children,
  className = '',
 
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className=" px-4 py-2 gap-4">
       {content}
      </div>

      {/* Card Body */}
      <div className="border-t border-gray-100 p-4 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
