import { Suspense } from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import { Scene3D } from '@/components/Scene3D';
import { HUDPanel } from '@/components/HUDPanel';
import { ProjectHeader } from '@/components/ProjectHeader';

// Loading component for 3D scene
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-neon-cyan font-mono">Cargando escena 3D...</p>
    </div>
  </div>
);

const Index = () => {
  const { data: sensorData, isConnected, lastUpdate } = useSensorData();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan rounded-full blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-neon-blue rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-purple rounded-full blur-3xl opacity-5 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 pt-4">
          <ProjectHeader />
        </header>

        {/* Main dashboard */}
        <main className="px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
              {/* 3D Visualization - Main area */}
              <div className="lg:col-span-3 glass-card p-4 rounded-lg relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <div className="glass-card px-3 py-1 rounded">
                    <span className="text-xs font-mono text-neon-cyan">
                      VISUALIZACIÓN 3D
                    </span>
                  </div>
                </div>
                
                {/* Show error overlay when disconnected */}
                {!isConnected && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚠️</div>
                      <h2 className="text-2xl font-bold text-red-400 mb-2 font-mono">
                        SIN CONEXIÓN CON EL SENSOR
                      </h2>
                      <p className="text-muted-foreground font-mono mb-4">
                        No se puede conectar a la API del sensor MPU-9250
                      </p>
                      <div className="glass-card p-4 rounded-lg max-w-md">
                        <p className="text-sm text-neon-cyan font-mono">
                          Verifica que tu servidor Flask esté ejecutándose en:
                        </p>
                        <p className="text-neon-blue font-mono font-bold mt-2">
                          http://localhost:5000/data
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Suspense fallback={<LoadingSpinner />}>
                  <Scene3D sensorData={sensorData} />
                </Suspense>

                {/* Corner indicators */}
                <div className="absolute bottom-4 right-4 flex space-x-2 text-xs font-mono text-muted-foreground">
                  <span>CTRL + Click: Rotar</span>
                  <span>|</span>
                  <span>Scroll: Zoom</span>
                </div>
              </div>

              {/* HUD Panel - Side area */}
              <div className="lg:col-span-1 space-y-4 overflow-y-auto">
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold font-mono text-neon-cyan">
                      DATOS EN VIVO
                    </span>
                  </div>
                  
                  <HUDPanel 
                    sensorData={sensorData}
                    isConnected={isConnected}
                    lastUpdate={lastUpdate}
                  />
                </div>

                {/* System info */}
                <div className="hud-panel text-xs font-mono text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>FRECUENCIA:</span>
                    <span className="text-neon-cyan">1.0 Hz</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>PROTOCOLO:</span>
                    <span className="text-neon-blue">HTTP/REST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FORMATO:</span>
                    <span className="text-neon-purple">JSON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-mono">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                <span>Técnicas Digitales 2 - Proyecto Final</span>
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span>MPU-9250 Sensor Simulation</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-neon-cyan animate-pulse"></div>
                  <div className="w-1 h-4 bg-neon-blue animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-4 bg-neon-purple animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
