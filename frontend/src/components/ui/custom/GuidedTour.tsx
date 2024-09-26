import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { useNavigate } from 'react-router-dom';

interface GuidedTourProps {
  steps: Step[];
  run: boolean;
  setRun: React.Dispatch<React.SetStateAction<boolean>>;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ steps, run, setRun }) => {
  const navigate = useNavigate();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;

    if (status === 'finished' || status === 'skipped') {
      setRun(false);
    }

    if (type === 'step:after' && step) {
      const targetString = step.target.toString();
      if (targetString.includes('solver')) {
        navigate('/solver');
      } else if (targetString.includes('converter')) {
        navigate('/converter');
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3498db',
        },
      }}
    />
  );
};

export default GuidedTour;