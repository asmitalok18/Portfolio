import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PortfolioDataProvider } from './contexts/PortfolioDataContext';
import Projects from './components/Projects';

global.fetch = jest.fn();

describe('Portfolio Application Frontend Deduplication', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        projects: [{ id: 1, name: 'Test Project' }]
      })
    });
  });

  test('PortfolioDataProvider fetches data once and avoids double fetch in strict mode', async () => {
    render(
      <React.StrictMode>
        <PortfolioDataProvider>
          <Projects />
        </PortfolioDataProvider>
      </React.StrictMode>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    // Project modal fetch on detail click
    // Note: since this is just a context test, we verify it only called fetch once.
  });
});
