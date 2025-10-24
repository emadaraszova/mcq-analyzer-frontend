import React from "react";
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
import { CardProps } from "@/types/mainPage";
import { useNavigate } from "react-router-dom";

const CardMain = ({ title, description, redirectTo }: CardProps) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(redirectTo);
  };

  return (
    <Card className="w-[80%] hover:border-sky-700">
      <CardHeader></CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNavigation} variant="outline">
          <span>Start</span>
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardMain;
