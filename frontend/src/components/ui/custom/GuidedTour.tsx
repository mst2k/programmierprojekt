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

  const navigateToPage = ( value: 'solver' | 'converter', index: number) => {
    let state: { fromWelcomeGuideTour?: boolean; fromSolverGuideTour?: boolean; stepIndex: number };

    switch (value){
      case 'solver':
        state = { fromWelcomeGuideTour: true, stepIndex: index };
        break;
      case 'converter':
        state = {fromSolverGuideTour: true, stepIndex: index };
        break;
      default: 
        state = { stepIndex: index };
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
    const { status, type, index, action } = data;
    //end 
    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ){
        setRun(false);
        navigate('/');
        return;
    }
    //error
    if (
      status === STATUS.ERROR || type === 'error:target_not_found' || type === 'error') {
      console.log("Error:", data);
      setRun(false);
      navigate('/'); 
      return; 
    }
    
    if (type === 'step:after') {
      const nextIndex = index + (action === 'prev' ? -1 : 1)
      setStepIndex(nextIndex);

      //check if navigation to another page is necessary
      const currentTarget = steps[index].target.toString();
      const targetString = steps[nextIndex]?.target.toString();

      if (targetString.includes('solver') && !currentTarget.includes('solver')) {
         navigateToPage('solver', nextIndex);
      } else if (targetString.includes('converter') && !currentTarget.includes('converter')) {
        navigateToPage('converter', nextIndex);
      } else 
    //last step, navigating to landing page after short delay
    if(targetString.includes('last')){
          setRun(false);
          navigate('/'); window.scrollTo(0,0);
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