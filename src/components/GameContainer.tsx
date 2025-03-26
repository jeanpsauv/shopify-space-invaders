import React, { useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Game } from '../game/Game';
import { BlockStack, Text, Card } from '@shopify/polaris';

interface GameContainerProps {
  isPlaying: boolean;
}

const GameContainer: React.FC<GameContainerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstanceRef = useRef<Game | null>(null);
  const { 
    setScore, 
    setHighScore, 
    setLives, 
    setGameOver, 
    gameOver, 
    productImage,
    superPowerActive 
  } = useGameContext();

  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to fit the container better
    canvas.width = 600; // Reduced from 800 to fix blank space
    canvas.height = 500; // Reduced from 600 to maintain aspect ratio

    // Initialize game
    gameInstanceRef.current = new Game(canvas, {
      onScoreUpdate: setScore,
      onHighScoreUpdate: setHighScore,
      onLivesUpdate: setLives,
      onGameOver: () => setGameOver(true),
      productImageUrl: productImage,
    });

    // Start game loop
    gameInstanceRef.current.start();

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.handleKeyDown(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.handleKeyUp(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.stop();
      }
    };
  }, [isPlaying, setScore, setHighScore, setLives, setGameOver, productImage]);

  // Effect to handle superpower activation
  useEffect(() => {
    if (gameInstanceRef.current && isPlaying) {
      gameInstanceRef.current.setSuperPowerActive(superPowerActive);
    }
  }, [superPowerActive, isPlaying]);

  return (
    <Card>
      <BlockStack gap="400" alignment="center">
        {!isPlaying && (
          <Text as="p" variant="bodyLg" alignment="center">
            Press "Start Game" to begin!
          </Text>
        )}
        {gameOver && isPlaying && (
          <Text as="p" variant="headingLg" alignment="center" tone="critical">
            Game Over! Press "Restart Game" to play again.
          </Text>
        )}
        <div style={{ display: isPlaying ? 'block' : 'none', textAlign: 'center' }}>
          <canvas 
            ref={canvasRef} 
            style={{ 
              border: '1px solid #ccc', 
              maxWidth: '100%',
              backgroundColor: '#f4f6f8',
              display: 'inline-block' // Center the canvas
            }}
          />
        </div>
      </BlockStack>
    </Card>
  );
};

export default GameContainer;
