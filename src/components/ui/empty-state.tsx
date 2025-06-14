
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionButton, 
  className = "" 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-8 text-center ${className}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-4 flex justify-center"
        >
          <div className="p-3 rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        </motion.div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        {actionButton && (
          <Button onClick={actionButton.onClick}>
            {actionButton.label}
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
