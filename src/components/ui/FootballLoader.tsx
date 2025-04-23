import { motion } from 'framer-motion';

const FootballLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-[url('https://images.vexels.com/media/users/3/130462/isolated/preview/7db804bcbdc99731a2d432435f99597b-football-player-kicking-silhouette.png')] bg-contain bg-no-repeat bg-center"
        animate={{
          rotate: -360,
          y: [0, 10, 0]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default FootballLoader;