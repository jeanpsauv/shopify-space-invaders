import React, { useState } from 'react';
import { BlockStack, InlineStack, Button, Text, TextField, Banner, Badge, Card } from '@shopify/polaris';
import { useGameContext } from '../context/GameContext';

interface GameInstructionsProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({ isPlaying, setIsPlaying }) => {
  const { 
    score, 
    setScore, 
    setHighScore, 
    setLevel, 
    setLives, 
    gameOver, 
    setGameOver, 
    setProductImage, 
    triggerSuperPower 
  } = useGameContext();
  
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageError, setImageError] = useState('');

  const handleStartGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
  };

  const handleImageChange = (value: string) => {
    setCustomImageUrl(value);
    setImageError('');
  };

  const handleImageSubmit = () => {
    if (!customImageUrl) {
      setImageError('Please enter an image URL');
      return;
    }

    // Test if image loads correctly
    const img = new Image();
    img.onload = () => {
      setProductImage(customImageUrl);
      setImageError('');
    };
    img.onerror = () => {
      setImageError('Unable to load image. Please check the URL and try again.');
    };
    img.src = customImageUrl;
  };

  const handleOrderCreated = () => {
    // Simulate a Shopify webhook order/created event
    triggerSuperPower();
  };

  return (
    <Card>
      <BlockStack gap="500">
        <InlineStack gap="300" align="center" blockAlign="center" wrap={true}>
          <Button
            variant="primary"
            onClick={handleStartGame}
          >
            {!isPlaying ? 'Start Game' : gameOver ? 'Restart Game' : 'Restart Game'}
          </Button>
          {isPlaying && !gameOver && (
            <Button
              onClick={() => setIsPlaying(false)}
            >
              Pause Game
            </Button>
          )}
          {isPlaying && !gameOver && (
            <Button
              variant="primary"
              tone="success"
              onClick={handleOrderCreated}
            >
              Simulate Order Created
            </Button>
          )}
        </InlineStack>
        
        {!isPlaying && (
          <BlockStack gap="500">
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                How to Play:
              </Text>
              <Text as="p" variant="bodyMd">
                • Use the left and right arrow keys to move your product defender
              </Text>
              <Text as="p" variant="bodyMd">
                • Press spacebar to shoot at the store metrics
              </Text>
              <Text as="p" variant="bodyMd">
                • Destroy all negative metrics before they reach the bottom
              </Text>
              <Text as="p" variant="bodyMd">
                • Different metrics are worth different points
              </Text>
              <Text as="p" variant="bodyMd">
                • Each level gets progressively harder
              </Text>
              <Text as="p" variant="bodyMd">
                • When an order is created, your product gets a superpower for 5 seconds!
              </Text>
            </BlockStack>
            
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Custom Product Image:
              </Text>
              <Text as="p" variant="bodyMd">
                Enter a URL to use a custom product image as your defender:
              </Text>
              <InlineStack gap="200" align="start">
                <div style={{ flexGrow: 1 }}>
                  <TextField
                    label="Product Image URL"
                    labelHidden
                    value={customImageUrl}
                    onChange={handleImageChange}
                    placeholder="https://example.com/product-image.jpg"
                    autoComplete="off"
                  />
                </div>
                <Button onClick={handleImageSubmit}>
                  Set Image
                </Button>
              </InlineStack>
              {imageError && (
                <Banner tone="critical">
                  {imageError}
                </Banner>
              )}
              <Text as="p" variant="bodySm" tone="subdued">
                Note: In a real Shopify app, this would automatically use your best-selling product image.
              </Text>
            </BlockStack>
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
};

export default GameInstructions;
