import { SensorData } from '@/hooks/useSensorData';

interface HUDPanelProps {
  sensorData: SensorData;
  isConnected: boolean;
  lastUpdate: Date;
}

export const HUDPanel = ({ sensorData, isConnected, lastUpdate }: HUDPanelProps) => {
  const formatValue = (value: number | undefined, unit: string = '', decimals: number = 2) => {
    if (value === undefined || value === null || isNaN(value)) {
      return `--${unit}`;
    }
    return `${value.toFixed(decimals)}${unit}`;
  };

  const SensorGroup = ({ 
    title, 
    values, 
    unit = '', 
    color = 'text-neon-cyan' 
  }: { 
    title: string; 
    values: { label: string; value: number | undefined }[]; 
    unit?: string;
    color?: string;
  }) => (
    <div className="hud-panel mb-4">
      <h3 className={`text-sm font-bold mb-2 ${color} neon-text`}>
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {values.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="text-lg font-mono font-bold text-foreground">
              {formatValue(value, unit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="hud-panel flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 neon-glow' : 'bg-red-500'
            } animate-pulse-glow`}
          />
          <span className="text-sm font-mono">
            {isConnected ? 'CONECTADO' : 'SIN CONEXIÓN CON EL SENSOR'}
          </span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Error message when disconnected */}
      {!isConnected && (
        <div className="hud-panel bg-red-900/20 border-red-500/30">
          <div className="text-center py-4">
            <div className="text-red-400 font-mono text-sm mb-2">⚠️ ERROR DE CONEXIÓN</div>
            <div className="text-xs text-red-300 font-mono">
              Verifica que tu servidor Flask esté ejecutándose en:<br/>
              <span className="text-neon-cyan">http://localhost:5000/data</span>
            </div>
          </div>
        </div>
      )}

      {/* Accelerometer Data */}
      <SensorGroup
        title="ACELERÓMETRO"
        values={[
          { label: 'X', value: sensorData.accel_x },
          { label: 'Y', value: sensorData.accel_y },
          { label: 'Z', value: sensorData.accel_z }
        ]}
        unit=" m/s²"
        color="text-neon-cyan"
      />

      {/* Gyroscope Data */}
      <SensorGroup
        title="GIROSCOPIO"
        values={[
          { label: 'X', value: sensorData.gyro_x },
          { label: 'Y', value: sensorData.gyro_y },
          { label: 'Z', value: sensorData.gyro_z }
        ]}
        unit="°/s"
        color="text-neon-blue"
      />

      {/* Magnetometer Data */}
      <SensorGroup
        title="MAGNETÓMETRO"
        values={[
          { label: 'X', value: sensorData.mag_x },
          { label: 'Y', value: sensorData.mag_y },
          { label: 'Z', value: sensorData.mag_z }
        ]}
        unit=" μT"
        color="text-neon-purple"
      />

      {/* Data visualization bars */}
      <div className="hud-panel">
        <h3 className="text-sm font-bold mb-3 text-neon-cyan neon-text">
          VISUALIZACIÓN
        </h3>
        <div className="space-y-2">
          {[
            { label: 'ACC-X', value: sensorData.accel_x, max: 10, color: 'bg-neon-cyan' },
            { label: 'ACC-Y', value: sensorData.accel_y, max: 10, color: 'bg-neon-cyan' },
            { label: 'GYR-Z', value: sensorData.gyro_z, max: 180, color: 'bg-neon-blue' }
          ].map(({ label, value, max, color }) => (
            <div key={label} className="flex items-center space-x-2">
              <span className="text-xs font-mono w-12 text-muted-foreground">
                {label}
              </span>
              <div className="flex-1 h-2 bg-dark-surface rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-300`}
                  style={{
                    width: `${value !== undefined && !isNaN(value) ? Math.min(Math.abs(value) / max * 100, 100) : 0}%`,
                    opacity: 0.8
                  }}
                />
              </div>
              <span className="text-xs font-mono w-16 text-right">
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};