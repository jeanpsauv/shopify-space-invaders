import React from 'react';
import { InlineStack, Text, Badge, BlockStack, Card } from '@shopify/polaris';
import { useGameContext } from '../context/GameContext';

const GameStats: React.FC = () => {
  const { score, highScore, level, lives } = useGameContext();

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack gap="500" align="center" blockAlign="center" wrap={true}>
          <Text as="p" variant="headingMd">
            Score: {score}
          </Text>
          <Text as="p" variant="headingMd">
            High Score: {highScore}
          </Text>
          <Text as="p" variant="headingMd">
            Level: {level}
          </Text>
          <InlineStack gap="100">
            <Text as="p" variant="headingMd">
              Lives:
            </Text>
            {Array.from({ length: lives }).map((_, index) => (
              <Badge key={index} tone="success">♥</Badge>
            ))}
          </InlineStack>
        </InlineStack>
        
        <InlineStack gap="400" align="center" blockAlign="center" wrap={true}>
          <Badge tone="warning">Bounce Rate: 10pts</Badge>
          <Badge tone="success">Abandoned Cart: 20pts</Badge>
          <Badge tone="info">Low Performance: 30pts</Badge>
          <Badge tone="critical">Lost Customer: 40pts</Badge>
        </InlineStack>
      </BlockStack>
    </Card>
  );
};

export default GameStats;
