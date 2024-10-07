import React, { useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuSingleTrigger
} from "../../navigationmenu.tsx"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils.ts"
import Logo from '/logo.svg'
import { useTranslation } from "react-i18next"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button.tsx"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"

export function NavigationMenuDemo() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
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
        <div className="w-full flex justify-between items-center px-4 py-0 my-1">
            <NavigationMenu className={"md:hidden"}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink onClick={() => navigate('/')}>
                            <img src={Logo} className="logo" alt="Logo" />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Navigation */}
            <div className="w-full hidden md:flex justify-between items-center px-0 py-0 my-1">
                <NavigationMenu >
                    <NavigationMenuList>
                        {/*left elements*/}
                        <NavigationMenuItem>
                            <NavigationMenuLink onClick={()=> navigate('/')}>
                                <img src={Logo} className="logo" alt="Logo"></img> </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuSingleTrigger onClick={()=> navigate('/')}>{t('title')}</NavigationMenuSingleTrigger> {/* menue-item title*/}
                        </NavigationMenuItem>{ /*TODO: Nach demo wieder Aktivieren */}
                        <NavigationMenuItem>
                            <NavigationMenuSingleTrigger onClick={() => navigate('/converter/')}> {t('converter')}</NavigationMenuSingleTrigger>
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

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <nav className="flex flex-col space-y-4">
                            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/'); setIsOpen(false); }}>
                                {t('title')}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/converter/'); setIsOpen(false); }}>
                                {t('converter')}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/solver/'); setIsOpen(false); }}>
                                {t('solver')}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/about/'); setIsOpen(false); }}>
                                {t('about')}
                            </Button>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>{t('language')}</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[200px] gap-3 p-4">
                                                {components.map((component) => (
                                                    <ListItem
                                                        key={component.title}
                                                        title={component.title}
                                                        onClick={() => {
                                                            changeLanguage(component.lang);
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {component.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
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
  