const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Sensor Thresholds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature Range (°C)
            </label>
            <div className="flex space-x-2">
              <input type="number" placeholder="Min" className="flex-1 px-3 py-2 border rounded-lg" defaultValue="15" />
              <input type="number" placeholder="Max" className="flex-1 px-3 py-2 border rounded-lg" defaultValue="30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Humidity Range (%)
            </label>
            <div className="flex space-x-2">
              <input type="number" placeholder="Min" className="flex-1 px-3 py-2 border rounded-lg" defaultValue="40" />
              <input type="number" placeholder="Max" className="flex-1 px-3 py-2 border rounded-lg" defaultValue="80" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Email alerts for critical conditions</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Push notifications</span>
          </label>
        </div>
      </div>

      <button className="btn-primary">Save Settings</button>
    </div>
  );
};

export default Settings;
