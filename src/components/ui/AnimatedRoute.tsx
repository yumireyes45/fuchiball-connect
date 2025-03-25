
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedRouteProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
    },
  },
};

const AnimatedRoute = ({ children }: AnimatedRouteProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;
