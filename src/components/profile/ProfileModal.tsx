import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useToast } from '../ui/use-toast';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const { currentTheme, themes } = useThemeStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  } = usePasswordValidation('', '', themes[currentTheme].colors.primary.main);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (newPassword && !isPasswordValid) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }

      if (newPassword && !doPasswordsMatch) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      await updateProfile({
        firstName,
        lastName,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la mise à jour du profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const themeColor = themes[currentTheme].colors.primary.main;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl transform transition-all duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: themeColor }}>
            Modifier mon compte
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className={`hover:bg-[${themeColor}]/10`}
          >
            <X className="h-4 w-4" style={{ color: themeColor }} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Laissez vide pour ne pas changer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Laissez vide pour ne pas changer"
              className={newPassword ? getInputClassName(passwordFeedback.isValid) : ''}
            />
            {newPassword && (
              <p className={`text-sm mt-1 ${passwordFeedback.isValid ? 'text-green-600' : 'text-red-500'}`}>
                {passwordFeedback.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Laissez vide pour ne pas changer"
              className={confirmPassword ? getInputClassName(confirmPasswordFeedback.isValid) : ''}
            />
            {confirmPassword && (
              <p className={`text-sm mt-1 ${confirmPasswordFeedback.isValid ? 'text-green-600' : 'text-red-500'}`}>
                {confirmPasswordFeedback.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={`hover:bg-[${themeColor}]/10`}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: themeColor }}
              className={`text-white hover:bg-[${themeColor}]/90`}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 