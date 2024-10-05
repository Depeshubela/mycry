import React from 'react';

const ProgressBar = ({ numerator, denominator }) => {
  const progress = (numerator / denominator) * 100;

  return (
    <div className='p-1 border-2 border-black rounded-full' style={{backgroundColor:'#FFE9D0'}}>
        <div className="relative w-full bg-white rounded-full h-4 border-2 border-black box-border">
            <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor:'#AD00FF' }}
            ></div>
            <span className="absolute inset-0 flex justify-center items-center text-black text-sm">
                {Math.round(progress)}%
            </span>
        </div>
    </div>
  );
};

export default ProgressBar;
