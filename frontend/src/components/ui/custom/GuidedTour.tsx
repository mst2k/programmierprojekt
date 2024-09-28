import React, {useState, useEffect} from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';

interface GuidedTourProps {
  steps: Step[];
  run: boolean;
  setRun: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GuidedTour({ steps, run, setRun }: GuidedTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const navigateToPage = ( value: 'solver' | 'converter') => {
    let state: { fromWelcomeGuideTour?: boolean; fromSolverGuideTour?: boolean };

    switch (value){
      case 'solver':
        state = { fromWelcomeGuideTour: true };
        break;
      case 'converter':
        state = {fromSolverGuideTour: true};
        break;
      default: 
        state = {};
    }

    navigate(`/${value}`, {state});
    window.scrollTo(0,0);
}

  useEffect(() => {
    if (run) {
      setStepIndex(0);
    }
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      status === STATUS.ERROR ||
      type === 'error:target_not_found' ||
      type === 'error'
    ) {
      if (status === STATUS.ERROR || type === 'error:target_not_found' || type === 'error') {
        console.log("Error:", data);
      }
      setRun(false);
      navigate('/'); 
    }

    else if (type === 'step:after') {
        setStepIndex(index + (data.action === 'prev' ? -1 : 1));
      //check if navigation to another page is necessary
        const targetString = steps[index + 1]?.target.toString();
        if (targetString.includes('solver')) {
          navigateToPage('solver');
        } else if (targetString.includes('converter')) {
          navigateToPage('converter');
        } else if(targetString.includes('last')){
          //last step, navigating to landing page after short delay
          setTimeout(() => {
            setRun(false);
            navigate('/');
          }, 2000); 
        }
    }
  };



  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      run={run}
      steps={steps}      
      stepIndex={stepIndex}
      showSkipButton={true}
      styles={{
        options: {
          primaryColor: '#3498db',
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: 'center',
        },
      }}
      floaterProps={{
        disableAnimation: true,
        hideArrow: false,
      }}
    />
  );
};