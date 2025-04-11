import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useToast } from '../ui/use-toast'
import { Trash2, Edit2, X, Plus, User, LogOut, ChevronDown, Mail } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { themeConfig } from '../../config/theme.config'
import { useThemeStore } from '../../store/themeStore'
import Cookies from 'js-cookie'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface Manager {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  is_active: boolean
}

interface Nanny {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  type: 'nanny'
}

interface Parent {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  type: 'parent'
}

interface UserModalProps {
  user: Nanny | Parent | null
  type: 'nanny' | 'parent'
  onClose: () => void
  onUpdate: (userId: string, data: { email: string; first_name: string; last_name: string; password?: string }) => Promise<void>
  onDelete: (userId: string) => Promise<void>
}

interface CreateUserModalProps {
  type: 'nanny' | 'parent'
  onClose: () => void
  onCreate: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>
}

const UserModal = ({ user, type, onClose, onUpdate, onDelete }: UserModalProps) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setFirstName(user.first_name)
      setLastName(user.last_name)
      setPassword('')
    }
  }, [user])

  if (!user) return null

  const handleUpdate = async () => {
    await onUpdate(user.id, {
      email,
      first_name: firstName,
      last_name: lastName,
      ...(password ? { password } : {})
    })
    setIsEditing(false)
    setPassword('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#4B0082]">
            {isEditing ? `Modifier ${type === 'nanny' ? 'la nounou' : 'le parent'}` : `Détails ${type === 'nanny' ? 'de la nounou' : 'du parent'}`}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div>
              <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdate}>
                  Enregistrer
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => onDelete(user.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CreateUserModal = ({ type, onClose, onCreate }: CreateUserModalProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const handleCreate = async () => {
    await onCreate({
      email,
      password,
      first_name: firstName,
      last_name: lastName
    })
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setPhone('')
    setAddress('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl transform transition-all duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Créer {type === 'nanny' ? 'une nounou' : 'un parent'}
            </h2>
            <p className="text-gray-600 mt-1">
              Veuillez remplir les informations {type === 'nanny' ? 'de la nounou' : 'du parent'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numéro de téléphone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse complète
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse complète"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#7ECBC3] text-white py-3 rounded-lg font-medium hover:bg-[#7ECBC3]/90 transition-colors"
          >
            Créer {type === 'nanny' ? 'la nounou' : 'le parent'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Composant pour les onglets
const TabButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
      isActive
        ? 'bg-white text-[#4B0082] border-b-2 border-[#4B0082] shadow-sm'
        : 'text-[#4B0082]/70 hover:text-[#4B0082] hover:bg-[#4B0082]/5'
    }`}
  >
    {children}
  </button>
);

// Composant pour le contenu des onglets
const TabContent: React.FC<{
  isActive: boolean;
  children: React.ReactNode;
}> = ({ isActive, children }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-b-lg p-6 shadow-sm"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const ThemeButton: React.FC<{
  themeName: string;
  isActive: boolean;
  onClick: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}> = ({ themeName, isActive, onClick, colors }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
      isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="w-full h-24 rounded-md mb-2" style={{ backgroundColor: colors.background }} />
    <div className="flex space-x-2 mb-2">
      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.primary }} />
      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.secondary }} />
    </div>
    <span className="text-sm font-medium text-gray-700">{themeName}</span>
  </button>
);

const CreateManagerModal = ({ onClose, onCreate }: { onClose: () => void; onCreate: (email: string, password: string, first_name: string, last_name: string) => Promise<void> }) => {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive'
      })
      return
    }
    await onCreate(email, password, first_name, last_name)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl transform transition-all duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#4B0082]">Créer un gestionnaire</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-[#4B0082]/10 transition-colors duration-200">
            <X className="h-4 w-4 text-[#4B0082]" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="managerFirstName" className="text-[#4B0082]">Prénom</Label>
            <Input
              id="managerFirstName"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="managerLastName" className="text-[#4B0082]">Nom</Label>
            <Input
              id="managerLastName"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="managerEmail" className="text-[#4B0082]">Email</Label>
            <Input
              id="managerEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="managerPassword" className="text-[#4B0082]">Mot de passe</Label>
            <Input
              id="managerPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="managerConfirmPassword" className="text-[#4B0082]">Confirmer le mot de passe</Label>
            <Input
              id="managerConfirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
              required
            />
          </div>
          <Button 
            type="submit"
            className="bg-[#4B0082] hover:bg-[#4B0082]/90 shadow-md hover:shadow-lg transition-all duration-200 w-full text-white"
          >
            Créer le gestionnaire
          </Button>
        </form>
      </div>
    </div>
  )
}

export const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, signOut } = useAuthStore()
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminNewPassword, setAdminNewPassword] = useState('')
  const [managers, setManagers] = useState<Manager[]>([])
  const [nannies, setNannies] = useState<Nanny[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedUser, setSelectedUser] = useState<Nanny | Parent | null>(null)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [createUserType, setCreateUserType] = useState<'nanny' | 'parent'>('nanny')
  const [activeTab, setActiveTab] = useState<'users' | 'customization'>('users')
  const { currentTheme, setTheme, themes } = useThemeStore()

  useEffect(() => {
    fetchManagers()
    fetchNannies()
    fetchParents()
  }, [])

  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/managers', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Impossible de charger la liste des gestionnaires')
      }

      const data = await response.json()
      setManagers(data)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des gestionnaires.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNannies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/nannies', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Impossible de charger la liste des nounous')
      }

      const data = await response.json()
      setNannies(data)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des nounous.',
        variant: 'destructive'
      })
    }
  }

  const fetchParents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/parents', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Impossible de charger la liste des parents')
      }

      const data = await response.json()
      setParents(data)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des parents.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createManager = async (email: string, password: string, first_name: string, last_name: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/managers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          role: 'gestionnaire',
          is_active: true
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la création du gestionnaire')
      }

      toast({
        title: 'Gestionnaire créé',
        description: 'Le compte gestionnaire a été créé avec succès.'
      })

      setShowCreateModal(false)
      fetchManagers()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du gestionnaire.',
        variant: 'destructive'
      })
    }
  }

  const updateManager = async (managerId: string, updates: { email?: string; password?: string; first_name?: string; last_name?: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/managers/${managerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la mise à jour du gestionnaire')
      }

      toast({
        title: 'Gestionnaire mis à jour',
        description: 'Les informations du gestionnaire ont été mises à jour avec succès.'
      })

      fetchManagers()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du gestionnaire.',
        variant: 'destructive'
      })
    }
  }

  const deleteManager = async (managerId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/managers/${managerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la suppression du gestionnaire')
      }

      toast({
        title: 'Gestionnaire supprimé',
        description: 'Le compte gestionnaire a été supprimé avec succès.'
      })

      setSelectedManager(null)
      fetchManagers()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du gestionnaire.',
        variant: 'destructive'
      })
    }
  }

  const updateAdminCredentials = async () => {
    if (adminNewPassword !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          email: adminEmail,
          currentPassword: adminPassword,
          newPassword: adminNewPassword
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour des informations');
      }

      toast({
        title: 'Informations mises à jour',
        description: 'Vos informations de connexion ont été mises à jour avec succès.'
      });

      setAdminEmail('');
      setAdminPassword('');
      setAdminNewPassword('');
      setConfirmPassword('');
      setShowAccountModal(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour de vos informations.',
        variant: 'destructive'
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la déconnexion.',
        variant: 'destructive'
      });
    }
  };

  const createUser = async (data: { email: string; password: string; first_name: string; last_name: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${createUserType}s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          role: createUserType,
          is_active: true
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Erreur lors de la création ${createUserType === 'nanny' ? 'de la nounou' : 'du parent'}`)
      }

      toast({
        title: 'Succès',
        description: `${createUserType === 'nanny' ? 'La nounou' : 'Le parent'} a été créé avec succès.`
      })

      setShowCreateUserModal(false)
      if (createUserType === 'nanny') {
        fetchNannies()
      } else {
        fetchParents()
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : `Une erreur est survenue lors de la création ${createUserType === 'nanny' ? 'de la nounou' : 'du parent'}.`,
        variant: 'destructive'
      })
    }
  }

  const updateUser = async (userId: string, data: { email: string; first_name: string; last_name: string; password?: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Erreur lors de la mise à jour ${selectedUser?.type === 'nanny' ? 'de la nounou' : 'du parent'}`)
      }

      toast({
        title: 'Succès',
        description: `Les informations ont été mises à jour avec succès.`
      })

      setSelectedUser(null)
      if (selectedUser?.type === 'nanny') {
        fetchNannies()
      } else {
        fetchParents()
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : `Une erreur est survenue lors de la mise à jour ${selectedUser?.type === 'nanny' ? 'de la nounou' : 'du parent'}.`,
        variant: 'destructive'
      })
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token')}`
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Erreur lors de la suppression ${selectedUser?.type === 'nanny' ? 'de la nounou' : 'du parent'}`)
      }

      toast({
        title: 'Succès',
        description: `${selectedUser?.type === 'nanny' ? 'La nounou' : 'Le parent'} a été supprimé avec succès.`
      })

      setSelectedUser(null)
      if (selectedUser?.type === 'nanny') {
        fetchNannies()
      } else {
        fetchParents()
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : `Une erreur est survenue lors de la suppression ${selectedUser?.type === 'nanny' ? 'de la nounou' : 'du parent'}.`,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#4B0082]">Tableau de bord administrateur</h1>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-auto rounded-full flex items-center gap-2">
                    <User className="h-5 w-5 text-[#4B0082]" />
                    <span className="text-sm font-medium text-[#4B0082]">{user?.email}</span>
                    <ChevronDown className="h-4 w-4 text-[#4B0082]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 shadow-lg" align="end" forceMount>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowAccountModal(true)} className="text-[#4B0082] hover:bg-[#4B0082]/10">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon compte</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-[#4B0082] hover:bg-[#4B0082]/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-[#4B0082]/20">
          <nav className="-mb-px flex space-x-8">
            <TabButton
              isActive={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            >
              Gestion des utilisateurs
            </TabButton>
            <TabButton
              isActive={activeTab === 'customization'}
              onClick={() => setActiveTab('customization')}
            >
              Customisation
            </TabButton>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="mt-6">
          <TabContent isActive={activeTab === 'users'}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Tabs defaultValue="managers" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="managers" className="text-[#4B0082]">Gestionnaires</TabsTrigger>
                  <TabsTrigger value="nannies" className="text-[#4B0082]">Nounous</TabsTrigger>
                  <TabsTrigger value="parents" className="text-[#4B0082]">Parents</TabsTrigger>
                </TabsList>
                <TabsContent value="managers" className="mt-6">
                  <div className="space-y-4">
                    <Card className="p-6 border-[#4B0082]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-[#4B0082]">Liste des gestionnaires</h2>
                        <Button 
                          onClick={() => setShowCreateModal(true)}
                          className="bg-[#4B0082] hover:bg-[#4B0082]/90 shadow-md hover:shadow-lg transition-all duration-200 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un gestionnaire
                        </Button>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B0082]"></div>
                        </div>
                      ) : managers.length === 0 ? (
                        <div className="text-center py-8 text-[#4B0082]/70">
                          <p>Aucun gestionnaire n'a été créé.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {managers.map((manager) => (
                            <div
                              key={manager.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#4B0082]/5 border-[#4B0082]/20 transition-all duration-200 hover:shadow-md"
                            >
                              <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                  <User className="h-5 w-5 text-[#4B0082]" />
                                  <p className="font-medium text-[#4B0082]">
                                    {manager.first_name} {manager.last_name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Mail className="h-4 w-4 text-[#4B0082]/70" />
                                  <p className="text-sm text-[#4B0082]/70">{manager.email}</p>
                                </div>
                                <p className="text-xs text-[#4B0082]/60 mt-1">
                                  Créé le {new Date(manager.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-[#4B0082]/10 transition-colors duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedManager(manager);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4 text-[#4B0082]" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-red-100 transition-colors duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce gestionnaire ?')) {
                                      deleteManager(manager.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="nannies" className="mt-6">
                  <div className="space-y-4">
                    <Card className="p-6 border-[#4B0082]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-[#4B0082]">Liste des nounous</h2>
                        <Button 
                          onClick={() => {
                            setCreateUserType('nanny')
                            setShowCreateUserModal(true)
                          }}
                          className="bg-[#4B0082] hover:bg-[#4B0082]/90 shadow-md hover:shadow-lg transition-all duration-200 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une nounou
                        </Button>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B0082]"></div>
                        </div>
                      ) : nannies.length === 0 ? (
                        <div className="text-center py-8 text-[#4B0082]/70">
                          <p>Aucune nounou n'a été créée.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {nannies.map((nanny) => (
                            <div
                              key={nanny.id}
                              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-[#4B0082]/5 border-[#4B0082]/20 transition-all duration-200 hover:shadow-md"
                              onClick={() => setSelectedUser({ ...nanny, type: 'nanny' })}
                            >
                              <div>
                                <p className="font-medium text-[#4B0082]">{nanny.first_name} {nanny.last_name}</p>
                                <p className="text-sm text-[#4B0082]/70">{nanny.email}</p>
                                <p className="text-sm text-[#4B0082]/70">
                                  Créée le {new Date(nanny.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-[#4B0082]/10 transition-colors duration-200"
                              >
                                <Edit2 className="h-4 w-4 text-[#4B0082]" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="parents" className="mt-6">
                  <div className="space-y-4">
                    <Card className="p-6 border-[#4B0082]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-[#4B0082]">Liste des parents</h2>
                        <Button 
                          onClick={() => {
                            setCreateUserType('parent')
                            setShowCreateUserModal(true)
                          }}
                          className="bg-[#4B0082] hover:bg-[#4B0082]/90 shadow-md hover:shadow-lg transition-all duration-200 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un parent
                        </Button>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B0082]"></div>
                        </div>
                      ) : parents.length === 0 ? (
                        <div className="text-center py-8 text-[#4B0082]/70">
                          <p>Aucun parent n'a été créé.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {parents.map((parent) => (
                            <div
                              key={parent.id}
                              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-[#4B0082]/5 border-[#4B0082]/20 transition-all duration-200 hover:shadow-md"
                              onClick={() => setSelectedUser({ ...parent, type: 'parent' })}
                            >
                              <div>
                                <p className="font-medium text-[#4B0082]">{parent.first_name} {parent.last_name}</p>
                                <p className="text-sm text-[#4B0082]/70">{parent.email}</p>
                                <p className="text-sm text-[#4B0082]/70">
                                  Créé le {new Date(parent.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-[#4B0082]/10 transition-colors duration-200"
                              >
                                <Edit2 className="h-4 w-4 text-[#4B0082]" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabContent>

          <TabContent isActive={activeTab === 'customization'}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#4B0082] mb-4">Customisation de l'application</h2>
              <div className="space-y-6">
                {/* Sélection du thème */}
                <div>
                  <h3 className="text-md font-medium text-[#4B0082] mb-3">Thème de l'application</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ThemeButton
                      themeName="Classique"
                      isActive={currentTheme === 'default'}
                      onClick={() => setTheme('default')}
                      colors={{
                        primary: themes.default.colors.primary.main,
                        secondary: themes.default.colors.secondary.main,
                        background: themes.default.colors.background.default,
                      }}
                    />
                    <ThemeButton
                      themeName="Sombre"
                      isActive={currentTheme === 'dark'}
                      onClick={() => setTheme('dark')}
                      colors={{
                        primary: themes.dark.colors.primary.main,
                        secondary: themes.dark.colors.secondary.main,
                        background: themes.dark.colors.background.default,
                      }}
                    />
                    <ThemeButton
                      themeName="Pastel"
                      isActive={currentTheme === 'pastel'}
                      onClick={() => setTheme('pastel')}
                      colors={{
                        primary: themes.pastel.colors.primary.main,
                        secondary: themes.pastel.colors.secondary.main,
                        background: themes.pastel.colors.background.default,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabContent>
        </div>
      </div>

      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl transform transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#4B0082]">Modifier mon compte</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAccountModal(false)} className="hover:bg-[#4B0082]/10 transition-colors duration-200">
                <X className="h-4 w-4 text-[#4B0082]" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="adminEmail" className="text-[#4B0082]">Nouvel email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
                />
              </div>
              <div>
                <Label htmlFor="adminPassword" className="text-[#4B0082]">Mot de passe actuel</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
                />
              </div>
              <div>
                <Label htmlFor="adminNewPassword" className="text-[#4B0082]">Nouveau mot de passe</Label>
                <Input
                  id="adminNewPassword"
                  type="password"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-[#4B0082]">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-[#4B0082]/20 focus:border-[#4B0082] focus:ring-[#4B0082] transition-colors duration-200"
                />
              </div>
              <Button 
                onClick={updateAdminCredentials}
                className="bg-[#4B0082] hover:bg-[#4B0082]/90 shadow-md hover:shadow-lg transition-all duration-200 w-full text-white"
              >
                Mettre à jour mes informations
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          type={selectedUser.type}
          onClose={() => setSelectedUser(null)}
          onUpdate={updateUser}
          onDelete={deleteUser}
        />
      )}

      {showCreateUserModal && (
        <CreateUserModal
          type={createUserType}
          onClose={() => setShowCreateUserModal(false)}
          onCreate={createUser}
        />
      )}

      {showCreateModal && (
        <CreateManagerModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createManager}
        />
      )}
    </div>
  )
} 