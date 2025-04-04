import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Send, Plus, User } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';

type DayStatus = 'conge-am' | 'absence-prevue' | 'absence-validee' | 'conge-maladie' | null;

interface DayData {
  date: Date;
  status: DayStatus;
}

export function ParentDashboard() {
  const { user, signOut } = useAuthStore();
  const [messageInput, setMessageInput] = useState('');
  const [currentDate] = useState(new Date());

  // Exemple de données pour les jours spéciaux
  const specialDays: DayData[] = [
    { date: new Date(2024, 3, 8), status: 'conge-maladie' },
    { date: new Date(2024, 3, 9), status: 'conge-maladie' },
    { date: new Date(2024, 3, 16), status: 'absence-prevue' },
    { date: new Date(2024, 3, 17), status: 'absence-prevue' },
    { date: new Date(2024, 3, 21), status: 'conge-am' },
    { date: new Date(2024, 3, 25), status: 'absence-validee' },
    { date: new Date(2024, 4, 8), status: 'absence-validee' },
    { date: new Date(2024, 4, 9), status: 'absence-validee' },
    { date: new Date(2024, 4, 14), status: 'conge-am' },
    { date: new Date(2024, 4, 15), status: 'conge-am' },
  ];

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
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const getDayStatus = (date: Date): DayStatus => {
    const specialDay = specialDays.find((day) => isSameDay(day.date, date));
    return specialDay?.status || null;
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
      <div>
        <h4 className="text-center font-medium mb-2">
          {format(baseDate, 'MMMM yyyy', { locale: fr })}
        </h4>
        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-1">
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
            const status = getDayStatus(day);
            const isCurrentMonth = isSameMonth(day, baseDate);
            const dayClasses = `
              aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer
              ${getStatusColor(status)}
              ${isToday(day) ? 'ring-2 ring-[#7ECBC3]' : ''}
              ${!isCurrentMonth ? 'text-gray-400' : ''}
            `;

            return (
              <div key={day.toISOString()} className={dayClasses.trim()}>
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Implémenter l'envoi de message
      setMessageInput('');
    }
  };

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
          <div className="text-lg font-medium mb-8">Emma</div>
          <button className="flex items-center gap-2 bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter un enfant
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Caregiver Banner */}
          <div className="bg-white border-b border-gray-100 p-5 flex items-start">
            <div className="w-24 h-24 bg-[#B5E5E0] rounded-xl flex items-center justify-center mr-5">
              <User className="w-12 h-12 text-[#7ECBC3]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Marie Dubois</h2>
              <div className="flex gap-4 mb-4">
                <span className="bg-gray-50 px-4 py-2 rounded-lg text-sm">
                  Taux horaire : 9,50 €/h
                </span>
                <span className="bg-gray-50 px-4 py-2 rounded-lg text-sm">
                  Frais journaliers : 3,20 €/jour
                </span>
              </div>
              <button className="bg-[#F7EDE2] text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-[#7ECBC3] hover:text-white transition-colors">
                Voir le contrat
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Calendar Section */}
            <div className="flex-1 bg-white p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Planning de garde</h3>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-8">
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
            <div className="w-[300px] bg-white border-l border-gray-100 flex flex-col">
              <div className="p-5 border-b border-gray-100 font-medium">
                Messagerie
              </div>
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                <div className="bg-gray-50 text-gray-700 p-3 rounded-2xl max-w-[80%]">
                  Bonjour ! Emma a bien mangé aujourd'hui, elle a fait une sieste de 2h.
                </div>
                <div className="bg-[#B5E5E0] text-gray-700 p-3 rounded-2xl max-w-[80%] ml-auto">
                  Merci pour l'info Marie, a-t-elle pris son goûter aussi ?
                </div>
                <div className="bg-gray-50 text-gray-700 p-3 rounded-2xl max-w-[80%]">
                  Oui, elle a mangé un yaourt et des fruits.
                </div>
                <div className="bg-[#B5E5E0] text-gray-700 p-3 rounded-2xl max-w-[80%] ml-auto">
                  Parfait, merci beaucoup !
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="w-10 h-10 bg-[#7ECBC3] text-white rounded-full flex items-center justify-center hover:bg-[#6BA59E] transition-colors"
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