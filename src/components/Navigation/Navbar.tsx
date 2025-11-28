import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 relative"
    >
      {/* Moving glowing line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
        <motion.div
          className="absolute h-full w-32 bg-gradient-to-r from-transparent via-black to-transparent"
          animate={{
            x: ["-128px", "95vw"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            <a href="/" className="flex flex-row gap-3 items-center">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-12 h-12 flex items-center justify-center object-contain rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                Aion
              </span>
            </a>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/borrow")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-gray-600 hover:text-black transition-colors duration-300 font-medium"
            >
              Borrow
            </motion.button>
            <motion.button
              onClick={() => navigate("/lend/deposit")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-gray-600 hover:text-black transition-colors duration-300 font-medium"
            >
              Lend
            </motion.button>
            <motion.button
              onClick={() => navigate("/waitlist")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-black/40 transition-all duration-300"
            >
              Waitlist
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
