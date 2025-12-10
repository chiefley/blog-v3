import React, { useEffect, useRef, useState } from 'react';

// Import the Dawkins weasel classes (converted to proper ES modules)
class DWeasel {
    private dna: string;

    constructor (dna: string) {
        this.dna = dna.slice(0);
    }

    public init = (dna: string) => {
        this.dna = dna.slice(0);
    }

    public mutate = () => {
        const nrMutations = Math.floor(Math.random() * 4);
        const mutationType = Math.floor(Math.random() * 3);
        for (let i = 0; i < nrMutations; i++) {
            const randomPos = this.randomPosition();
            switch (mutationType) {
                case 0: this.addChar(randomPos); break;
                case 1: this.deleteChar(randomPos); break;
                case 2: this.replaceChar(randomPos); break;
            }
        }
    };

    public readDna = (): string => this.dna.slice(0);

    public static randomString = (): string => {
        return [ DWeasel.randomChar(), DWeasel.randomChar(), DWeasel.randomChar() ].join("");
    }

    private addChar = (randomPos: number) => {
        this.dna = (randomPos < this.dna.length)
            ? [this.dna.slice(0, randomPos), DWeasel.randomChar(), this.dna.slice(randomPos)].join('')
            : this.dna.concat(DWeasel.randomChar());
    };

    private deleteChar = (randomPos: number) => {
        this.dna = (randomPos < this.dna.length)
            ? this.dna.slice(0, randomPos) + this.dna.slice(randomPos + 1)
            : this.dna.slice(0, randomPos - 1);
    };

    private replaceChar = (randomPos: number) => {
        if (randomPos === this.dna.length)
            return;
        this.deleteChar(randomPos);
        this.addChar(randomPos);
    };

    private randomPosition = (): number => {
        return Math.floor(Math.random() * (this.dna.length + 1));
    };

    private static randomChar = (): string => {
        return String.fromCharCode(Math.floor(Math.random() * 94) + 32);
    };
}

class DWeaselWorld {
    private parentWeasel: DWeasel;
    private childWeasels: DWeasel[];

    constructor (private targetString: string, private startString: string) {
        this.parentWeasel = new DWeasel(startString);
        this.childWeasels = [];
    }

    public init = () => {
      this.childWeasels = [];
      for (let i = 0; i < 5000; i++)
        this.childWeasels[i] = new DWeasel(this.startString);
    };

    public bestDna = ():string =>  this.parentWeasel.readDna();

    public worldCycle = () => {
      let minFitness = this.unfitness(this.parentWeasel.readDna());
      let minFitnessIx = -1;
      for (let i = 0; i < this.childWeasels.length; i++) {
        this.childWeasels[i].mutate();
        const unfit = this.unfitness(this.childWeasels[i].readDna());
        if (unfit <= minFitness) {
          minFitness = unfit;
          minFitnessIx = i;
        }
      }

      if (minFitnessIx > -1) {
        this.parentWeasel = new DWeasel(this.childWeasels[minFitnessIx].readDna());
        for (let i = 0; i < this.childWeasels.length; i++)
          this.childWeasels[i] = new DWeasel(this.parentWeasel.readDna());
      }
    }

    private unfitness = (dna: string): number => {
        return this.getEditDistance(this.targetString, dna);
    };

    // Compute the edit distance between the two given strings
    private getEditDistance = (a: string, b: string) => {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;

      const matrix: number[][] = [];

      // increment along the first column of each row
      for (let i = 0; i <= b.length; i++){
        matrix[i] = [i];
      }

      // increment each column in the first row
      for(let j = 0; j <= a.length; j++){
        matrix[0][j] = j;
      }

      // Fill in the rest of the matrix
      for (let i = 1; i <= b.length; i++){
        for (let j = 1; j <= a.length; j++){
          if (b.charAt(i - 1) === a.charAt(j - 1)){
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j -1 ] + 1, // substitution
                                    Math.min(matrix[i][j - 1] + 1, // insertion
                                             matrix[i - 1 ][j] + 1)); // deletion
          }
        }
      }

      return matrix[b.length][a.length];
    };
}

interface DawkinsWeaselSimulationProps {
  targetString?: string;
  maxGenerations?: number;
  height?: number;
  showControls?: boolean;
}

