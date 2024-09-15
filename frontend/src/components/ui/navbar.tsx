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

  import Logo from '/logo.svg'
  import { useTranslation } from "react-i18next"

   
  export function NavigationMenuDemo() {
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();

    const changeLanguage =(lng: string) =>{
      i18n.changeLanguage(lng);
    }
    
    const components: { title: string; lang: string; description: string }[] = [
      {
        title: t('langTitleDe'),
        lang: "de",
        description: t('descDe'),
      },
      {
        title: t('langTitleEn'),
        lang: "en",
        description: t('descEn'),
      }
    ]

      return (            
      <div className="w-full flex justify-between items-center px-4 py-0">
        <NavigationMenu >
          <NavigationMenuList>
            {/*left elements*/}
              <NavigationMenuItem>
                <NavigationMenuLink onClick={()=> navigate('/')}> 
                  <img src={Logo} className="logo" alt="Logo"></img> </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuSingleTrigger onClick={()=> navigate('/')}>{t('title')}</NavigationMenuSingleTrigger> {/* menue-item title*/}
                {/* <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr]">
                    <ListItem href="/docs/installation" title={t('installationTitle')}>
                    {t('homeTitleDesc')}
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>{ /*TODO: Nach demo wieder Aktivieren */}
             {/* <NavigationMenuItem>
              <NavigationMenuSingleTrigger onClick={() => navigate('/converter/')}> {t('converter')}</NavigationMenuSingleTrigger>*/}
              </NavigationMenuItem>
              <NavigationMenuItem > 
              <NavigationMenuSingleTrigger onClick={()=> navigate('/solver/')}>{t('solver')}</NavigationMenuSingleTrigger>
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu >


        <NavigationMenu >
          <NavigationMenuList>
            {/* right elements */}
              <NavigationMenuItem > 
              <NavigationMenuSingleTrigger onClick={()=> navigate('/about/')}>{t('about')}</NavigationMenuSingleTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('language')}</NavigationMenuTrigger> {/* menue-item title*/}
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[150] lg:w-[300px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        onClick={() => changeLanguage(component.lang)}  //type-conversion to ensure only setting-values
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
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
  