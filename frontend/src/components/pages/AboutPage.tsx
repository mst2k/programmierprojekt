import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GithubIcon, FileTextIcon, UsersIcon, BookOpenIcon, CodeIcon, PresentationIcon } from "lucide-react"
import { FC } from "react"
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

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
  const navigate = useNavigate();
  const {t} = useTranslation();

  // Teammitglieder explizit typisiert
  const teamMembers: TeamMember[] = [
    {
      name: t("aboutPage.tmm1.name"),
      position: t("aboutPage.tmm1.position"),
      description: t("aboutPage.tmm1.description"),
      expertise: {
        technical: { value: 80, description: t("aboutPage.tmm1.expTec") },
        leadership: { value:40 , description: t("aboutPage.tmm1.expLea") },
        business: { value: 85, description: t("aboutPage.tmm1.expBus") }
      }
    },
    {
      name: t("aboutPage.tmm2.name"),
      position: t("aboutPage.tmm2.position"),
      description: t("aboutPage.tmm2.description"),
      expertise: {
        technical: { value: 95, description: t("aboutPage.tmm2.expTec") },
        leadership: { value: 60, description: t("aboutPage.tmm2.expLea") },
        business: { value: 70, description: t("aboutPage.tmm2.expBus") }
      }
    },
    {
      name: t("aboutPage.tmm3.name"),
      position: t("aboutPage.tmm3.position"),
      description: t("aboutPage.tmm3.description"),
      expertise: {
        technical: { value: 95, description: t("aboutPage.tmm3.expTec") },
        leadership: { value: 70, description: t("aboutPage.tmm3.expLea") },
        business: { value: 75, description: t("aboutPage.tmm3.expBus") }
      }
    },
    {
      name: t("aboutPage.tmm4.name"),
      position: t("aboutPage.tmm4.position"),
      description: t("aboutPage.tmm4.description"),
      expertise: {
        technical: { value: 35, description: t("aboutPage.tmm4.expTec") },
        leadership: { value: 95, description: t("aboutPage.tmm4.expLea") },
        business: { value: 90, description: t("aboutPage.tmm4.expBus") }
      }
    }
  ]

  const navigateToLicense = () => {
    navigate('/license');
    window.scrollTo(0,0);
  }

  return (
      <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">{t("aboutPage.title")}</h1>

        <Accordion type="single" collapsible className="w-full space-y-4" value={openAccordion} onValueChange={setOpenAccordion}>
          <AccordionItem value="history">
            <AccordionTrigger>
              <div className="flex items-center">
                <BookOpenIcon className="mr-2 pl-1.5" />
                {t("aboutPage.cpt1.Header")}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    {t("aboutPage.cpt1.Text1")}
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    {t("aboutPage.cpt1.Text2")}
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    {t("aboutPage.cpt1.Text3")}
                  </p>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="team">
            <AccordionTrigger>
              <div className="flex items-center">
                <UsersIcon className="mr-2 pl-1.5" />
                {t("aboutPage.cpt2.Header")}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {t("aboutPage.cpt3.Header")}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-muted-foreground">
                    {t("aboutPage.cpt3.text")}
                  </p>
                  <Button variant="outline" onClick={navigateToLicense} className="mt-4">{t("aboutPage.cpt3.button")}</Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="source-code">
            <AccordionTrigger>
              <div className="flex items-center">
                <GithubIcon className="mr-2 pl-1.5" />
                {t("aboutPage.cpt4.Header")}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-muted-foreground">
                    {t("aboutPage.cpt4.text")}
                  </p>
                  <Button >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    <a href="https://github.com/mst2k/programmierprojekt" target="_blank">{t("aboutPage.cpt4.button")}</a>
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  )
}
