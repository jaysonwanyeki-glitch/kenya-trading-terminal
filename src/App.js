import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming an App.css for basic styling

// --- Mock Market Data Functions (for frontend display without backend) ---
const MOCK_PRICES_FRONTEND = {
  "SCOM": { "name": "Safaricom", "price": 40.00, "volatility": 0.5 },
  "KCB": { "name": "KCB Group", "price": 35.50, "volatility": 0.4 },
  "EQTY": { "name": "Equity Group", "price": 45.75, "volatility": 0.6 },
  "EABL": { "name": "East African Breweries", "price": 180.20, "volatility": 1.2 },
};

const generatePriceChange = (currentPrice, volatility) => {
  const changePercent = (Math.random() * 2 - 1) * volatility / 100;
  const newPrice = currentPrice * (1 + changePercent);
  return parseFloat(Math.max(0.01, newPrice).toFixed(4));
};

let currentFrontendPrices = { ...MOCK_PRICES_FRONTEND };

const getMockMarketDataFrontend = () => {
  const data = {};
  for (const symbol in currentFrontendPrices) {
    if (Object.hasOwnProperty.call(currentFrontendPrices, symbol)) {
      const details = currentFrontendPrices[symbol];
      const newPrice = generatePriceChange(details.price, details.volatility);
      const change = parseFloat((newPrice - details.price).toFixed(4));
      
      currentFrontendPrices[symbol] = { ...details, price: newPrice }; // Update for next iteration

      data[symbol] = {
        name: details.name,
        price: newPrice,
        change: change,
      };
    }
  }
  return data;
};

// --- Mock Market Hours Functions (for frontend display without backend) ---
const NAIROBI_TIMEZONE_OFFSET = 3 * 60; // UTC+3 in minutes

const getMarketStatusFrontend = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC milliseconds
  const nairobiTime = new Date(utc + (NAIROBI_TIMEZONE_OFFSET * 60000));

  const hours = nairobiTime.getHours();
  const minutes = nairobiTime.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;

  const NSE_OPEN_MINUTES = 9 * 60;
  const NSE_CLOSE_MINUTES = 15 * 60;
  const PEAK_HOURS_START_MINUTES = 9 * 60;
  const PEAK_HOURS_END_MINUTES = 11 * 60;
  const LOW_HOURS_START_MINUTES = 13 * 60;
  const LOW_HOURS_END_MINUTES = 14 * 60;

  let status = "Market Closed";
  let message = "Pre-market or After-hours trading.";
  let statusClass = "market-closed";

  if (currentTimeInMinutes >= NSE_OPEN_MINUTES && currentTimeInMinutes < NSE_CLOSE_MINUTES) {
    status = "Market Open";
    message = "Active trading session.";
    statusClass = "market-open";

    if (currentTimeInMinutes >= PEAK_HOURS_START_MINUTES && currentTimeInMinutes < PEAK_HOURS_END_MINUTES) {
      status = "HIGH VOLATILITY / CROSSING WINDOW";
      message = "Morning institutional order matching in progress.";
      statusClass = "market-peak";
    } else if (currentTimeInMinutes >= LOW_HOURS_START_MINUTES && currentTimeInMinutes < LOW_HOURS_END_MINUTES) {
      status = "LUNCH LIQUIDITY DIP";
      message = "Typical mid-day volume slowdown.";
      statusClass = "market-low";
    }
  }

  return {
    status,
    message,
    statusClass,
    currentTime: nairobiTime.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Nairobi' }) + " EAT",
  };
};

// --- Ticker Tape Component ---
const TickerTape = ({ stockData }) => {
  if (!stockData || Object.keys(stockData).length === 0) {
    return <div className="ticker-tape">Loading ticker data...</div>;
  }

  return (
    <div className="ticker-tape-container">
      <div className="ticker-tape">
        {Object.entries(stockData).map(([symbol, data], index) => (
          <span key={symbol} className={`ticker-item ${data.change > 0 ? 'up' : data.change < 0 ? 'down' : ''}`}>
            {symbol}: {data.price.toFixed(2)} ({data.change > 0 ? '+' : ''}{data.change.toFixed(2)})
          </span>
        ))}
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  const [marketData, setMarketData] = useState({});
  const [marketStatus, setMarketStatus] = useState({});

  useEffect(() => {
    // Update market data and status every second
    const interval = setInterval(() => {
      setMarketData(getMockMarketDataFrontend());
      setMarketStatus(getMarketStatusFrontend());
    }, 1000);

    // Initial load
    setMarketData(getMockMarketDataFrontend());
    setMarketStatus(getMarketStatusFrontend());

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <TickerTape stockData={marketData} />
        <div className={`market-status ${marketStatus.statusClass}`}>
          <h2>{marketStatus.status}</h2>
          <p>{marketStatus.currentTime} - {marketStatus.message}</p>
        </div>
      </header>

      <main className="dashboard-grid">
        <div className="grid-panel panel-1">Stocks NSE</div>
        <div className="grid-panel panel-2">Forex</div>
        <div className="grid-panel panel-3">Futures & Commodities</div>
        <div className="grid-panel panel-4">Chart View</div>
        <div className="grid-panel panel-5">News Feed</div>
        <div className="grid-panel panel-6">Watchlist</div>
      </main>
    </div>
  );
}

export default App;
