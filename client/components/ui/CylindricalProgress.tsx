interface CylindricalProgressProps {
  value: number; // 0 - 100
}

export default function CylindricalProgress({
  value,
}: CylindricalProgressProps) {
  return (
    <div className="w-full px-1">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <div className="mt-1 text-xs text-gray-500 text-right">
        {Math.round(value)}%
      </div>
    </div>
  );
}
