import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Send, Plus, User, ChevronDown } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  isSameMonth,
  isToday,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Child } from '../../types/child';
import { Caregiver } from '../../types/caregiver';
import { DayStatus, DayData } from '../../types/calendar';
import { Message as MessageType } from '../../types/message';
import { mockChildService, mockCaregiverService, mockCalendarService, mockMessageService } from '../../services/mockServices';

interface UIMessage {
  id: string;
  content: string;
  sender: 'parent' | 'nounou';
  timestamp: Date;
}

export function ParentDashboard() {
  const { user, signOut } = useAuthStore();
  const [messageInput, setMessageInput] = useState('');
  const [currentDate] = useState(new Date());
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // États pour les données
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChildSelector, setShowChildSelector] = useState(false);

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Charger les enfants du parent
        const userChildren = await mockChildService.getChildrenByParentId(user.id);
        setChildren(userChildren);
        
        if (userChildren.length > 0) {
          setActiveChild(userChildren[0]);
          
          // Charger la nounou associée à l'enfant
          const caregivers = await mockCaregiverService.getCaregiversByChildId(userChildren[0].id);
          if (caregivers.length > 0) {
            setCaregiver(caregivers[0]);
          }
          
          // Charger les messages
          const childMessages = await mockMessageService.getMessagesByChildId(userChildren[0].id);
          // Convertir les messages au format attendu par le composant
          const formattedMessages: UIMessage[] = childMessages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.senderId === user.id ? 'parent' : 'nounou',
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  // Gestion des événements clavier pour la touche Contrôle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Gestion du clic en dehors du calendrier
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        // Réinitialiser la sélection
        setSelectionStart(null);
        setSelectionEnd(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: DayStatus): string => {
    switch (status) {
      case 'conge-am':
        return 'bg-[#FFD166]';
      case 'absence-prevue':
        return 'bg-[#F4A261]';
      case 'absence-validee':
        return 'bg-[#84A98C] text-white';
      case 'conge-maladie':
        return 'bg-[#E76F51] text-white';
      case 'selected':
        return 'bg-[#7ECBC3] text-white';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const isDateSelected = (date: Date): boolean => {
    // Vérifier si la date est dans la sélection de plage
    if (selectionStart && selectionEnd) {
      if (isWithinInterval(date, { start: selectionStart, end: selectionEnd })) {
        return true;
      }
    }
    
    // Vérifier si la date est le début ou la fin de la sélection
    if (selectionStart && isSameDay(date, selectionStart)) {
      return true;
    }
    if (selectionEnd && isSameDay(date, selectionEnd)) {
      return true;
    }
    
    // Vérifier si la date est dans la liste des jours sélectionnés individuellement
    return selectedDays.some(selectedDate => isSameDay(selectedDate, date));
  };

  const getDayStatus = async (date: Date): Promise<DayStatus> => {
    // Vérifier si le jour est sélectionné
    if (isDateSelected(date)) {
      return 'selected';
    }
    
    // Si nous avons un enfant actif et une nounou, récupérer le statut depuis le service
    if (activeChild && caregiver) {
      return await mockCalendarService.getDayStatus(date, activeChild.id, caregiver.id);
    }
    
    return null;
  };

  const handleDayClick = (date: Date) => {
    if (isCtrlPressed) {
      // Mode sélection multiple avec Ctrl
      const isAlreadySelected = selectedDays.some(selectedDate => isSameDay(selectedDate, date));
      
      if (isAlreadySelected) {
        // Retirer le jour de la sélection
        setSelectedDays(selectedDays.filter(selectedDate => !isSameDay(selectedDate, date)));
      } else {
        // Ajouter le jour à la sélection
        setSelectedDays([...selectedDays, date]);
      }
      
      // Réinitialiser la sélection de plage
      setSelectionStart(null);
      setSelectionEnd(null);
    } else {
      // Mode sélection de plage normal
      if (!selectionStart) {
        // Premier clic - définir le début de la sélection
        setSelectionStart(date);
        setSelectionEnd(null);
        // Réinitialiser la sélection multiple
        setSelectedDays([]);
      } else if (!selectionEnd) {
        // Deuxième clic - définir la fin de la sélection
        if (date < selectionStart) {
          // Si la date de fin est avant la date de début, inverser
          setSelectionEnd(selectionStart);
          setSelectionStart(date);
        } else {
          setSelectionEnd(date);
        }
      } else {
        // Troisième clic - réinitialiser la sélection
        setSelectionStart(date);
        setSelectionEnd(null);
      }
    }
  };

  const renderCalendar = (baseDate: Date) => {
    const start = startOfMonth(baseDate);
    const end = endOfMonth(baseDate);
    const days = eachDayOfInterval({ start, end });

    // Obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    const firstDayOfWeek = start.getDay();
    // Ajuster pour commencer par lundi (0 = lundi)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Ajouter des jours vides au début
    const emptyDays = Array(adjustedFirstDay).fill(null);

    return (
      <div className="scale-75 origin-top-left">
        <h4 className="text-center font-medium mb-2">
          {format(baseDate, 'MMMM yyyy', { locale: fr })}
        </h4>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
            <div key={day} className="font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square"></div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, baseDate);
            const dayClasses = `
              aspect-square flex items-center justify-center text-xs rounded-lg cursor-pointer
              ${isDateSelected(day) ? getStatusColor('selected') : 'bg-gray-50 hover:bg-gray-100'}
              ${isToday(day) ? 'ring-2 ring-[#7ECBC3]' : ''}
              ${!isCurrentMonth ? 'text-gray-400' : ''}
            `;

            return (
              <div 
                key={day.toISOString()} 
                className={dayClasses.trim()}
                onClick={() => handleDayClick(day)}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !activeChild || !caregiver) return;
    
    try {
      // Créer un nouveau message
      const newMessage = await mockMessageService.sendMessage({
        content: messageInput.trim(),
        senderId: user.id,
        receiverId: caregiver.id,
        childId: activeChild.id
      });
      
      // Ajouter le message à l'interface
      const formattedMessage: UIMessage = {
        id: newMessage.id,
        content: newMessage.content,
        sender: 'parent',
        timestamp: new Date(newMessage.timestamp)
      };
      
      setMessages([...messages, formattedMessage]);
      setMessageInput('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChildSelect = (child: Child) => {
    setActiveChild(child);
    setShowChildSelector(false);
    
    // Charger les données associées à l'enfant sélectionné
    const loadChildData = async () => {
      try {
        // Charger la nounou associée à l'enfant
        const caregivers = await mockCaregiverService.getCaregiversByChildId(child.id);
        if (caregivers.length > 0) {
          setCaregiver(caregivers[0]);
        }
        
        // Charger les messages
        const childMessages = await mockMessageService.getMessagesByChildId(child.id);
        // Convertir les messages au format attendu par le composant
        const formattedMessages: UIMessage[] = childMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.senderId === user?.id ? 'parent' : 'nounou',
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Erreur lors du chargement des données de l\'enfant:', err);
      }
    };
    
    loadChildData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ECBC3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Erreur</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#7ECBC3] text-white px-4 py-2 rounded-lg hover:bg-[#6BA59E] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#7ECBC3] mr-12">Super Nounou</h1>
              <div className="flex gap-2">
                <button className="bg-[#7ECBC3] text-white px-6 py-2 rounded-full font-medium">
                  Mon tableau de bord
                </button>
                <button className="border-2 border-[#B5E5E0] text-gray-700 px-6 py-2 rounded-full font-medium hover:bg-[#B5E5E0] transition-colors">
                  Trouver une nounou
                </button>
                <button className="border-2 border-[#B5E5E0] text-gray-700 px-6 py-2 rounded-full font-medium hover:bg-[#B5E5E0] transition-colors">
                  Paramètres
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={signOut}
                className="bg-[#7ECBC3] text-white px-4 py-2 rounded-lg hover:bg-[#6BA59E] transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        {/* Left Column - Child Profile */}
        <div className="w-60 bg-white border-r border-gray-100 p-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#B5E5E0] rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-[#7ECBC3]" />
          </div>
          
          {/* Sélecteur d'enfant */}
          <div className="relative mb-8">
            <button 
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setShowChildSelector(!showChildSelector)}
            >
              {activeChild ? activeChild.name : 'Sélectionner un enfant'}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showChildSelector && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                {children
                  .filter(child => child.parentId === user?.id)
                  .map(child => (
                    <button
                      key={child.id}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleChildSelect(child)}
                    >
                      {child.name} ({child.age} ans)
                    </button>
                  ))}
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-2 bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter un enfant
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Caregiver Banner */}
          {caregiver && (
            <div className="bg-white border-b border-gray-100 p-5 flex items-start">
              <div className="w-24 h-24 bg-[#B5E5E0] rounded-xl flex items-center justify-center mr-5">
                <User className="w-12 h-12 text-[#7ECBC3]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3">{caregiver.firstName} {caregiver.lastName}</h2>
                <div className="flex items-center gap-4">
                  <span className="bg-gray-50 px-4 py-2 rounded-lg text-sm">
                    Taux horaire : {caregiver.hourlyRate.toFixed(2)} €/h
                  </span>
                  <span className="bg-gray-50 px-4 py-2 rounded-lg text-sm">
                    Frais journaliers : {caregiver.dailyRate.toFixed(2)} €/jour
                  </span>
                  <button className="bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
                    Voir le contrat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Calendar Section */}
            <div className="w-1/3 bg-white p-5 overflow-y-auto" ref={calendarRef}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Planning de garde {activeChild ? `pour ${activeChild.name}` : ''}</h3>
                <div className="text-sm text-gray-500">
                  {isCtrlPressed ? "Mode sélection multiple (Ctrl)" : "Mode sélection de plage"}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-4">
                {renderCalendar(currentDate)}
                {renderCalendar(addMonths(currentDate, 1))}
              </div>

              {/* Legend */}
              <div className="flex justify-center flex-wrap gap-4 my-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FFD166] rounded"></div>
                  <span className="text-sm">Congé assistante maternelle</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F4A261] rounded"></div>
                  <span className="text-sm">Absence prévue de l'enfant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#84A98C] rounded"></div>
                  <span className="text-sm">Absence validée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#E76F51] rounded"></div>
                  <span className="text-sm">Congé maladie</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#7ECBC3] rounded"></div>
                  <span className="text-sm">Jours sélectionnés</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button className="bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
                  Voir les demandes en attente
                </button>
                <button className="bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
                  Déclarer une absence
                </button>
              </div>
            </div>

            {/* Messaging Section */}
            <div className="w-2/3 bg-white border-l border-gray-100 flex flex-col">
              <div className="p-5 border-b border-gray-100 font-medium">
                Messagerie {activeChild ? `avec ${activeChild.name}` : ''}
              </div>
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${
                      message.sender === 'parent'
                        ? 'bg-[#B5E5E0] ml-auto'
                        : 'bg-gray-50'
                    } text-gray-700 p-3 rounded-2xl max-w-[80%]`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(message.timestamp, 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="w-10 h-10 bg-[#7ECBC3] text-white rounded-full flex items-center justify-center hover:bg-[#6BA59E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button className="w-full bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
                  Contacter le Relais Petite Enfance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}