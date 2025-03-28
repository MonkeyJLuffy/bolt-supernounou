import React from 'react';
import { useAuthStore } from '../../store/authStore';

export function ParentDashboard() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Parent
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={signOut}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte des enfants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mes Enfants
            </h2>
            <p className="text-gray-600">
              Aucun enfant enregistré pour le moment.
            </p>
          </div>

          {/* Carte des réservations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mes Réservations
            </h2>
            <p className="text-gray-600">
              Aucune réservation en cours.
            </p>
          </div>

          {/* Carte des nounous disponibles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nounous Disponibles
            </h2>
            <p className="text-gray-600">
              Aucune nounou disponible pour le moment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 