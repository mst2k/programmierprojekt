import '@/App.css'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion.tsx"
  

// import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"




function AboutPage() {
  
    return (
        <div className="flex h-screen w-screen p-10">
            
            <div className="flex-1 flex flex-col">
                <h1 className="text-xl font-bold mb-2">Über uns</h1>
                <main className="flex-1 overflow-auto">
                    <div className='flex space-x-4'>
                        <div className='flex-1'>                
                            <text>Wir sind Elisabeth Mählmann, Marcel Strohm, Felix Wallmeier und Yannick Helferich, ein leidenschaftliches Projektteam welches sich im Rahmen des Studiums
                                an der Hochschule Osnabrück mit der Entwicklung einer Website auseinandergesetzt hat, welche OR-Probleme lösen kann. 
                                </text>
                        </div>
                        <div className='flex-1'>
                            <text>Hier steht der Text daneben.</text>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold mb-2 pt-5">Das Team</h1>
                    <div className='flex space-x-4'>
                        <div className='flex-1'>  
                            <text>Hier steht etwas über die Teammitglieder</text>
                        </div>
                        <div className='flex-1'>
                            <text>Hier könnten Bilder angezeigt werden</text>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold mb-2 pt-5">Lizenzen</h1>
                    <div className='flex space-x-4'>  
                        <text>Hier steht etwas über die verwendete Lizenz</text>
                    </div>
                    <h1 className="text-xl font-bold mb-2 pt-5">Quellcode</h1>
                    <div className='flex space-x-4'>  
                        <text>Hier steht etwas über den Quellcode</text>
                    </div>
                    <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>

                </main>
                <footer className="bg-gray-800 text-white p-4 text-center">
                    Footer (About Page z.B.)
                </footer>
            </div>
    </div>
    )
}

export default AboutPage
