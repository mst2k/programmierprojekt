"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GithubIcon, FileTextIcon, UsersIcon, BookOpenIcon, CodeIcon, PresentationIcon } from "lucide-react"
import { FC } from "react"

// Typ für Expertise
interface Expertise {
  value: number;
  description: string;
}

// Typ für Teammitglied
interface TeamMember {
  name: string;
  position: string;
  description: string;
  expertise: {
    technical: Expertise;
    leadership: Expertise;
    business: Expertise;
  };
}

// Teammitglieder explizit typisiert
const teamMembers: TeamMember[] = [
  {
    name: "Elisabeth",
    position: "Entwickelerin",
    description: "Elisabeth ist bekannt für ihr starkes technisches Verständnis und ihre Fähigkeit, komplexe Geschäftsprozesse zu durchdringen. Sie bringt wertvolle Einsichten in die Entwicklung und Umsetzung technischer Lösungen mit und meistert technische Herausforderungen mit Bravour.",
    expertise: {
      technical: { value: 80, description: "Fähigkeit, technische Herausforderungen zu verstehen und effiziente Lösungen zu entwickeln." },
      leadership: { value:40 , description: "Kompetenz in der Leitung von Teams, Mentoring und Koordination von Projekten." },
      business: { value: 85, description: "Fähigkeit, Geschäftsanforderungen zu erkennen und sie strategisch in technologische oder operative Lösungen umzusetzen." }
    }
  },
  {
    name: "Marcel",
    position: "Entwickler",
    description: "Marcel bringt umfassende Expertise in allen Bereichen der Softwareentwicklung mit. Mit seinem breiten Spektrum an technischen Fähigkeiten spielt er eine Schlüsselrolle in der Entwicklung von Frontend- und Backend-Lösungen.",
    expertise: {
      technical: { value: 95, description: "Fähigkeit, technische Herausforderungen zu verstehen und effiziente Lösungen zu entwickeln." },
      leadership: { value: 60, description: "Kompetenz in der Leitung von Teams, Mentoring und Koordination von Projekten." },
      business: { value: 70, description: "Fähigkeit, Geschäftsanforderungen zu erkennen und sie strategisch in technologische oder operative Lösungen umzusetzen." }
    }
  },
  {
    name: "Felix",
    position: "Entwickler",
    description: "Felix vereint technisches Know-how mit einem tiefen Verständnis für Designprozesse und User Experience. Er leitet kreative Prozesse und sorgt dafür, dass Projekte nicht nur technisch, sondern auch ästhetisch überzeugen.",
    expertise: {
      technical: { value: 95, description: "Fähigkeit, technische Herausforderungen zu verstehen und effiziente Lösungen zu entwickeln." },
      leadership: { value: 70, description: "Kompetenz in der Leitung von Teams, Mentoring und Koordination von Projekten." },
      business: { value: 75, description: "Fähigkeit, Geschäftsanforderungen zu erkennen und sie strategisch in technologische oder operative Lösungen umzusetzen." }
    }
  },
  {
    name: "Yannick",
    position: "Product Owner/ Scrum Master",
    description: "Yannick ist ein Produktmanager mit starkem Führungscharisma und ausgeprägten analytischen Fähigkeiten. Er bringt ein tiefes Verständnis für die Geschäftsanforderungen mit und sorgt dafür, dass datengetriebene Lösungen effizient umgesetzt werden.",
    expertise: {
      technical: { value: 35, description: "Fähigkeit, technische Herausforderungen zu verstehen und effiziente Lösungen zu entwickeln." },
      leadership: { value: 95, description: "Kompetenz in der Leitung von Teams, Mentoring und Koordination von Projekten." },
      business: { value: 90, description: "Fähigkeit, Geschäftsanforderungen zu erkennen und sie strategisch in technologische oder operative Lösungen umzusetzen." }
    }
  }
]

// Props-Typen für ExpertiseBar-Komponente
interface ExpertiseBarProps {
  expertise: Expertise;
  icon: React.ReactNode;
}

// ExpertiseBar-Komponente explizit typisiert
const ExpertiseBar: FC<ExpertiseBarProps> = ({ expertise, icon }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 mb-2">
            <div className="pr-6">{icon}</div>
            <div className="flex-grow">
              <Progress value={expertise.value} className="w-full" />
            </div>
            <span className="text-sm font-medium">{expertise.value}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{expertise.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
)

export default function AboutPage() {
  // useState explizit typisiert
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined)

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Über uns</h1>

        <Accordion type="single" collapsible className="w-full space-y-4" value={openAccordion} onValueChange={setOpenAccordion}>
          <AccordionItem value="history">
            <AccordionTrigger>
              <div className="flex items-center">
                <BookOpenIcon className="mr-2 pl-1.5" />
                Unsere Geschichte
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Im Rahmen des dualen Studiums im Fach Wirtschaftsinformatik an  der Hochschule Osnabrück
                    durften wir im 5. Semester unsere Fachkenntnisse aus dem Bereichen Operations Research
                    und den Grundlagen der Webentwicklung anwenden.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Im Laufe der ersten vier Semester wurden uns dabei Kenntnisse und Fertigkeiten vermittelt
                    die in diesem Projekt gebündelt angewandt werden müssen um das Ziel dieses Projekts zu
                    erreichen.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Das Projektteam ist in seinen Kenntnisse und Fähigkeiten eher heterogen, sodass verschiedene
                    Sichtweisen zu einer vielversprechenden Webanwendung geführt haben.
                  </p>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="team">
            <AccordionTrigger>
              <div className="flex items-center">
                <UsersIcon className="mr-2 pl-1.5" />
                Das Team
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                    <Card key={member.name}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{member.position}</p>
                        <p className="text-sm text-muted-foreground mb-4">{member.description}</p>
                        <h4 className="font-semibold text-sm mb-2">Expertise:</h4>
                        <ExpertiseBar
                            expertise={member.expertise.technical}
                            icon={<CodeIcon className="w-4 h-4" />}
                        />
                        <ExpertiseBar
                            expertise={member.expertise.leadership}
                            icon={<UsersIcon className="w-4 h-4" />}
                        />
                        <ExpertiseBar
                            expertise={member.expertise.business}
                            icon={<PresentationIcon className="w-4 h-4" />}
                        />
                      </CardContent>
                    </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="licenses">
            <AccordionTrigger>
              <div className="flex items-center">
                <FileTextIcon className="mr-2 pl-1.5" />
                Lizenzen
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>MIT Lizenz für Open-Source-Komponenten</li>
                    <li>Apache 2.0 Lizenz für bestimmte Bibliotheken</li>
                    <li>Proprietäre Lizenz für unsere Kerntechnologie</li>
                  </ul>
                  <Button variant="outline" className="mt-4" onClick="">Vollständige Lizenzbedingungen</Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="source-code">
            <AccordionTrigger>
              <div className="flex items-center">
                <GithubIcon className="mr-2 pl-1.5" />
                Quellcode
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-muted-foreground">
                    Wir glauben an die Kraft der Open-Source-Gemeinschaft. Ein Großteil unseres
                    Codes ist öffentlich zugänglich, um Zusammenarbeit und Innovation zu fördern.
                    Durch die Offenlegung unseres Quellcodes möchten wir nicht nur Transparenz
                    schaffen, sondern auch anderen Entwicklern die Möglichkeit geben, von unserer
                    Arbeit zu lernen und darauf aufzubauen.
                  </p>
                  <Button >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    <a href="https://github.com/mst2k/programmierprojekt" target="_blank">Besuchen Sie unser GitHub</a>
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  )
}
