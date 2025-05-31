# 🤖 Aurbis Trading Bot - Professional Arbitrage System

A comprehensive cryptocurrency arbitrage trading bot with institutional-grade risk management and professional trading rules engine.

## 🚀 Features

### Trading Modes
- **🔄 24/7 Demo Trading** - Continuous simulation with virtual funds
- **⚡ LIVE Trading** - Real-time arbitrage scanning and execution
- **📊 Paper Trading** - Real market data with virtual money
- **🔴 Real Money Trading** - Live trading with actual funds (testnet/demo only)
- **🎯 Enhanced Trading** - Professional rules engine with 9-category validation

### Professional Features
- **Real-time Market Data** - Live price feeds from Binance, Bybit, and OKX
- **Advanced Risk Management** - 2%/4% risk/reward ratios, daily limits, position control
- **Trading Rules Engine** - 9-category professional validation system
- **Dynamic Stops** - Trailing stops and break-even logic
- **Comprehensive Analytics** - Success rates, approval rates, performance tracking

## 🔧 Setup

### 1. Environment Variables
Add these to your Vercel project:

\`\`\`
BINANCE_TESTNET_API_KEY=your_binance_testnet_key
BINANCE_TESTNET_SECRET_KEY=your_binance_testnet_secret
BYBIT_TESTNET_API_KEY=your_bybit_testnet_key
BYBIT_TESTNET_SECRET_KEY=your_bybit_testnet_secret
OKX_DEMO_API_KEY=your_okx_demo_key
OKX_DEMO_SECRET_KEY=your_okx_demo_secret
OKX_DEMO_PASSPHRASE=your_okx_demo_passphrase
NODE_ENV=production
NEXT_PUBLIC_VERCEL_URL=your_vercel_url
CUSTOM_KEY=your_custom_key
\`\`\`

### 2. Exchange Accounts
Create free testnet/demo accounts:
- **Binance Testnet**: [https://testnet.binance.vision](https://testnet.binance.vision)
- **Bybit Testnet**: [https://testnet.bybit.com](https://testnet.bybit.com)
- **OKX Demo**: [https://www.okx.com/demo](https://www.okx.com/demo)

### 3. Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📊 Trading Rules Engine

The Enhanced Trading System includes a comprehensive 9-category rules engine:

### 1. Entry Conditions
- Trend confirmation (minimum 2% trend)
- Breakout signal validation
- Indicator confluence (minimum 3 signals)

### 2. Risk/Reward Management
- 2% minimum risk requirement
- 4% minimum reward requirement
- 2:1 minimum risk/reward ratio

### 3. Volatility Control
- ATR-based volatility assessment
- Avoids ultra-low/high volatility zones
- Dynamic position sizing

### 4. Market Session Filtering
- High liquidity hours only (London/NY sessions)
- Minimum volume requirements
- Session overlap prioritization

### 5. News/Events Protection
- 30-minute buffer around major events
- High-impact news filtering
- Real-time event monitoring

### 6. Position Control
- One trade per asset maximum
- Maximum 3 concurrent positions
- 10% maximum asset exposure

### 7. Daily Risk Management
- 5% daily loss limit
- 20 trade daily limit
- 60-minute cooldown after losses

### 8. Slippage & Fees Adjustment
- Real-time cost calculation
- 0.3% minimum net profit after costs
- Dynamic fee adjustment

### 9. Dynamic Stops
- 1% trailing stop activation
- Break-even stops after 2% profit
- ROI enhancement features

## 🎯 Usage

### Dashboard
Visit `/` for the main dashboard with system status and quick access to all trading modes.

### Enhanced Trading
Visit `/enhanced-trading` for the professional trading system with:
- Real-time rule validation
- Professional opportunity analysis
- Institutional-grade risk management
- Advanced performance analytics

### Other Pages
- `/setup` - Configure API credentials
- `/diagnostics` - System health checks
- `/performance` - Trading performance metrics

## 🔒 Safety

- **100% Safe**: Uses only testnet/demo environments
- **No Real Money**: Virtual funds with no real-world value
- **Isolated Systems**: Completely separate from production trading
- **Professional Risk Management**: Institutional-grade safety features

## 📈 Performance

The system provides comprehensive analytics:
- Success rates and approval rates
- Rule compliance monitoring
- Real-time profit/loss tracking
- Risk exposure analysis
- Daily performance metrics

## 🚨 Emergency Features

- **Emergency Stop**: Immediate halt of all trading
- **Real-time Monitoring**: Continuous system health checks
- **Automatic Safeguards**: Built-in protection mechanisms
- **Professional Alerts**: Comprehensive notification system

## 🛠️ Technical Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Deployment platform
- **Professional APIs** - Exchange integrations

## 📞 Support

For issues or questions:
1. Check the diagnostics page
2. Review the system logs
3. Verify environment variables
4. Contact support through Vercel

---

**Aurbis Trading Bot - Professional Cryptocurrency Arbitrage with Institutional-Grade Risk Management** 🤖
