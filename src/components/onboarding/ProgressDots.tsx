import { motion } from "framer-motion";

interface ProgressDotsProps {
  steps: number;
  currentStep: number;
}

export function ProgressDots({ steps, currentStep }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 mb-4">
      {Array.from({ length: steps }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-2 w-2 rounded-full ${
            currentStep === index ? "bg-primary" : "bg-gray-300"
          }`}
          animate={{
            scale: currentStep === index ? 1.2 : 1,
          }}
        />
      ))}
    </div>
  );
}