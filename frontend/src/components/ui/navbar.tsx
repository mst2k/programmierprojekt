import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuSingleTrigger
  } from "../ui/general/navigationmenu"
  import { useNavigate } from "react-router-dom"
  import { cn } from "@/lib/utils"
  import * as React from 'react'
  import { useState } from "react"


  const components: { title: string; lang: string; description: string }[] = [
    {
      title: "Deutsch",
      lang: "de",
      description:
        "Changes the language-settings to german",
    },
    {
      title: "Englisch",
      lang: "en",
      description:
        "Changes the language-settings to english",
    }
  ]
   
  export function NavigationMenuDemo() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("de"); //default
  
  const languageContent = {
    de: {
        title: "Startseite",
        description: "Wunderschön gestaltete Komponenten, erstellt mit Radix UI und Tailwind CSS.",
        language: "Sprache",
        solver: "Löser",
        about: "Über uns",
        converter: "Konvertierer",
    },
    en: {
      title: "Home",
      description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
      language: "Language",
      solver: "Solver",
      about: "About",
      converter: "Converter",
    },
  };

  const homeContent = languageContent[lang]; 
  type Lang = keyof typeof languageContent;
  

    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuSingleTrigger onClick={()=> navigate('/')}> Logo-Bild </NavigationMenuSingleTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger onClick={()=> navigate('/')}>{homeContent.title}</NavigationMenuTrigger> {/* menue-item title*/}
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/docs/installation" title="Installation">
                  installation tips and tool tips?
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavigationMenuSingleTrigger onClick={() => navigate('/converter/')}> {homeContent.converter}</NavigationMenuSingleTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem > 
          <NavigationMenuSingleTrigger onClick={()=> navigate('/solver/')}>{homeContent.solver}</NavigationMenuSingleTrigger>
          {/* Solver-Möglichkeiten aufführen? -- General, Simplex... */}
          </NavigationMenuItem>
          <NavigationMenuItem > 
          <NavigationMenuSingleTrigger onClick={()=> navigate('/about/')}>{homeContent.about}</NavigationMenuSingleTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{homeContent.language}</NavigationMenuTrigger> {/* menue-item title*/}
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    onClick={() => setLang(component.lang as Lang)}  //type-conversion to ensure only setting-values
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"
  