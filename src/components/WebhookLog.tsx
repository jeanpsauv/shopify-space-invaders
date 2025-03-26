import React from 'react';
import { Card, Text, BlockStack, InlineStack, Badge, Divider } from '@shopify/polaris';
import { useGameContext, WebhookEvent } from '../context/GameContext';

const WebhookLog: React.FC = () => {
  const { webhookEvents } = useGameContext();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text as="h2" variant="headingMd">
          Webhook Log: orders/create
        </Text>
        
        {webhookEvents.length === 0 ? (
          <Text as="p" variant="bodyMd" tone="subdued">
            No webhooks received yet. Click "Simulate Order Created" to generate a webhook event.
          </Text>
        ) : (
          <BlockStack gap="300">
            {webhookEvents.map((event, index) => (
              <React.Fragment key={event.id}>
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Badge tone="success">orders/create</Badge>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {formatTimestamp(event.timestamp)}
                    </Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {event.orderId}
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {event.customerName}
                    </Text>
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {event.total}
                    </Text>
                  </InlineStack>
                </BlockStack>
                {index < webhookEvents.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
};

export default WebhookLog;
