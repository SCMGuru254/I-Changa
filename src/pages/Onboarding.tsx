import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const onboardingSteps = [
  {
    title: "Welcome to MPesa Trust Circle",
    description: "Your trusted companion for group savings and contributions",
    image: "/placeholder.svg",
  },
  {
    title: "Create & Join Groups",
    description: "Start or join savings groups with people you trust",
    image: "/placeholder.svg",
  },
  {
    title: "Track Contributions",
    description: "Monitor group savings and contributions in real-time",
    image: "/placeholder.svg",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">MPesa Trust Circle</h1>
          <p className="text-muted-foreground">Secure Group Savings Made Simple</p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center my-8">
          <Carousel className="w-full max-w-lg">
            <CarouselContent>
              {onboardingSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center p-6"
                  >
                    <div className="mb-8">
                      <motion.img
                        src={step.image}
                        alt={step.title}
                        className="w-64 h-64 mx-auto object-cover rounded-lg shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="flex flex-col items-center gap-4 pb-8">
          <div className="flex gap-2 mb-4">
            {onboardingSteps.map((_, index) => (
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
          <Button
            size="lg"
            className="w-full max-w-xs animate-pulse"
            onClick={handleComplete}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}