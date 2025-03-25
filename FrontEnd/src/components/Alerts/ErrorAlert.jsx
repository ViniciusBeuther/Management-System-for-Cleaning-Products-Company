import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";

const ErrorAlert = ( { title, description = "" } ) => {
  return (
    <Alert className="bg-red-200 w-[50%] mt-2">
      <X className="h-4 w-4" />
      <AlertTitle className="font-bold text-red-700">
        { title }
      </AlertTitle>
      <AlertDescription className="text-red-600">
        { description }
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
