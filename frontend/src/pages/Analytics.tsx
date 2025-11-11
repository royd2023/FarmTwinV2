const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Sustainability Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Water Efficiency</span>
                <span className="text-sm font-bold text-primary-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Energy Efficiency</span>
                <span className="text-sm font-bold text-primary-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sensors Online</span>
              <span className="text-sm font-bold text-green-600">4/4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Quality</span>
              <span className="text-sm font-bold text-green-600">Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-bold text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">No active alerts</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
