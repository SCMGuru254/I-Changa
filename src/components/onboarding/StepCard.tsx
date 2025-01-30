import { motion } from "framer-motion";

interface StepCardProps {
  title: string;
  description: string;
  image: string;
}

export function StepCard({ title, description, image }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center p-6"
    >
      <div className="mb-8">
        <motion.img
          src={image}
          alt={title}
          className="w-64 h-64 mx-auto object-cover rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}