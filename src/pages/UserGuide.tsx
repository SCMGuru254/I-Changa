import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Wallet, Users, Target, Shield, CreditCard, TrendingUp } from "lucide-react";

export default function UserGuide() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: "Simplified Group Savings",
      description: "Easily manage and track group contributions with M-Pesa integration"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Trusted Circle",
      description: "Create or join savings groups with people you trust"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Goal Tracking",
      description: "Set and monitor group savings targets with real-time progress updates"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure Transactions",
      description: "All contributions are securely processed through M-Pesa"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "Transparent Records",
      description: "Keep track of all contributions with detailed transaction history"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Growth Monitoring",
      description: "View contribution analytics and group performance metrics"
    }
  ];

  const steps = [
    {
      title: "1. Create or Join a Group",
      description: "Start by creating a new savings group or join an existing one through invitation"
    },
    {
      title: "2. Set Group Goals",
      description: "Define your group's target amount and timeline for contributions"
    },
    {
      title: "3. Make Contributions",
      description: "Contribute to your group using M-Pesa, with automatic transaction recording"
    },
    {
      title: "4. Track Progress",
      description: "Monitor your group's progress towards the savings goal in real-time"
    },
    {
      title: "5. Manage Members",
      description: "Add or remove members, assign roles (Admin, Treasurer, Member)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <img 
            src="/lovable-uploads/4713051a-d1b2-4b5b-90e3-6df1a428dd07.png"
            alt="iChanga Logo"
            className="w-24 h-24 mx-auto mb-4 object-contain bg-gray-50 rounded-full"
          />
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to iChanga
          </h1>
          <p className="text-xl text-gray-600">
            Your Complete Guide to Group Savings Management
          </p>
        </motion.div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {benefit.icon}
                    <h3 className="text-lg font-semibold mt-4 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2 text-primary">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Button 
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="animate-pulse"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}