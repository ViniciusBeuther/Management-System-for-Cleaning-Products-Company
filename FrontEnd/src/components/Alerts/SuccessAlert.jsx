import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check } from "lucide-react";

const SuccessAlert = ( { title, description = "" } ) => {
  return (
    <Alert className="bg-green-200 w-[50%] mt-2">
      <Check className="h-4 w-4" />
      <AlertTitle className="font-bold text-green-700">
        { title }
      </AlertTitle>
      <AlertDescription className="text-green-600">
        { description }
      </AlertDescription>
    </Alert>
  );
};

export default SuccessAlert;
