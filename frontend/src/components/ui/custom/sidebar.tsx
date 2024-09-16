
// import React, { useState } from 'react';
// import { ArrowLeftFromLine, ArrowRightFromLine, Plus, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { useTranslation } from 'react-i18next';

// interface CollapsableSidebarProps {
//   isOpen: boolean;
//   onToggle: () => void;
// }

// const CollapsableSidebar: React.FC<CollapsableSidebarProps> = ({ isOpen, onToggle }) => {
//   const [activeTab, setActiveTab] = useState<'allgemein' | 'simplex' | 'andere'>('allgemein');
//   const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize'>('maximize');
//   const [objectiveFunction, setObjectiveFunction] = useState('');
//   const [restrictions, setRestrictions] = useState<string[]>(['']);

//   const {t} = useTranslation();

//   const updateOptimizationType = (value: 'maximize' | 'minimize') => {
//     setOptimizationType(value);
//   };

//   const updateObjectiveFunction = (value: string) => {
//     setObjectiveFunction(value);
//   };

//   const addRestriction = () => {
//     setRestrictions(prev => [...prev, '']);
//   };

//   const updateRestriction = (index: number, value: string) => {
//     setRestrictions(prev => prev.map((r, i) => i === index ? value : r));
//   };

//   const removeRestriction  = (index: number) => {
//     setRestrictions (prev => prev.filter((_,i) => i !== index));
//   };

//   const renderTabContent = () => (
//     <div className="space-y-4">
//       <h3 className="font-bold mb-2">{t("orTyp")}</h3>
//       <Select value={optimizationType} onValueChange={updateOptimizationType}>
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Optimierungstyp wählen" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="maximize">{t('Max')}</SelectItem>
//           <SelectItem value="minimize">{t('Min')}</SelectItem>
//         </SelectContent>
//       </Select>
//       <h3 className="font-bold mb-2">{t('orFunction')}</h3>
//       <Input 
//         placeholder="Zielfunktion eingeben" 
//         value={objectiveFunction}
//         onChange={(e) => updateObjectiveFunction(e.target.value)}
//       />
//       <h3 className="font-bold mb-2">{t("rest")}</h3>
//       {restrictions.map((restriction, index) => (
//         <div key={index} className="flex items-center space-x-2">
//           <Input
//             key={index}
//             placeholder={`Restriktion ${index + 1}`}
//             value={restriction}
//             onChange={(e) => updateRestriction(index, e.target.value)}
//           />
//           {restrictions.length > 1 && (
//             <Button onClick={() => removeRestriction(index)} variant="outline" className="p-1">
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//       ))}
//       <Button onClick={addRestriction} className="py-2 text-sm ml-auto block">
//         <Plus className="h-4 w-4" />
//       </Button>
//     </div>
//   );

//   return (
//     <>
//       <Button
//         onClick={onToggle}
//         className={`fixed ${isOpen ? 'left-72' : 'left-0'} top-20 z-20 transition-all duration-300 bg-stone-50 hover:bg-stone-50`}
//         variant="ghost"
//       >
//         {isOpen ? <ArrowLeftFromLine className="text-black"/> : <ArrowRightFromLine className="text-black"/>}
//       </Button>
//       <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-72' : 'w-0'} overflow-hidden`}>
//         <div className="p-2 space-y-4">
//           <div className="flex flex-row space-x-1 mt-4">
//             {[
//               { id: 'allgemein', label: t('general') },
//               { id: 'simplex', label: t('simplex') },
//               { id: 'andere', label: t('otherProbs') }
//             ].map((tab) => (
//               <Button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as 'allgemein' | 'simplex' | 'andere')}
//                 variant={activeTab === tab.id ? 'default' : 'outline'}
//                 className="flex-1 py-1 text-sm justify-center"
//               >
//                 {tab.label}
//               </Button>
//             ))}
//           </div>
//           {renderTabContent()}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CollapsableSidebar;
// __________________________________________________________________________________

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRightFromLine } from "lucide-react"
import { useTranslation } from "react-i18next"

interface SidebarProps {
    currentInputVariant: "general" | "easy";
    setCurrentInputVariant: React.Dispatch<React.SetStateAction<"general" | "easy">>;
}

export default function Sidebar( { currentInputVariant, setCurrentInputVariant }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const {t} = useTranslation();

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div className="flex h-screen">
      <div
        className={`bg-background border-r transition-all duration-300 flex flex-col ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex justify-between items-center p-2 border-b">
         {isOpen && (
            <h2 className="text-lg font-semibold">{t('mode')}</h2>
        )}
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className=" top-20 z-20 transition-all duration-300 bg-stone-50 hover:bg-stone-50"
          >
             {isOpen ? <X className=" h-4 w-4 text-black"/> : <ArrowRightFromLine className="h-4 w-4text-black"/>}
          </Button>
        </div>
        {isOpen && (
          <div className="flex flex-col space-y-2 p-4">
            <Button
              variant={currentInputVariant === "general" ? "default" : "outline"}
              onClick={() => setCurrentInputVariant("general")}
              className="justify-start"
            >
              {t('general')}
            </Button>
            <Button
              variant={currentInputVariant === "easy" ? "default" : "outline"}
              onClick={() => setCurrentInputVariant("easy")}
              className="justify-start"
            >
              {t('easy')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}