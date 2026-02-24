import React from "react";

interface SparklineProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, positive, width = 120, height = 40 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive ? "hsl(160, 84%, 50%)" : "hsl(0, 72%, 55%)";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
