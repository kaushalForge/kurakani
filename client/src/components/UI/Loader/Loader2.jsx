import React from "react";
import { motion } from "framer-motion";

const Loader2 = () => {
  const bounce = {
    y: ["0%", "-50%", "0%"],
  };

  const transition = (delay) => ({
    duration: 1,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror",
    delay,
  });

  return (
    <div className="flex justify-center items-center gap-1">
      <motion.span
        className="w-1 h-1 bg-white rounded-full"
        animate={bounce}
        transition={transition(0)}
      />
      <motion.span
        className="w-1 h-1 bg-white rounded-full"
        animate={bounce}
        transition={transition(0.2)}
      />
      <motion.span
        className="w-1 h-1 bg-white rounded-full"
        animate={bounce}
        transition={transition(0.4)}
      />
    </div>
  );
};

export default Loader2;
