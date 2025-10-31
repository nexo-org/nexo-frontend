import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Zap } from "lucide-react";
import { FloatingOrbs } from "../components/FloatingOrbs";
import { GlowingButton } from "../components/GlowingButton";
import Navbar from "../components/Navigation/Navbar";

export default function Waitlist() {
  const handleJoinNow = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSeTYGDbp9-824ItdCjBTkqluXqYm20L_KlTG3ibJEyObizbWg/viewform?usp=publish-editor",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <FloatingOrbs />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent">
              Join the Waitlist
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Be among the first to experience the future of Web3 credit. Early access, exclusive benefits, and priority
              support await.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <GlowingButton variant="primary" onClick={handleJoinNow} className="text-xl px-12 py-6">
              Join Waitlist Now
              <ArrowRight className="w-6 h-6" />
            </GlowingButton>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div
              className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)",
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">$50M+</h3>
              <p className="text-gray-400">Credit Ready</p>
            </div>

            <div
              className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)",
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">Q1 2026</h3>
              <p className="text-gray-400">Expected Launch</p>
            </div>

            <div
              className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)",
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">Early Access</h3>
              <p className="text-gray-400">Priority Features</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Early Access Benefits
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join our waitlist and get exclusive perks when we launch
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Priority Access",
                description: "Be the first to access our platform when we launch",
              },
              {
                title: "Higher Credit Limits",
                description: "Early users get increased credit limits and better terms",
              },
              {
                title: "Airdrop and Rewards",
                description: "Receive points towards future token airdrops and rewards",
              },
              {
                title: "Exclusive Updates",
                description: "Get behind-the-scenes updates and product previews",
              },
              {
                title: "Direct Support",
                description: "Priority customer support and direct access to our team",
              },
              {
                title: "Beta Features",
                description: "Test new features before they're released to the public",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-300"
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 32px rgba(249, 115, 22, 0.05), inset 0 1px 0 rgba(249, 115, 22, 0.1)",
                }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent">
              Don't Miss Out
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Secure your spot in the future of decentralized finance. Join thousands of others waiting for launch.
            </p>

            <GlowingButton variant="primary" onClick={handleJoinNow} className="text-xl px-12 py-6">
              Join Waitlist
              <ArrowRight className="w-6 h-6" />
            </GlowingButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
