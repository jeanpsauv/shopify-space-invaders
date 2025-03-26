import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface WebhookEvent {
  id: string;
  timestamp: string;
  orderId: string;
  customerName: string;
  total: string;
}

interface GameContextType {
  score: number;
  setScore: (score: number) => void;
  highScore: number;
  setHighScore: (score: number) => void;
  level: number;
  setLevel: (level: number) => void;
  lives: number;
  setLives: (lives: number) => void;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
  productImage: string;
  setProductImage: (url: string) => void;
  superPowerActive: boolean;
  setSuperPowerActive: (active: boolean) => void;
  triggerSuperPower: () => void;
  webhookEvents: WebhookEvent[];
  addWebhookEvent: (event: WebhookEvent) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [productImage, setProductImage] = useState('https://cdn.shopify.com/s/files/1/0757/9955/files/snowboard-product.png');
  const [superPowerActive, setSuperPowerActive] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);

  const triggerSuperPower = () => {
    setSuperPowerActive(true);
    
    // Generate a random order for the webhook log
    const newEvent: WebhookEvent = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: new Date().toISOString(),
      orderId: `#${Math.floor(Math.random() * 10000)}`,
      customerName: getRandomCustomerName(),
      total: `$${(Math.random() * 200 + 50).toFixed(2)}`
    };
    
    addWebhookEvent(newEvent);
    
    // Automatically deactivate after 5 seconds
    setTimeout(() => {
      setSuperPowerActive(false);
    }, 5000);
  };

  const addWebhookEvent = (event: WebhookEvent) => {
    setWebhookEvents(prev => [event, ...prev].slice(0, 10)); // Keep only the 10 most recent events
  };

  // Helper function to generate random customer names
  const getRandomCustomerName = () => {
    const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Taylor'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  };

  return (
    <GameContext.Provider
      value={{
        score,
        setScore,
        highScore,
        setHighScore,
        level,
        setLevel,
        lives,
        setLives,
        gameOver,
        setGameOver,
        productImage,
        setProductImage,
        superPowerActive,
        setSuperPowerActive,
        triggerSuperPower,
        webhookEvents,
        addWebhookEvent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
