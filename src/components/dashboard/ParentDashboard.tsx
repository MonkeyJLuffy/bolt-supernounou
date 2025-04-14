import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
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
import { UserDropdown } from '../ui/UserDropdown';

interface UIMessage {
  id: string;
  content: string;
  sender: 'parent' | 'nounou';
  timestamp: Date;
}

export function ParentDashboard() {
  const { user, signOut } = useAuthStore();
  const { currentTheme, themes } = useThemeStore();
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
        return `bg-[${themes[currentTheme].colors.warning.main}]`;
      case 'absence-prevue':
        return `bg-[${themes[currentTheme].colors.warning.light}]`;
      case 'absence-validee':
        return `bg-[${themes[currentTheme].colors.success.main}] text-white`;
      case 'conge-maladie':
        return `bg-[${themes[currentTheme].colors.error.main}] text-white`;
      case 'selected':
        return `bg-[${themes[currentTheme].colors.primary.main}] text-white`;
      default:
        return `bg-[${themes[currentTheme].colors.background.default}] hover:bg-[${themes[currentTheme].colors.background.paper}]`;
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
    <div className={`min-h-screen bg-[${themes[currentTheme].colors.background.default}]`}>
      {/* En-tête */}
      <header className={`bg-[${themes[currentTheme].colors.background.paper}] shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold text-[${themes[currentTheme].colors.primary.main}]`}>
              Tableau de bord Parent
            </h1>
            <div className="flex items-center space-x-4">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte des enfants */}
          <div className={`bg-[${themes[currentTheme].colors.background.paper}] rounded-lg shadow p-6`}>
            <h2 className={`text-xl font-semibold text-[${themes[currentTheme].colors.primary.main}] mb-4`}>
              Mes Enfants
            </h2>
            <p className={`text-[${themes[currentTheme].colors.text.secondary}]`}>
              Aucun enfant enregistré pour le moment.
            </p>
          </div>

          {/* Carte des réservations */}
          <div className={`bg-[${themes[currentTheme].colors.background.paper}] rounded-lg shadow p-6`}>
            <h2 className={`text-xl font-semibold text-[${themes[currentTheme].colors.primary.main}] mb-4`}>
              Mes Réservations
            </h2>
            <p className={`text-[${themes[currentTheme].colors.text.secondary}]`}>
              Aucune réservation en cours.
            </p>
          </div>

          {/* Carte des paiements */}
          <div className={`bg-[${themes[currentTheme].colors.background.paper}] rounded-lg shadow p-6`}>
            <h2 className={`text-xl font-semibold text-[${themes[currentTheme].colors.primary.main}] mb-4`}>
              Mes Paiements
            </h2>
            <p className={`text-[${themes[currentTheme].colors.text.secondary}]`}>
              Aucun paiement pour le moment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}