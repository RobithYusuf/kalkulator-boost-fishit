
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
    return (
        <h2 className={`text-xl font-bold text-gray-100 ${className}`}>
            {children}
        </h2>
    );
};


interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
      return (
          <p className={`text-sm text-gray-400 ${className}`}>
              {children}
          </p>
      );
  };

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};
