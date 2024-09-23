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
    position: "Projektmanagerin",
    description: "Elisabeth koordiniert unser Team und sorgt dafür, dass alle Projektabläufe reibungslos funktionieren. Ihre organisatorischen Fähigkeiten und ihr strategisches Denken sind der Schlüssel zu unserem Erfolg.",
    expertise: {
      technical: { value: 70, description: "Verständnis für technische Herausforderungen und Lösungsansätze" },
      leadership: { value: 95, description: "Hervorragende Führungsqualitäten und Teamkoordination" },
      business: { value: 85, description: "Fundierte Kenntnisse in Projektmanagement und Geschäftsprozessen" }
    }
  },
  {
    name: "Marcel",
    position: "Fullstack-Entwickler",
    description: "Marcel ist unser technisches Multitalent. Seine Expertise in verschiedenen Programmiersprachen und Frameworks macht ihn zu einem unverzichtbaren Mitglied unseres Entwicklerteams.",
    expertise: {
      technical: { value: 95, description: "Umfassende Kenntnisse in Frontend- und Backend-Technologien" },
      leadership: { value: 75, description: "Mentoring von Juniorentwicklern und technische Führung in Projekten" },
      business: { value: 70, description: "Verständnis für Geschäftsanforderungen und deren technische Umsetzung" }
    }
  },
  {
    name: "Felix",
    position: "UI/UX Designer",
    description: "Felix verleiht unseren Produkten das gewisse Etwas. Sein Gespür für Ästhetik und Benutzerfreundlichkeit sorgt dafür, dass unsere Anwendungen nicht nur funktional, sondern auch optisch ansprechend sind.",
    expertise: {
      technical: { value: 80, description: "Kenntnisse in Design-Tools und Prototyping-Software" },
      leadership: { value: 70, description: "Leitung von Design-Workshops und Kreativprozessen" },
      business: { value: 75, description: "Verständnis für Markenidentität und User Experience" }
    }
  },
  {
    name: "Yannick",
    position: "Data Scientist",
    description: "Yannick ist unser Experte für Datenanalyse und maschinelles Lernen. Seine Fähigkeit, komplexe Datensätze zu interpretieren und daraus wertvolle Erkenntnisse zu gewinnen, treibt unsere datengetriebenen Entscheidungen voran.",
    expertise: {
      technical: { value: 90, description: "Expertise in Datenanalyse, maschinellem Lernen und statistischer Modellierung" },
      leadership: { value: 65, description: "Führung von Datenanalyse-Projekten und Schulung von Teammitgliedern" },
      business: { value: 80, description: "Umsetzung von Geschäftsanforderungen in datengetriebene Lösungen" }
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
                  <Button variant="outline" className="mt-4">Vollständige Lizenzbedingungen</Button>
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
                  <Button>
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Besuchen Sie unser GitHub
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  )
}
