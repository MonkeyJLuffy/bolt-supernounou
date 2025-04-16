import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';

export const FirstLoginSetup = () => {
  const { user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState(user?.firstName || '');
  const [last_name, setLastName] = useState(user?.lastName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    password: newPassword,
    confirmPassword,
    isPasswordValid,
    doPasswordsMatch,
    setPassword: setNewPassword,
    setConfirmPassword,
    passwordFeedback,
    confirmPasswordFeedback,
    getInputClassName
  } = usePasswordValidation();

  const isFormValid = isPasswordValid && doPasswordsMatch && first_name && last_name && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs correctement.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        firstName: first_name,
        lastName: last_name,
        newPassword
      });
      
      toast({
        title: 'Profil mis à jour',
        description: 'Votre profil a été mis à jour avec succès.'
      });
      
      navigate('/gestionnaire/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du profil.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-[#7ECBC3] mr-4 sm:mr-12">Super Nounou</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)]">
        {/* Left Column - Logo and Info */}
        <div className="w-full lg:w-1/2 bg-[#B5E5E0] flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-8">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#7ECBC3]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6 text-center">Configuration initiale</h2>
          <p className="text-white text-base sm:text-xl text-center max-w-md">
            Bienvenue {user?.email} ! Veuillez compléter votre profil et définir votre mot de passe.
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <Card className="w-full max-w-md p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <Input
                  id="firstName"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <Input
                  id="lastName"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={getInputClassName(passwordFeedback.isValid)}
                  required
                  disabled={isSubmitting}
                />
                {newPassword && (
                  <p className={`text-sm mt-1 ${passwordFeedback.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordFeedback.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={getInputClassName(confirmPasswordFeedback.isValid)}
                  required
                  disabled={isSubmitting}
                />
                {confirmPassword && (
                  <p className={`text-sm mt-1 ${confirmPasswordFeedback.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    {confirmPasswordFeedback.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#7ECBC3] hover:bg-[#6BA59E] text-white"
                disabled={!isFormValid}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}; 