import React, { useState } from 'react';
import { AppProvider, Page, Grid } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import GameContainer from './components/GameContainer';
import GameStats from './components/GameStats';
import GameInstructions from './components/GameInstructions';
import WebhookLog from './components/WebhookLog';
import { GameProvider } from './context/GameContext';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AppProvider i18n={enTranslations}>
      <GameProvider>
        <Page
          title="Product Defenders"
          subtitle="Defend your store against abandoned carts!"
          fullWidth
        >
          <Grid>
            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 8, lg: 8, xl: 8}}>
              <GameInstructions isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
              <GameStats />
              <GameContainer isPlaying={isPlaying} />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 4, lg: 4, xl: 4}}>
              <WebhookLog />
            </Grid.Cell>
          </Grid>
        </Page>
      </GameProvider>
    </AppProvider>
  );
}

export default App;
