import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CandleData } from '@/types/stock';

interface CandlestickChartProps {
  data: CandleData[];
  width?: number;
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 800,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: CandleData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: Math.max(300, containerWidth * 0.45),
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 60, bottom: 30, left: 60 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.3);

    const yExtent = d3.extent(data.flatMap((d) => [d.low, d.high])) as [number, number];
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;
    
    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([innerHeight, 0]);

    // Grid lines
    const gridLines = g.append('g').attr('class', 'grid');
    
    gridLines
      .selectAll('.grid-line-h')
      .data(yScale.ticks(6))
      .join('line')
      .attr('class', 'grid-line-h')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', 'hsl(var(--chart-grid))')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Y-axis
    const yAxis = d3.axisRight(yScale).ticks(6).tickFormat(d3.format('$.2f'));
    
    g.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${innerWidth}, 0)`)
      .call(yAxis)
      .selectAll('text')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, monospace');

    g.select('.y-axis').selectAll('.domain').remove();
    g.select('.y-axis').selectAll('.tick line').attr('stroke', 'hsl(var(--chart-grid))');

    // X-axis (dates)
    const xAxisDates = data.filter((_, i) => i % Math.ceil(data.length / 6) === 0);
    
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .selectAll('text')
      .data(xAxisDates)
      .join('text')
      .attr('x', (d, i) => {
        const idx = data.findIndex((item) => item.date === d.date);
        return (xScale(idx.toString()) || 0) + xScale.bandwidth() / 2;
      })
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '10px')
      .text((d) => d3.timeFormat('%b %d')(d.date));

    // Candlesticks
    const candleGroup = g.append('g').attr('class', 'candles');

    // Wicks
    candleGroup
      .selectAll('.wick')
      .data(data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('x2', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y1', (d) => yScale(d.high))
      .attr('y2', (d) => yScale(d.low))
      .attr('stroke', (d) =>
        d.close >= d.open ? 'hsl(var(--chart-candle-up))' : 'hsl(var(--chart-candle-down))'
      )
      .attr('stroke-width', 1);

    // Bodies
    candleGroup
      .selectAll('.candle')
      .data(data)
      .join('rect')
      .attr('class', 'candle')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', (d) => yScale(Math.max(d.open, d.close)))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => Math.max(1, Math.abs(yScale(d.open) - yScale(d.close))))
      .attr('fill', (d) =>
        d.close >= d.open ? 'hsl(var(--chart-candle-up))' : 'hsl(var(--chart-candle-down))'
      )
      .attr('rx', 1)
      .style('cursor', 'crosshair')
      .on('mouseenter', (event, d) => {
        const rect = event.target.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setTooltip({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 10,
            data: d,
          });
        }
      })
      .on('mouseleave', () => {
        setTooltip({ visible: false, x: 0, y: 0, data: null });
      });

    // Volume bars
    const volumeHeight = innerHeight * 0.15;
    const volumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.volume) || 0])
      .range([0, volumeHeight]);

    g.append('g')
      .attr('class', 'volume')
      .selectAll('.volume-bar')
      .data(data)
      .join('rect')
      .attr('class', 'volume-bar')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', (d) => innerHeight - volumeScale(d.volume))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => volumeScale(d.volume))
      .attr('fill', (d) =>
        d.close >= d.open
          ? 'hsl(var(--chart-candle-up) / 0.3)'
          : 'hsl(var(--chart-candle-down) / 0.3)'
      );

  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-chart-bg rounded-lg"
      />
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute z-50 bg-card border border-border rounded-lg p-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-mono text-xs space-y-1">
            <div className="text-muted-foreground">
              {d3.timeFormat('%B %d, %Y')(tooltip.data.date)}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">Open:</span>
              <span className="text-foreground">${tooltip.data.open.toFixed(2)}</span>
              <span className="text-muted-foreground">High:</span>
              <span className="text-gain">${tooltip.data.high.toFixed(2)}</span>
              <span className="text-muted-foreground">Low:</span>
              <span className="text-loss">${tooltip.data.low.toFixed(2)}</span>
              <span className="text-muted-foreground">Close:</span>
              <span
                className={
                  tooltip.data.close >= tooltip.data.open ? 'text-gain' : 'text-loss'
                }
              >
                ${tooltip.data.close.toFixed(2)}
              </span>
              <span className="text-muted-foreground">Volume:</span>
              <span className="text-foreground">
                {(tooltip.data.volume / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
