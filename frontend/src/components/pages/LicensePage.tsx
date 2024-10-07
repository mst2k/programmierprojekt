import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';

export default function LicensePage() {
    const currentYear = new Date().getFullYear()
    const navigate = useNavigate();
    const {t} = useTranslation();

    const navigateToAbout = () => {
        navigate('/about');
        window.scrollTo(0,0);
    }

    return (
        <div className="flex flex-col min-h-screen w-screen p-10"> {/* hier auch flex flex-col h-screen w-screen ?*/}
            <Card className="container mx-auto p-4 max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{t("licensePage.licenseTitle")}</CardTitle>
                    <CardDescription>Open-Source-Softwarelizenz</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                        <div className="text-sm">
                            <p className="mt-4">
                                {t("licensePage.licenseCaption")}
                            </p>
                            <p className="mt-4">
                                {t("licensePage.section1")}
                            </p>
                            <p className="mt-4">
                                {t("licensePage.section2")}
                            </p>
                            <p className="mt-4">
                                {t("licensePage.section3")}
                            </p>
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={navigateToAbout}>{t("licensePage.buttonText")}</Button>
                    <p className="text-sm text-muted-foreground">{t("licensePage.update")}: {currentYear}</p>
                </CardFooter>
            </Card>
        </div>
    )
}