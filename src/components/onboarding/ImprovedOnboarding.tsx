
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, User, Phone, Mail, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validationService } from "@/utils/validationService";
import { useErrorHandler } from "@/utils/errorHandlingService";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  completed: boolean;
}

export function ImprovedOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleError, handleSuccess } = useErrorHandler({
    component: 'ImprovedOnboarding',
    action: 'profile_setup',
    userId: user?.id
  });

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Help other members identify you',
      completed: false,
      component: <ProfileSetupForm />
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Secure your account with additional verification',
      completed: false,
      component: <SecuritySetupForm />
    },
    {
      id: 'preferences',
      title: 'Notification Preferences',
      description: 'Choose how you want to be notified',
      completed: false,
      component: <NotificationPreferencesForm />
    }
  ]);

  function ProfileSetupForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Validate inputs
        const nameValidation = validationService.validateGroupName(profileData.fullName);
        const phoneValidation = validationService.validatePhoneNumber(profileData.phoneNumber);
        const emailValidation = validationService.validateEmail(profileData.email);

        if (!nameValidation.isValid || !phoneValidation.isValid || !emailValidation.isValid) {
          const allErrors = [
            ...nameValidation.errors,
            ...phoneValidation.errors,
            ...emailValidation.errors
          ];
          throw new Error(allErrors[0]);
        }

        // Update profile
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user?.id,
            full_name: profileData.fullName,
            phone_number: profileData.phoneNumber,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        handleSuccess('Profile updated successfully!');
        markStepCompleted('profile');
        setCurrentStep(1);
      } catch (error: any) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={profileData.phoneNumber}
            onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="+254712345678"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Complete Profile'}
        </Button>
      </form>
    );
  }

  function SecuritySetupForm() {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Shield className="h-5 w-5 text-green-500" />
          <div>
            <h4 className="font-medium">Account Security</h4>
            <p className="text-sm text-muted-foreground">Your account is secured with email authentication</p>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => {
            markStepCompleted('security');
            setCurrentStep(2);
          }}
        >
          Continue to Preferences
        </Button>
      </div>
    );
  }

  function NotificationPreferencesForm() {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Email notifications</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Task reminders</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Contribution alerts</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => {
            markStepCompleted('preferences');
            handleSuccess('Welcome to iChanga!');
            navigate('/dashboard');
          }}
        >
          Complete Setup
        </Button>
      </div>
    );
  }

  const markStepCompleted = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome to iChanga</h2>
          <p className="text-muted-foreground text-center mb-4">Tuko Pamoja - Let's get you set up</p>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {steps[currentStep].completed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-xs font-medium">{currentStep + 1}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>
          </div>
        </div>

        {steps[currentStep].component}
      </Card>
    </div>
  );
}
