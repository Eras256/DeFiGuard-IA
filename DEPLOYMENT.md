# 🚀 Deployment Guide - DeFiGuard AI

Complete deployment instructions for NullShot Hacks submission.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Gemini API key working
- [ ] Thirdweb client ID obtained
- [ ] Testnet ETH available (Base Sepolia, Arbitrum Sepolia)
- [ ] GitHub repository created and pushed
- [ ] Demo video recorded (3-5 minutes)
- [ ] Project documentation complete

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

```bash
# Ensure all dependencies are installed
pnpm install

# Build project locally to test
pnpm build

# Test production build
pnpm start
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy to production
pnpm deploy
```

### Step 3: Configure Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all variables from `.env.local`:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- `THIRDWEB_SECRET_KEY`
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC`
- All other variables from `.env.local`

### Step 4: Trigger Redeploy

After adding environment variables, trigger a new deployment:

```bash
vercel --prod
```

Your app is now live at: `https://your-project.vercel.app`

## 📦 Nullshot Jam Deployment

### Option 1: Import from GitHub

1. Go to [nullshot.ai/jam](https://nullshot.ai/jam)
2. Click "Start Jam"
3. Select "Import from GitHub"
4. Authorize Nullshot to access your repository
5. Select `defiguard-ai` repository
6. Click "Import"
7. Wait for build to complete
8. Click "Publish Product"

### Option 2: Manual Upload

1. Create new Jam on Nullshot
2. Copy your project files into the Nullshot editor
3. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
4. Add environment variables
5. Click "Publish Product"

Your Nullshot URL: `https://nullshot.ai/app/[your-project-id]`

## ⛓️ Smart Contract Deployment

### Step 1: Get Testnet Tokens

**Base Sepolia Faucet**
https://www.alchemy.com/faucets/base-sepolia

**Arbitrum Sepolia Faucet**
https://faucet.quicknode.com/arbitrum/sepolia

### Step 2: Configure Hardhat

Create `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC!,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
  },
};

export default config;
```

### Step 3: Deploy Contracts

```bash
# Deploy to Base Sepolia
pnpm hardhat run scripts/deploy.ts --network baseSepolia

# Output will show deployed contract addresses
# Save these addresses for frontend integration
```

### Step 4: Verify Contracts

```bash
pnpm hardhat verify --network baseSepolia DEPLOYED_CONTRACT_ADDRESS
```

## 📊 DoraHacks Submission

### Step 1: Prepare Submission Materials

1. **Demo Video** (3-5 minutes):
   - Introduction & Problem (30s)
   - Live Demo (2-3 min)
   - Technical Architecture (1 min)
   - Impact & Future (30s)

2. **Project Write-Up**:
   - Problem statement
   - Solution with MCP architecture
   - Web3 integration details
   - Technical stack
   - Business model

3. **GitHub Repository**:
   - Complete README.md
   - Installation instructions
   - Environment setup guide
   - Code comments

### Step 2: Submit to DoraHacks

1. Go to [dorahacks.io/hackathon/nullshothacks](https://dorahacks.io/hackathon/nullshothacks)
2. Click "Submit Project"
3. Fill in project details:
   - **Title**: DeFiGuard AI - AI-Powered Smart Contract Security Auditor
   - **Tagline**: Secure your smart contracts with AI in under 30 seconds
   - **Description**: [Your detailed description]
   - **Track**: Track 1b - Web App using Nullshot
   - **Tags**: Add "Nullshot Hacks S0" (REQUIRED)

4. Add links:
   - **Nullshot Jam**: Your nullshot.ai URL
   - **Live Demo**: Your Vercel URL
   - **GitHub**: Your repository URL
   - **Demo Video**: YouTube/Loom link
   - **Deployed Contracts**: BaseScan links

5. Upload screenshots/images
6. Submit!

## ✅ Post-Deployment Verification

### Test Checklist

- [ ] Homepage loads correctly
- [ ] Neural background animation working
- [ ] Navbar and footer render properly
- [ ] Wallet connection functional
- [ ] Contract upload works
- [ ] AI analysis completes successfully
- [ ] Results display correctly
- [ ] Dashboard shows data
- [ ] Responsive on mobile
- [ ] No console errors

### Performance Optimization

```bash
# Run Lighthouse audit
npx lighthouse https://your-app.vercel.app --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🐛 Troubleshooting

### Common Issues

**Issue**: Build fails on Vercel
**Solution**: Check that all dependencies are in `package.json` and environment variables are set

**Issue**: Gemini API rate limit
**Solution**: Implement caching or upgrade to paid tier

**Issue**: Wallet connection not working
**Solution**: Verify WalletConnect Project ID is configured

**Issue**: Smart contracts not deploying
**Solution**: Ensure you have sufficient testnet ETH and correct RPC URLs

## 📞 Support

If you encounter issues:

1. Check [NullShot Discord](https://discord.gg/nullshot) #hackathon channel
2. Review [Thirdweb Documentation](https://portal.thirdweb.com)
3. Consult [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

## 🎉 Success!

Your DeFiGuard AI is now:
- ✅ Deployed on Vercel
- ✅ Published on Nullshot Jam
- ✅ Smart contracts on Base Sepolia
- ✅ Submitted to NullShot Hacks Season 0
- ✅ Ready for judging!

Good luck with the hackathon! 🚀

