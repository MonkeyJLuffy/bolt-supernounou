import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { UserDropdown } from '../ui/UserDropdown';

export function GestionnaireDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#4B0082]">Tableau de bord Gestionnaire</h1>
            <div className="flex items-center space-x-4">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte des utilisateurs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#4B0082] mb-4">
              Gestion des Utilisateurs
            </h2>
            <p className="text-[#4B0082]/70">
              Aucun utilisateur enregistré pour le moment.
            </p>
          </div>

          {/* Carte des réservations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#4B0082] mb-4">
              Toutes les Réservations
            </h2>
            <p className="text-[#4B0082]/70">
              Aucune réservation en cours.
            </p>
          </div>

          {/* Carte des statistiques */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#4B0082] mb-4">
              Statistiques
            </h2>
            <p className="text-[#4B0082]/70">
              Aucune donnée disponible pour le moment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 