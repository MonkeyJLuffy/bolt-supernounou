import React, { useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FirstLoginSetup() {
  const { user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation en temps réel
  const isNewPasswordValid = formData.newPassword.length >= 8;
  const doPasswordsMatch = formData.newPassword === formData.confirmPassword;
  const isFormValid = isNewPasswordValid && doPasswordsMatch && !isSubmitting;

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        newPassword: formData.newPassword,
      });

      if (response) {
        toast({
          title: 'Succès',
          description: 'Votre profil a été mis à jour avec succès',
        });

        setTimeout(() => {
          navigate('/gestionnaire/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Non authentifié')) {
          toast({
            title: 'Erreur d\'authentification',
            description: 'Votre session a expiré. Veuillez vous reconnecter.',
            variant: 'destructive',
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast({
            title: 'Erreur',
            description: error.message || 'Une erreur est survenue lors de la mise à jour du profil',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Erreur',
          description: 'Une erreur inattendue est survenue',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, navigate, toast, updateProfile]);

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
            Bienvenue ! Veuillez configurer votre compte pour commencer.
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
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className={`w-full ${!isNewPasswordValid && formData.newPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  required
                  disabled={isSubmitting}
                />
                {formData.newPassword && (
                  <p className={`text-sm mt-1 ${isNewPasswordValid ? 'text-green-600' : 'text-red-500'}`}>
                    {isNewPasswordValid 
                      ? '✓ Le mot de passe est valide' 
                      : 'Le mot de passe doit contenir au moins 8 caractères'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full ${!doPasswordsMatch && formData.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  required
                  disabled={isSubmitting}
                />
                {formData.confirmPassword && (
                  <p className={`text-sm mt-1 ${doPasswordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                    {doPasswordsMatch 
                      ? '✓ Les mots de passe correspondent' 
                      : 'Les mots de passe ne correspondent pas'}
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
} 