const DawkinsWeaselSimulation: React.FC<DawkinsWeaselSimulationProps> = ({
  targetString: initialTargetString = "Methinks it is like a weasel.",
  maxGenerations = 1000,
  height = 300,
  showControls = true
}) => {
  const worldRef = useRef<DWeaselWorld | null>(null);
  const cycleTimerRef = useRef<number>(0);

  const [targetString, setTargetString] = useState<string>(initialTargetString);
  const [generations, setGenerations] = useState<number>(0);
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(2); // Speed multiplier (0.5x to 5x)

  // Initialize the world
  const initializeWorld = () => {
    if (!targetString.trim()) return;

    const startString = DWeasel.randomString();
    worldRef.current = new DWeaselWorld(targetString, startString);
    worldRef.current.init();

    setGenerations(0);
    setResults([]);
    setIsInitialized(true);

    // Add initial result with generation 0
    setResults([`${startString} (0)`]);
  };

  // World cycle
  const worldCycle = () => {
    if (!worldRef.current) return;

    setGenerations(prevGen => {
      const newGenerations = prevGen + 1;

      worldRef.current!.worldCycle();
      const bestDna = worldRef.current!.bestDna();

      // Add result to the beginning of the array, keep all results
      setResults(prevResults => [`${bestDna} (${newGenerations})`, ...prevResults]);

      // Check if we've reached the target or max generations
      if (bestDna === targetString || newGenerations >= maxGenerations) {
        // Use setTimeout to avoid calling stopSimulation during state update
        setTimeout(() => { stopSimulation(); }, 0);
      }

      return newGenerations;
    });
  };

  // Start simulation
  const startSimulation = () => {
    if (!isInitialized) return;

    setIsRunning(true);
    const interval = Math.max(50, Math.floor(500 / speed)); // 50ms minimum, up to 500ms
    cycleTimerRef.current = window.setInterval(worldCycle, interval);
  };

  // Stop simulation
  const stopSimulation = () => {
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
      cycleTimerRef.current = 0;
    }
    setIsRunning(false);
  };

  // Reset simulation
  const resetSimulation = () => {
    stopSimulation();
    initializeWorld();
  };

  // Handle speed change
  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);

    // If currently running, restart with new speed
    if (isRunning) {
      stopSimulation();
      const interval = Math.max(50, Math.floor(500 / newSpeed));
      cycleTimerRef.current = window.setInterval(worldCycle, interval);
      setIsRunning(true);
    }
  };

  // Handle target string change
  const handleTargetStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetString(event.target.value);
    setIsInitialized(false);
  };

  // Initialize on mount
  useEffect(() => {
    initializeWorld();

    // Cleanup on unmount
    return () => {
      stopSimulation();
    };
  }, []);

  // Auto-initialize when target string changes
  useEffect(() => {
    if (targetString.trim()) {
      initializeWorld();
    }
  }, [targetString]);

  return (
    <div className="dawkins-weasel-simulation">
      {/* Target String Input - conditionally rendered based on showControls */}
      {showControls && (
        <input
          type="text"
          placeholder="Target String"
          value={targetString}
          onChange={handleTargetStringChange}
          disabled={isRunning}
        />
      )}

      {/* Results History */}
      <div className="results-container" style={{ height: `${height}px` }}>
        {results.map((result, index) => (
          <div
            key={index}
            className={`result-item ${index === 0 ? 'current' : 'past'}`}
          >
            {result}
          </div>
        ))}
        {results.length === 0 && (
          <p className="empty-results">
            Results will appear here when the simulation runs...
          </p>
        )}
      </div>

      {/* Controls Row - conditionally rendered based on showControls */}
      {showControls && (
        <div className="controls">
          <button onClick={resetSimulation} disabled={isRunning}>
            Reset
          </button>
          <button onClick={startSimulation} disabled={isRunning || !isInitialized}>
            Run
          </button>
          <button onClick={stopSimulation} disabled={!isRunning} className="secondary">
            Stop
          </button>

          {/* Speed Control */}
          <div className="speed-control">
            <span className="speed-label">{speed}x</span>
            <input
              type="range"
              value={speed}
              onChange={handleSpeedChange}
              step={0.5}
              min={0.5}
              max={5}
            />
          </div>

          {/* Generation Counter */}
          <div className="generation-counter">
            <span>Gen:</span>
            <span className="generation-value">{generations}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DawkinsWeaselSimulation;
