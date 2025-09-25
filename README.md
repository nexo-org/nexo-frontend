# Nexo - Crypto-Native Credit Protocol

> **Bringing traditional credit card functionality to Web3 with NFC tap-to-pay capabilities**

Nexo is a decentralized crypto credit protocol that transforms how users access credit in the Web3 ecosystem. By staking crypto assets like USDC as collateral, users can open secured credit lines and make real-world payments through NFC-enabled devices, bridging the gap between DeFi and everyday transactions.

## 🌟 Key Features

### 🏦 Decentralized Credit System
- **Collateral-Backed Lending**: Stake USDC to open secured credit lines
- **Dynamic Credit Limits**: Build reputation through responsible repayment behavior
- **Unsecured Credit Evolution**: Graduate from secured to unsecured credit over time
- **30-Day Grace Period**: Flexible repayment terms with built-in grace periods

### 💳 Real-World Payment Integration
- **NFC Tap-to-Pay**: Use Halo Chip technology for contactless payments
- **Dual Payment Methods**: Pay via crypto wallet or NFC-enabled devices
- **Instant Transactions**: Real-time payment processing with crypto backing
- **Universal Acceptance**: Works anywhere NFC payments are accepted

### 📈 Reputation-Based Scoring
- **Credit Score Evolution**: Build on-chain reputation through payment history
- **Automated Limit Increases**: Smart contracts automatically adjust credit limits
- **Transparent Scoring**: Fully auditable and decentralized credit scoring
- **Cross-Protocol Compatibility**: Reputation travels with your wallet

### 🌊 Liquidity Pool Economics
- **Lender Incentives**: Earn interest by providing liquidity to the protocol
- **Automated Yield Distribution**: Smart contract-managed interest payments
- **Risk Management**: Collateralized loans minimize lender risk
- **Decentralized Banking**: No traditional bank intermediaries

## 🏗️ Architecture

### Smart Contract Infrastructure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Credit Manager │    │  Lending Pool   │    │ Reputation Mgr  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Credit Lines  │    │ • Liquidity     │    │ • Score Tracking│
│ • Borrow Logic  │    │ • Interest Mgmt │    │ • Limit Updates │
│ • Repayments    │    │ • Yield Distrib │    │ • History Log   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
              ┌─────────────────────────────────┐
              │      Collateral Vault           │
              ├─────────────────────────────────┤
              │ • USDC Staking                  │
              │ • Collateral Management         │
              │ • Liquidation Protection        │
              └─────────────────────────────────┘
```

### Technology Stack
- **Blockchain**: Aptos/Move for high-performance smart contracts
- **Cross-Chain**: LayerZero/Stargate for multi-chain collateral support
- **Frontend**: React + Privy for seamless Web3 onboarding
- **Hardware**: NFC Halo Chip integration for tap-to-pay
- **Mobile**: Mobile-first design for everyday usability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Aptos CLI for smart contract deployment
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/nexo-org/nexo-frontend/
cd nexo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Compile smart contracts
cd move_contracts
aptos move compile

# Deploy contracts (testnet)
aptos move publish --named-addresses nexo_protocol=0x... --private-key ...

# Start development server
npm run dev
```

## 💡 Use Cases

### For Borrowers
- **E-commerce**: Pay for online purchases using crypto credit
- **Physical Retail**: Tap-to-pay at any NFC-enabled terminal
- **Bill Payments**: Use credit for recurring payments and subscriptions
- **Emergency Funds**: Access liquidity without selling crypto holdings

### For Lenders
- **Yield Generation**: Earn interest on idle USDC holdings
- **Risk Management**: Benefit from overcollateralized loan structure
- **Passive Income**: Automated interest distribution
- **DeFi Integration**: Composable yield strategies




**Built with ❤️ by the Nexo team**

*Transforming the future of credit, one tap at a time.*
