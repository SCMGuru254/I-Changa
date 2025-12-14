import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
}

export const StepCard = ({ title, description, icon: Icon, image }: StepCardProps) => {
  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-4 m-1">
      <div className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          Icon && <Icon className="w-24 h-24 text-primary" />
        )}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}