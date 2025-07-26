import { motion } from 'framer-motion';
export function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <div className="text-3xl mb-2">{emoji}</div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </motion.div>
    );
  }