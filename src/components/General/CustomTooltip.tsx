interface TooltipProps {
  content: string;
  position: { x: number; y: number };
}

export const CustomTooltip = ({ content, position }: TooltipProps) => {
  return (
    <div
      className="px-2 py-1 bg-[#00000070] text-white text-sm font-normal fixed z-[1000] rounded-lg"
      style={{
        left: position.x + 20,
        top: position.y - 5,
        pointerEvents: 'none',
      }}
    >
      {content}
    </div>
  );
};


