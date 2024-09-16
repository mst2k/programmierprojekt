
import React, { useState } from 'react';
import { ArrowLeftFromLine, ArrowRightFromLine, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface CollapsableSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CollapsableSidebar: React.FC<CollapsableSidebarProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'simplex' | 'andere'>('allgemein');
  const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize'>('maximize');
  const [objectiveFunction, setObjectiveFunction] = useState('');
  const [restrictions, setRestrictions] = useState<string[]>(['']);

  const {t} = useTranslation();

  const updateOptimizationType = (value: 'maximize' | 'minimize') => {
    setOptimizationType(value);
  };

  const updateObjectiveFunction = (value: string) => {
    setObjectiveFunction(value);
  };

  const addRestriction = () => {
    setRestrictions(prev => [...prev, '']);
  };

  const updateRestriction = (index: number, value: string) => {
    setRestrictions(prev => prev.map((r, i) => i === index ? value : r));
  };

  const removeRestriction  = (index: number) => {
    setRestrictions (prev => prev.filter((_,i) => i !== index));
  };

  const renderTabContent = () => (
    <div className="space-y-4">
      <h3 className="font-bold mb-2">{t("orTyp")}</h3>
      <Select value={optimizationType} onValueChange={updateOptimizationType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Optimierungstyp wählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="maximize">{t('Max')}</SelectItem>
          <SelectItem value="minimize">{t('Min')}</SelectItem>
        </SelectContent>
      </Select>
      <h3 className="font-bold mb-2">{t('orFunction')}</h3>
      <Input 
        placeholder="Zielfunktion eingeben" 
        value={objectiveFunction}
        onChange={(e) => updateObjectiveFunction(e.target.value)}
      />
      <h3 className="font-bold mb-2">{t("rest")}</h3>
      {restrictions.map((restriction, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            key={index}
            placeholder={`Restriktion ${index + 1}`}
            value={restriction}
            onChange={(e) => updateRestriction(index, e.target.value)}
          />
          {restrictions.length > 1 && (
            <Button onClick={() => removeRestriction(index)} variant="outline" className="p-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button onClick={addRestriction} className="py-2 text-sm ml-auto block">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <>
      <Button
        onClick={onToggle}
        className={`fixed ${isOpen ? 'left-72' : 'left-0'} top-20 z-20 transition-all duration-300 bg-stone-50 hover:bg-stone-50`}
        variant="ghost"
      >
        {isOpen ? <ArrowLeftFromLine className="text-black"/> : <ArrowRightFromLine className="text-black"/>}
      </Button>
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-72' : 'w-0'} overflow-hidden`}>
        <div className="p-2 space-y-4">
          <div className="flex flex-row space-x-1 mt-4">
            {[
              { id: 'allgemein', label: t('general') },
              { id: 'simplex', label: t('simplex') },
              { id: 'andere', label: t('otherProbs') }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'allgemein' | 'simplex' | 'andere')}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className="flex-1 py-1 text-sm justify-center"
              >
                {tab.label}
              </Button>
            ))}
          </div>
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default CollapsableSidebar;


/*


import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MinimalistCollapsibleSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [inputMode, setInputMode] = useState('general')
  const [selectedSolver, setSelectedSolver] = useState('solver1')

  return (
    <div
      className={`h-screen bg-gray-100 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-12'
      } relative overflow-hidden`}
    >
      <div className={`p-4 ${isOpen ? 'space-y-6' : 'flex justify-center'}`}>
        <Button
          variant="ghost"
          size="icon"
          className={`bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${
            isOpen ? 'absolute top-4 right-4' : 'mt-4'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        <div className={`transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          {isOpen && (
            <>
              <div className="mt-10">
                <h2 className="text-lg font-semibold mb-2">Eingabevarianten</h2>
                <div className="space-y-2">
                  <Button
                    variant={inputMode === 'general' ? 'default' : 'outline'}
                    onClick={() => setInputMode('general')}
                    className="w-full"
                  >
                    General
                  </Button>
                  <Button
                    variant={inputMode === 'easy' ? 'default' : 'outline'}
                    onClick={() => setInputMode('easy')}
                    className="w-full"
                  >
                    Easy Input
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Solver</h2>
                <Select value={selectedSolver} onValueChange={setSelectedSolver}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wähle einen Solver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solver1">Solver 1</SelectItem>
                    <SelectItem value="solver2">Solver 2</SelectItem>
                    <SelectItem value="solver3">Solver 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}



 */