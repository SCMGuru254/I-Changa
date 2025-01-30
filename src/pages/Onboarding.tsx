import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/onboarding/Header";
import { StepCard } from "@/components/onboarding/StepCard";
import { ProgressDots } from "@/components/onboarding/ProgressDots";

const onboardingSteps = [
  {
    title: "Welcome to Trust Circle",
    description: "Your trusted companion for group savings and contributions",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    title: "Create & Join Groups",
    description: "Start or join savings groups with people you trust",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    title: "Track Contributions",
    description: "Monitor group savings and contributions in real-time",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
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
        <Header />

        <div className="flex-1 flex items-center justify-center my-8">
          <Carousel className="w-full max-w-lg" onSelect={(index) => setCurrentStep(index)}>
            <CarouselContent>
              {onboardingSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <StepCard {...step} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="flex flex-col items-center gap-4 pb-8">
          <ProgressDots steps={onboardingSteps.length} currentStep={currentStep} />
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