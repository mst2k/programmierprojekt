import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [restrictions, setRestrictions] = useState<string[]>(['']);
  const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize'>('maximize');

  const {t} = useTranslation();

  const tWithFallback = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const handleElementClick = (index: number) => {
    setSelectedElement(index);
    setRestrictions(['']);
  };

  const addRestriction = () => {
    setRestrictions([...restrictions, '']);
  };

  const updateRestriction = (index: number, value: string) => {
    const newRestrictions = [...restrictions];
    newRestrictions[index] = value;
    setRestrictions(newRestrictions);
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-100 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <Button 
        className="left-0 top-0"
        onClick={onToggle}
        variant="outline"
        size="icon"
      >
       + {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Sidebar</h2>
          {[1, 2, 3].map((element) => (
            <Button
              key={element}
              className="w-full mb-2"
              onClick={() => handleElementClick(element)}
              variant={selectedElement === element ? "default" : "outline"}
            >
              Element {element}
            </Button>
          ))}

          {selectedElement !== null && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">{t('orTyp')}</h3>
              <Select
                value={optimizationType}
                onValueChange={(value: 'maximize' | 'minimize') => setOptimizationType(value)}
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maximize">{t('Max')}</SelectItem>
                  <SelectItem value="minimize">{t('Min')}</SelectItem>
                </SelectContent>
              </Select>

              <h3 className="font-bold mb-2">{t('orFunction')}</h3>
              <Input className="w-full mb-2" placeholder={tWithFallback('enterOFunc', 'Objective Function')} />
              
              <h3 className="font-bold mb-2">{t("rest")}</h3>
              {restrictions.map((restriction, index) => (
                <div key={index} className="mb-2 flex">
                  <Input
                    className="w-full mr-2"
                    placeholder={`${tWithFallback('Res', 'Restriction')} ${index + 1}`}
                    value={restriction}
                    onChange={(e) => updateRestriction(index, e.target.value)}
                  />
                  {index === restrictions.length - 1 && (
                    <Button onClick={addRestriction} variant="outline" size="icon">
                      + <PlusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;