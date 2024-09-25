import '@/App.css'

import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom"
import { ArrowRight, Code, Zap, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


function WelcomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navigateToSolver = () => {
        navigate('/solver');
        window.scrollTo(0,0);
    }
    
    return (
        <div className="flex flex-col min-h-screen w-screen bg-[#f0f0f0]">            
            <main className="flex-grow">
                <section className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-5xl font-bold mb-4 text-[#2c3e50]">{t("welcomePage.solveProb")}</h1>
                    <p className="text-xl mb-8 text-[#2c3e50]">{t('welcomePage.powerfulSolution')}</p>
                    <Button size="lg" className="bg-[#e74c3c] hover:bg-[#c0392b] text-white">
                    {t('welcomePage.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />

                    </Button>
                </section>
                <section id="features" className="py-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center text-[#2c3e50]">{t('welcomePage.keayFeat')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<Code className="w-12 h-12 text-[#3498db]" />}
                                title="Multiple Formats" //translation
                                description="Support for GMPL, LP, and MPS problem formats"
                            />
                            <FeatureCard 
                                icon={<Zap className="w-12 h-12 text-[#e74c3c]" />}
                                title="Fast Solving" //translation
                                description="Efficient algorithms for quick problem resolution"
                            />
                            <FeatureCard 
                                icon={<BookOpen className="w-12 h-12 text-[#3498db]" />}
                                title="Easy Input" //translation
                                description="User-friendly interface for problem input and solving"
                            />
                        </div>
                    </div>
                </section>
                <section id="about" className="py-16 bg-white">
                    <div className="container mx-auto px-6">
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
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold mb-4">{t('welcomePage.optimize')}</h2>
                        <p className="mb-8">{t('welcomePage.startSolv')}</p>
                        <Button variant="secondary" size="lg" onClick={navigateToSolver} className="bg-[#3498db] hover:bg-[#2980b9] text-white">
                        {t('welcomePage.try')}
                        </Button>
                    </div>
                </section>
            </main>
        </div>

    )
}
interface FeatureCardProps {
    icon: React.ReactNode;  // Icon = JSX
    title: string;
    description: string;
  }

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <Card className="bg-white border-none shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#f0f0f0] rounded-full -mr-8 -mt-8"></div>
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
