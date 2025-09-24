import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  CreditCard,
  PiggyBank,
  Plus,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingOrbs } from "../components/FloatingOrbs";
import { GlowingButton } from "../components/GlowingButton";
import Navbar from "../components/Navigation/Navbar";

const WalletCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 max-w-sm mx-auto shadow-2xl shadow-orange-500/10"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Credit Wallet</h3>
            <p className="text-gray-400 text-sm">0x4f2a...8c3d</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Available Credit</span>
            <span className="text-2xl font-bold text-orange-400">$12,500</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Used</span>
            <span className="text-white">$2,500</span>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Next Payment</span>
            <span className="text-amber-400">$150</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Due Date</span>
            <span className="text-white">Dec 15, 2024</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
            Draw Funds
          </button>
          <button className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-xl font-medium hover:bg-black/30 hover:border-orange-500/30 transition-all duration-300">
            Repay
          </button>
        </div>
      </div>
    </motion.div>
  );
};

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
};

const StepCard = ({ step, title, description, icon: Icon, delay }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 group hover:border-orange-500/40 transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.05), inset 0 1px 0 rgba(249, 115, 22, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-orange-400">0{step}</div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 group hover:border-orange-500/40 transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.05), inset 0 1px 0 rgba(249, 115, 22, 0.1)'
      }}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <motion.div initial={false} className="border-b border-orange-500/20 last:border-b-0">
      <motion.button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-orange-400 transition-colors duration-300"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="w-5 h-5 text-orange-400" />
        </motion.div>
      </motion.button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-6">
          <p className="text-gray-400 leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const faqs = [
    {
      question: "How is my credit limit calculated?",
      answer:
        "Your credit limit is determined by our proprietary reputation scoring system that analyzes your on-chain activity, transaction history, and community trust metrics. No traditional credit checks required.",
    },
    {
      question: "What wallets are supported?",
      answer:
        "We support all major Web3 wallets including MetaMask, WalletConnect, Petra, and other popular Aptos-compatible wallets. Simply connect your existing wallet to get started.",
    },
    {
      question: "What happens if I don't repay on time?",
      answer:
        "Late payments affect your on-chain reputation score and may reduce your future credit limits. However, we focus on flexible repayment terms and will work with you to find solutions before taking any drastic measures.",
    },
    {
      question: "How do lenders earn yield?",
      answer:
        "Lenders deposit funds into smart contract pools and earn competitive APY from borrower interest payments. All transactions are transparent and automated through Aptos blockchain smart contracts.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <FloatingOrbs />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 mt-40">
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"
        />

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent">
              Next-Gen Payments.
              <br />
              One Tap Away.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Borrow instantly, repay flexibly. No cards, no banks — just smart credit powered by Aptos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <GlowingButton variant="primary">
              Start Borrowing
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
            <GlowingButton variant="secondary">
              Start Lending
              <TrendingUp className="w-5 h-5" />
            </GlowingButton>
          </motion.div>

          <WalletCard />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our seamless Web3 credit experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              step={1}
              title="Connect Wallet"
              description="Connect your existing Web3 wallet or create a new one. Seamless integration with all major wallet providers."
              icon={Wallet}
              delay={0.1}
            />
            <StepCard
              step={2}
              title="Get Your Credit Line"
              description="Receive a personalized credit limit based on your on-chain reputation and community trust score."
              icon={CreditCard}
              delay={0.2}
            />
            <StepCard
              step={3}
              title="Draw & Repay"
              description="Borrow what you need, when you need it. Flexible repayment terms that work with your schedule."
              icon={RefreshCw}
              delay={0.3}
            />
            <StepCard
              step={4}
              title="Lenders Earn"
              description="Community lenders earn competitive yield through automated smart contract pools."
              icon={PiggyBank}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Lender Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                Put Your Crypto to Work
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Deposit into lending pools and earn passive income while funding the next wave of DeFi credit.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                  <span className="text-gray-300">Competitive APY rates</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                  <span className="text-gray-300">Automated smart contracts</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                  <span className="text-gray-300">Transparent on-chain transactions</span>
                </div>
              </div>

              <GlowingButton variant="primary">
                Start Lending
                <TrendingUp className="w-5 h-5" />
              </GlowingButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)'
              }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Yield</h3>

              <div className="space-y-6">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-orange-500/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Current APY</span>
                    <span className="text-3xl font-bold text-orange-400">12.5%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full shadow-lg shadow-orange-500/20"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/10">
                    <div className="text-gray-400 text-sm mb-1">Your Deposits</div>
                    <div className="text-xl font-bold text-white">$25,000</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/10">
                    <div className="text-gray-400 text-sm mb-1">Total Earned</div>
                    <div className="text-xl font-bold text-orange-400">$3,125</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/lend/deposit")}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
                >
                  Deposit Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Web3 Native"
              description="Built for the decentralized web with support for all major wallet providers"
            />
            <FeatureCard
              icon={Wallet}
              title="Multi-Wallet Support"
              description="Connect with MetaMask, WalletConnect, Petra, and other popular Aptos wallets"
            />
            <FeatureCard
              icon={Target}
              title="Reputation Scoring"
              description="Credit limits based on on-chain activity and community trust metrics"
            />
            <FeatureCard
              icon={Shield}
              title="Aptos Native"
              description="Fast transactions, low gas fees, and enterprise-grade security"
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Security & Transparency
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Your credit lives on-chain. Fully non-custodial. Transparent by design.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-orange-500/20">
                <Shield className="w-8 h-8 text-orange-400" />
                <span className="text-lg font-medium">Aptos Blockchain</span>
              </div>
              <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-orange-500/20">
                <Wallet className="w-8 h-8 text-amber-400" />
                <span className="text-lg font-medium">Multi-Wallet Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div 
            className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)'
            }}
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent">
              Ready to get credit that works like the internet?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join the future of decentralized finance. Start borrowing or lending today.
            </p>

            <GlowingButton variant="primary" className="text-xl px-12 py-6">
              Start Now
              <ChevronRight className="w-6 h-6" />
            </GlowingButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
