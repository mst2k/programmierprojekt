import '@/App.css'
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom"
import { ArrowRight, Code, Zap, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Step } from 'react-joyride';
import { useState } from 'react';
import GuidedTour from "@/components/ui/custom/GuidedTour"

function WelcomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [runTour, setRunTour] = useState(false);

    const navigateToSolver = () => {
        navigate('/solver' );
        window.scrollTo(0,0);
    }

    const startTour = () => {
        setRunTour(true);
    }

    const steps: Step[] = [
        {
            target: '.joyride-welcome',
            content: t('guidedTour.welcomePage.welcome'),
            disableBeacon: true,
        },
        {
            target: '.joyride-features',
            content: t('guidedTour.welcomePage.features'),
        },
        {
            target: '.joyride-about',
            content: t('guidedTour.welcomePage.about'),
        },
        {
            target: '.joyride-contact',
            content: t('guidedTour.welcomePage.contact'),
        },
        {
            target: '.joyride-solver',
            // content: 'Let's move to the Solver Page to solve your problems.',
            content: ''
        },
    ];
    
    return (
        <div className="flex flex-col min-h-screen w-screen bg-[#f0f0f0]">            
            <GuidedTour
                steps={steps}
                run={runTour}
                setRun={setRunTour}
            />
            <main className="flex-grow">
                <section className="container mx-auto px-6 py-16 text-center joyride-welcome">
                    <h1 className="text-5xl font-bold mb-4 text-[#2c3e50]">{t("welcomePage.solveProb")}</h1>
                    <p className="text-xl mb-8 text-[#2c3e50]">{t('welcomePage.powerfulSolution')}</p>
                    <Button size="lg" className="bg-[#e74c3c] hover:bg-[#c0392b] text-white" onClick={startTour}>
                        {t('welcomePage.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </section>
                <section id="features" className="py-16">
                    <div className="container mx-auto px-6 joyride-features">
                        <h2 className="text-3xl font-bold mb-8 text-center text-[#2c3e50]">{t('welcomePage.keayFeat')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<Code className="w-12 h-12 text-[#3498db]" />}
                                title= {t('lastTranslations.welcomePage.features.feat1Title')}
                                description={t('lastTranslations.welcomePage.features.feat1Description')}
                            />
                            <FeatureCard 
                                icon={<Zap className="w-12 h-12 text-[#e74c3c]" />}
                                title={t('lastTranslations.welcomePage.features.feat2Title')}
                                description={t('lastTranslations.welcomePage.features.feat2Description')}
                            />
                            <FeatureCard 
                                icon={<BookOpen className="w-12 h-12 text-[#3498db]" />}
                                title={t('lastTranslations.welcomePage.features.feat3Title')}
                                description={t('lastTranslations.welcomePage.features.feat3Description')}
                            />
                        </div>
                    </div>
                </section>
                <section id="about" className="py-16 bg-white">
                    <div className="container mx-auto px-6 joyride-about">
                        <h2 className="text-3xl font-bold mb-8 text-center text-[#2c3e50]">{t('welcomePage.aboutProj')}</h2>
                        <Card className="bg-[#f0f0f0] border-none shadow-lg">
                            <CardContent className="p-6">
                                <p className="text-[#2c3e50] mb-4">
                                {t('welcomePage.context')}
                                </p>
                                <p className="text-[#2c3e50]">
                                {t('welcomePage.academicContext')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                <section id="contact" className="py-16 bg-white">
                    <div className="container mx-auto px-6 text-center joyride-contact">
                        <h2 className="text-3xl font-bold mb-4">{t('welcomePage.optimize')}</h2>
                        <p className="mb-8">{t('welcomePage.startSolv')}</p>
                        <Button variant="secondary" size="lg" onClick={navigateToSolver} className="bg-[#3498db] hover:bg-[#2980b9] text-white joyride-solver">
                        {t('welcomePage.try')}
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    )
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <Card className="bg-white border-none shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -mr-8 -mt-8"></div>
            <CardHeader>
                <div className="flex justify-center mb-4 relative z-10">{icon}</div>
                <CardTitle className="text-xl font-semibold text-center text-[#2c3e50]">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-[#2c3e50] text-center">{description}</p>
            </CardContent>
        </Card>
    );
}

export default WelcomePage;