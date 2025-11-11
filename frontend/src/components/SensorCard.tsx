interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon?: string;
  status?: 'normal' | 'warning' | 'critical';
}

const SensorCard = ({ title, value, unit, icon, status = 'normal' }: SensorCardProps) => {
  const statusColors = {
    normal: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <div className={`card border-2 ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold">
            {value.toFixed(1)} <span className="text-lg">{unit}</span>
          </p>
        </div>
        {icon && <div className="text-4xl">{icon}</div>}
      </div>
    </div>
  );
};

export default SensorCard;
