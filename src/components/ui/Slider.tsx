
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider: React.FC<SliderProps> = ({ className, ...props }) => {
    return (
        <input
            type="range"
            className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${className}`}
            {...props}
        />
    );
};
