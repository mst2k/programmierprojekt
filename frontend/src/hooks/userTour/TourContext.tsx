import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Step } from 'react-joyride';

interface TourContextType {
  runTour: boolean;
  setRunTour: React.Dispatch<React.SetStateAction<boolean>>;
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  steps: Step[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
        target: '.joyride-welcome',
        content: 'Welcome to our problem-solving platform!',
        disableBeacon: true,
    },
    {
        target: '.joyride-features',
        content: 'Explore our key features that make problem-solving easier.',
    },
    {
        target: '.joyride-about',
        content: 'Learn more about our project and its academic context.',
    },
    // {
    //     target: '.joyride-contact',
    //     content: 'Ready to start? Click here to begin solving problems!',
    // },
    {
        target: '.joyride-solver',
        content: 'Ready to start? Click here to begin solving problems!',
        //content: "Let's move to the Solver Page to solve your problems."
    },
    {
        target: '.joyride-solver-input',
        content: 'Here you can input your problem in various formats.',
    },
    {
        target: '.joyride-solver-result',
        content: 'The results of your solved problem will appear here.',
    },
    // {
    //     target: '.joyride-converter',
    //     content: "Let's move to the Converter Page to convert between different formats.",
    // },
    // {
    //     target: '.joyride-converter-input',
    //     content: 'On the Converter page, you can input your problem to convert between different formats.',
    // },
    // {
    //     target: '.joyride-converter-output',
    //     content: 'The converted problem will be displayed here.',
    // },
    
];

  return (
    <TourContext.Provider value={{ runTour, setRunTour, currentStepIndex, setCurrentStepIndex, steps }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};