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
        <div className="flex flex-col min-h-screen w-screen bg-white dark:bg-background">            
            <GuidedTour
                steps={steps}
                run={runTour}
                setRun={setRunTour}
            />
            <main className="flex-grow">
                <div className= "bg-muted dark:bg-background">
                    <section className="container mx-auto px-6 py-16 text-center joyride-welcome ">
                        <h1 className="text-5xl font-bold mb-4 text-foreground dark:text-foreground">{t("welcomePage.solveProb")}</h1>
                        <p className="text-xl mb-8 text-foreground dark:text-foreground">{t('welcomePage.powerfulSolution')}</p>
                        <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground dark:bg-secondary dark:hover:bg-secondary/90 dark:text-secondary-foreground" onClick={startTour}>
                            {t('welcomePage.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </section>
                    <section id="features" className="py-16">
                        <div className="container mx-auto px-6 joyride-features">
                            <h2 className="text-3xl font-bold mb-8 text-center text-foreground dark:text-foreground">{t('welcomePage.keayFeat')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <FeatureCard 
                                    icon={<Code className="w-12 h-12 text-primary dark:text-primary" />}
                                    title={t('lastTranslations.welcomePage.features.feat1Title')}
                                    description={t('lastTranslations.welcomePage.features.feat1Description')}
                                />
                                <FeatureCard 
                                    icon={<Zap className="w-12 h-12 text-secondary dark:text-secondary" />}
                                    title={t('lastTranslations.welcomePage.features.feat2Title')}
                                    description={t('lastTranslations.welcomePage.features.feat2Description')}
                                />
                                <FeatureCard 
                                    icon={<BookOpen className="w-12 h-12 text-primary dark:text-primary" />}
                                    title={t('lastTranslations.welcomePage.features.feat3Title')}
                                    description={t('lastTranslations.welcomePage.features.feat3Description')}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <section id="about" className="py-16 bg-white dark:bg-background">
                    <div className="container mx-auto px-6 joyride-about">
                        <h2 className="text-3xl font-bold mb-8 text-center text-foreground dark:text-foreground">{t('welcomePage.aboutProj')}</h2>
                        <Card className="bg-muted dark:bg-muted border-none shadow-lg">
                            <CardContent className="p-6">
                                <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                                {t('welcomePage.context')}
                                </p>
                                <p className="text-muted-foreground dark:text-muted-foreground">
                                {t('welcomePage.academicContext')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                <section id="contact" className="py-16 bg-white dark:bg-background">
                    <div className="container mx-auto px-6 text-center joyride-contact">
                        <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-foreground">{t('welcomePage.optimize')}</h2>
                        <p className="mb-8 text-foreground dark:text-foreground">{t('welcomePage.startSolv')}</p>
                        <Button variant="secondary" size="lg" onClick={navigateToSolver} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground dark:bg-secondary dark:hover:bg-secondary/90 dark:text-secondary-foreground joyride-solver">
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
        <Card className="bg-white border-none shadow-lg overflow-hidden bg-card text-card-foreground">
            <CardHeader>
                <div className="flex justify-center mb-4 relative z-10">{icon}</div>
                <CardTitle className="text-xl font-semibold text-center text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-card-foreground text-center">{description}</p>
            </CardContent>
        </Card>
    );
}

export default WelcomePage;