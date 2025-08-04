export const ProjectHeader = () => {
  return (
    <div className="text-center py-6">
      <div className="relative">
        {/* Main title with glow effect */}
        <h1 className="text-4xl md:text-6xl font-bold mb-2 neon-text animate-pulse-glow">
          PROYECTO FINAL TD2
        </h1>
        
        {/* Subtitle with animation */}
        <div className="text-lg md:text-xl text-neon-blue mb-4 font-mono">
          <span className="inline-block animate-data-flow">SENSOR MPU-9250</span>
          <span className="mx-2 text-neon-cyan">|</span>
          <span className="inline-block animate-data-flow" style={{ animationDelay: '0.5s' }}>
            VISUALIZACIÓN EN TIEMPO REAL
          </span>
        </div>
        
        {/* Authors */}
        <div className="text-base md:text-lg text-foreground/80 font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span className="text-neon-purple">Hernán Ariel Pérez</span>
            <span className="hidden sm:inline text-neon-blue">•</span>
            <span className="text-neon-purple">Franco Guarnieri</span>
            <span className="hidden sm:inline text-neon-blue">•</span>
            <span className="text-neon-purple">Mauricio Casals</span>
          </div>
        </div>
        
        {/* Tech indicators */}
        <div className="flex justify-center space-x-6 mt-4 text-sm text-muted-foreground font-mono">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <span>REACT</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span>THREE.JS</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <span>REAL-TIME</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />
      </div>
    </div>
  );
};