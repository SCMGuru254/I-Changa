import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center pt-8 flex flex-col items-center gap-4"
    >
      <motion.img
        src="/lovable-uploads/4713051a-d1b2-4b5b-90e3-6df1a428dd07.png"
        alt="Trust Circle Logo"
        className="w-32 h-32 object-contain bg-gray-50 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1.5
        }}
      />
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">Trust Circle</h1>
        <p className="text-muted-foreground">Secure Group Savings Made Simple</p>
      </div>
    </motion.div>
  );
}