import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const PortfolioDataContext = createContext();

let portfolioDataCache = null;
let portfolioDataPromise = null;
let lastFetchedAt = null;

export async function getPortfolioData({ force = false } = {}) {
  if (force) {
    portfolioDataCache = null;
  }

  if (!force && portfolioDataCache) {
    return portfolioDataCache;
  }

  if (portfolioDataPromise) {
    return portfolioDataPromise;
  }

  portfolioDataPromise = fetch(`${BASE_URL}/api/portfolio-data/?v=2`)
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      portfolioDataCache = data;
      lastFetchedAt = Date.now();
      return data;
    })
    .catch((error) => {
      portfolioDataCache = null;
      throw error;
    })
    .finally(() => {
      portfolioDataPromise = null;
    });

  return portfolioDataPromise;
}

export const PortfolioDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPortfolioData({ force });
      setData(result);
    } catch (err) {
      setError(err.message === 'RATE_LIMIT_EXCEEDED' ? 'RATE_LIMIT_EXCEEDED' : err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    data,
    hero: data?.identity || data?.hero || null,
    profile: data?.profile || null,
    contact: data?.contact || null,
    socialLinks: data?.social_links || null,
    skills: data?.skills || [],
    experiences: data?.experiences || [],
    projects: data?.projects || [],
    resume: data?.resume || null,
    loading,
    error,
    lastFetchedAt,
    refetch: () => fetchData(true)
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
