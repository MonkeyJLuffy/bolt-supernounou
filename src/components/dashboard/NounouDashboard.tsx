import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { UserDropdown } from '../ui/UserDropdown';
import { useThemeStore } from '../../store/themeStore';

export function NounouDashboard() {
  const { user } = useAuthStore();
  const { currentTheme, themes } = useThemeStore();

  return (
    <div className={`min-h-screen bg-[${themes[currentTheme].colors.background.default}]`}>
      {/* En-tête */}
      <header className={`bg-[${themes[currentTheme].colors.background.paper}] shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold text-[${themes[currentTheme].colors.primary.main}]`}>
              Tableau de bord Nounou
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
          {/* Carte des disponibilités */}
          <div className={`bg-[${themes[currentTheme].colors.background.paper}] rounded-lg shadow p-6`}>
            <h2 className={`text-xl font-semibold text-[${themes[currentTheme].colors.primary.main}] mb-4`}>
              Mes Disponibilités
            </h2>
            <p className={`text-[${themes[currentTheme].colors.text.secondary}]`}>
              Aucune disponibilité enregistrée pour le moment.
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

          {/* Carte des revenus */}
          <div className={`bg-[${themes[currentTheme].colors.background.paper}] rounded-lg shadow p-6`}>
            <h2 className={`text-xl font-semibold text-[${themes[currentTheme].colors.primary.main}] mb-4`}>
              Mes Revenus
            </h2>
            <p className={`text-[${themes[currentTheme].colors.text.secondary}]`}>
              Aucun revenu pour le moment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 