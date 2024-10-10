import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Datenschutz() {
    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Datenschutzerklärung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Datenschutz auf einen Blick</h2>
                        <p>
                            Wir legen großen Wert auf den Schutz Ihrer persönlichen Daten. Diese Datenschutzerklärung informiert Sie darüber,
                            wie wir mit Ihren Daten umgehen, wenn Sie unsere Website besuchen.
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Allgemeine Hinweise</h2>
                        <p>
                            Bei der bloßen Nutzung unserer Website werden keine personenbezogenen Daten erhoben.
                            Personenbezogene Daten werden nur erfasst, wenn Sie uns diese freiwillig mitteilen,
                            beispielsweise wenn Sie Kontakt mit uns aufnehmen.
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Datenerfassung auf unserer Website</h2>
                        <h3 className="text-lg font-medium mb-1">Kontakt per E-Mail</h3>
                        <p>
                            Wenn Sie per E-Mail Kontakt mit uns aufnehmen, werden die von Ihnen mitgeteilten Daten
                            (Ihre E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer) von uns gespeichert,
                            um Ihre Fragen zu beantworten. Die in diesem Zusammenhang anfallenden Daten löschen wir,
                            nachdem die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein,
                            falls gesetzliche Aufbewahrungspflichten bestehen.
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Ihre Rechte</h2>
                        <p>
                            Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
                        </p>
                        <ul className="list-disc list-inside mt-2">
                            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                            <li>Recht auf Berichtigung oder Löschung (Art. 16 und 17 DSGVO)</li>
                            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                            <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                        </ul>
                        <p className="mt-2">
                            Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren (Art. 77 DSGVO).
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Verantwortlicher im Sinne der DSGVO</h2>
                        <p>
                            Gemäß Art. 4 Nr. 7 DSGVO ist der Verantwortliche für die Verarbeitung personenbezogener Daten:
                        </p>
                        <p className="mt-2">
                            Marcel Strohm<br />
                            Kaiserstrasse 10C 49809 Lingen<br />
                            E-Mail: marcel.strohm@hs-osnabrueck.de<br />
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}