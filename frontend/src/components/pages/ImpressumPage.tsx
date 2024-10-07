import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Impressum() {
    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Impressum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
                        <p>Max Mustermann</p>
                        <p>Musterstraße 123</p>
                        <p>12345 Musterstadt</p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">Kontakt</h2>
                        <p>E-Mail: max@mustermann.de</p>
                    </section>

                    <Separator />

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                        <p>Max Mustermann</p>
                        <p>Musterstraße 123</p>
                        <p>12345 Musterstadt</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}