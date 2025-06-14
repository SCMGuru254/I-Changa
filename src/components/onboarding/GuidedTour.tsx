
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface GuidedTourProps {
  onComplete: () => void;
}

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your personal information to help group members identify you',
      completed: false,
    },
    {
      id: 'group',
      title: 'Join or Create a Group',
      description: 'Start by joining an existing group or create your own contribution circle',
      completed: false,
    },
    {
      id: 'contribute',
      title: 'Make Your First Contribution',
      description: 'Learn how to record contributions and track group progress',
      completed: false,
    },
    {
      id: 'explore',
      title: 'Explore Features',
      description: 'Discover analytics, messaging, and other powerful features',
      completed: false,
    },
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const markStepCompleted = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipTour = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="w-full max-w-md p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Getting Started</h2>
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="mb-4" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-6"
            >
              <div className="flex items-start gap-3 mb-4">
                {steps[currentStep].completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{steps[currentStep].title}</h3>
                  <p className="text-muted-foreground">{steps[currentStep].description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={skipTour}
                className="flex-1"
              >
                Skip Tour
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
