import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/alertdialog";

const TermsAndConditionsModal = ({ isOpen, onAccept }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-red-50 border-red-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-800">Terms and Conditions</AlertDialogTitle>
          <AlertDialogDescription className="text-red-700">
            Welcome to our AI-powered chat interface. Before proceeding, please be aware that the data you provide during your interactions will be sent to a Large Language Model (LLM) for processing. We want to assure you that your data will be handled with the utmost care and confidentiality. While your inputs will be used to generate responses, they will not be utilized for training purposes or stored beyond the duration of your session. Our primary goal is to provide you with accurate and helpful responses while maintaining your privacy. By using this service, you acknowledge and agree to these terms. If you have any concerns or questions about data handling, please don't hesitate to contact our support team.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onAccept} className="bg-red-600 text-white hover:bg-red-700">
            I Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TermsAndConditionsModal;