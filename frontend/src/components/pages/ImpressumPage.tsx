import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ImpressumPage() {
    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Impressum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
                        <p>Yannick Helferich</p>
                        <p>Diese Anwendung wurde im Rahmen eines Projekts an der Hochschule Osnabrück am Standort Lingen durchgeführt.</p>
                        <p>Kaiserstrasse 10C</p>
                        <p>49809 Lingen</p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">Kontakt</h2>
                        <p>E-Mail: yannick.helferich@hs-osnabrueck.de</p>
                    </section>

                    <Separator />

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                        <p>Yannick Helferich</p>
                        <p>Kaiserstrasse 10C</p>
                        <p>49809 Lingen</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}