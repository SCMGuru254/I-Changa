
import { useState, useEffect } from "react";
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
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const onboardingSteps = [
  {
    title: "Welcome to Trust Circle",
    description: "Your trusted companion for group savings and contributions",
    image: "/lovable-uploads/b7757f32-448d-43a6-b28e-6cc15e143742.png",
  },
  {
    title: "Create & Join Groups",
    description: "Start or join savings groups with people you trust",
    image: "/lovable-uploads/2f360fe2-d870-4512-adae-3963eaafdac9.png",
  },
  {
    title: "Track Contributions",
    description: "Monitor group savings and contributions in real-time",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const handleComplete = () => {
    setShowGuidedTour(true);
  };

  const handleTourComplete = () => {
    setShowGuidedTour(false);
    toast({
      title: "Welcome to Trust Circle!",
      description: "You're all set up and ready to start managing your contribution groups.",
    });
    navigate("/dashboard");
  };

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, isLoading]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col justify-between">
          <Header />

          <div className="flex-1 flex items-center justify-center my-8">
            <Carousel 
              className="w-full max-w-lg" 
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={(api) => {
                if (api) {
                  api.on("select", () => {
                    setCurrentStep(api.selectedScrollSnap());
                  });
                }
              }}
            >
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
            <div className="flex gap-3 w-full max-w-xs">
              <Button
                size="lg"
                className="flex-1 animate-pulse"
                onClick={handleComplete}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Skip
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate('/guide')}
            >
              <Info className="w-4 h-4" />
              Learn More About iChanga
            </Button>
          </div>
        </div>
      </div>

      {showGuidedTour && (
        <GuidedTour onComplete={handleTourComplete} />
      )}
    </>
  );
}
