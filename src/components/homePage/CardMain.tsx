import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { CardProps } from "@/types/homePage";
import { useNavigate } from "react-router-dom";

const CardMain = ({ title, description, redirectTo }: CardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md hover:border-sky-700">
      <CardHeader />
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(redirectTo)}
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          <span>Start</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardMain;
