import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';
import { Heart, X, Upload } from 'lucide-react';

interface ChildFormData {
  firstName: string;
  lastName: string;
  photo: File | null;
  photoPreview: string | null;
}

interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hasSecondParent: boolean;
  secondParentFirstName?: string;
  secondParentLastName?: string;
  secondParentEmail?: string;
  secondParentPhone?: string;
  children: {
    firstName: string;
    lastName: string;
    photo: File | null;
    photoPreview: string | null;
  }[];
  address: string;
}

interface NounouFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  phone: string;
  email: string;
  photo: File | null;
  photoPreview: string | null;
}

export function CreateAccountForm() {
  const [userType, setUserType] = useState<'parent' | 'nounou'>('parent');
  const [nounouData, setNounouData] = useState<NounouFormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    address: '',
    phone: '',
    email: '',
    photo: null,
    photoPreview: null,
  });
  const [parentData, setParentData] = useState<ParentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hasSecondParent: false,
    secondParentFirstName: '',
    secondParentLastName: '',
    secondParentEmail: '',
    secondParentPhone: '',
    children: [{
      firstName: '',
      lastName: '',
      photo: null,
      photoPreview: null,
    }],
    address: '',
  });
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === 'parent') {
        await signUp(
          parentData.email,
          password,
          'parent',
          parentData.firstName,
          parentData.lastName
        );
      } else {
        await signUp(
          nounouData.email,
          password,
          'nounou',
          nounouData.firstName,
          nounouData.lastName
        );
      }
      navigate('/tableau-de-bord');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  const handleNounouPhotoChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNounouData({
        ...nounouData,
        photo: file,
        photoPreview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChildPhotoChange = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedChildren = [...parentData.children];
      updatedChildren[index] = {
        ...updatedChildren[index],
        photo: file,
        photoPreview: reader.result as string,
      };
      setParentData({
        ...parentData,
        children: updatedChildren,
      });
    };
    reader.readAsDataURL(file);
  };

  const addChild = () => {
    setParentData({
      ...parentData,
      children: [
        ...parentData.children,
        {
          firstName: '',
          lastName: '',
          photo: null,
          photoPreview: null,
        },
      ],
    });
  };

  const removeChild = (index: number) => {
    const updatedChildren = parentData.children.filter((_, i) => i !== index);
    setParentData({
      ...parentData,
      children: updatedChildren,
    });
  };

  const updateChild = (index: number, field: 'firstName' | 'lastName', value: string) => {
    const updatedChildren = [...parentData.children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    setParentData({
      ...parentData,
      children: updatedChildren,
    });
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
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6 text-center">Bienvenue sur Super Nounou</h2>
          <p className="text-white text-base sm:text-xl text-center max-w-md">
            La plateforme qui simplifie la gestion de garde d'enfants entre parents et nounous.
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-4xl">
            <div className="space-y-3 sm:space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Demande de création de compte</h2>
                  <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">Veuillez remplir le formulaire correspondant à votre profil</p>
                </div>
                <button
                  onClick={() => navigate('/signin')}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex bg-gray-50 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setUserType('parent')}
                  className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base ${
                    userType === 'parent'
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <span className="text-sm sm:text-lg">👤</span>
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('nounou')}
                  className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base ${
                    userType === 'nounou'
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <span className="text-sm sm:text-lg">👤</span>
                  Nounou
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {userType === 'nounou' ? (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-8">
                    <div className="w-full sm:w-1/3">
                      <div className="aspect-square w-full max-w-[150px] mx-auto sm:max-w-none bg-gray-100 rounded-xl overflow-hidden relative">
                        {nounouData.photoPreview ? (
                          <img
                            src={nounouData.photoPreview}
                            alt={`Photo de ${nounouData.firstName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <Upload size={20} className="sm:w-8 sm:h-8" />
                            <span className="mt-1 sm:mt-2 text-xs sm:text-sm">Photo d'identité</span>
                          </div>
                        )}
                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleNounouPhotoChange(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                            Prénom
                          </label>
                          <input
                            type="text"
                            placeholder="Prénom"
                            value={nounouData.firstName}
                            onChange={(e) =>
                              setNounouData({ ...nounouData, firstName: e.target.value })
                            }
                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            placeholder="Nom"
                            value={nounouData.lastName}
                            onChange={(e) =>
                              setNounouData({ ...nounouData, lastName: e.target.value })
                            }
                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                            Date de naissance
                          </label>
                          <input
                            type="date"
                            value={nounouData.birthDate}
                            onChange={(e) =>
                              setNounouData({ ...nounouData, birthDate: e.target.value })
                            }
                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                            Lieu de naissance
                          </label>
                          <input
                            type="text"
                            placeholder="Ville de naissance"
                            value={nounouData.birthPlace}
                            onChange={(e) =>
                              setNounouData({ ...nounouData, birthPlace: e.target.value })
                            }
                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                          Adresse
                        </label>
                        <input
                          type="text"
                          placeholder="Adresse complète"
                          value={nounouData.address}
                          onChange={(e) =>
                            setNounouData({ ...nounouData, address: e.target.value })
                          }
                          className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          placeholder="Numéro de téléphone"
                          value={nounouData.phone}
                          onChange={(e) =>
                            setNounouData({ ...nounouData, phone: e.target.value })
                          }
                          className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="votre@email.com"
                          value={nounouData.email}
                          onChange={(e) =>
                            setNounouData({ ...nounouData, email: e.target.value })
                          }
                          className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-6">
                    <div>
                      <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Parent 1</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                              Prénom
                            </label>
                            <input
                              type="text"
                              placeholder="Prénom"
                              value={parentData.firstName}
                              onChange={(e) =>
                                setParentData({ ...parentData, firstName: e.target.value })
                              }
                              className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                              Nom
                            </label>
                            <input
                              type="text"
                              placeholder="Nom"
                              value={parentData.lastName}
                              onChange={(e) =>
                                setParentData({ ...parentData, lastName: e.target.value })
                              }
                              className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              placeholder="votre@email.com"
                              value={parentData.email}
                              onChange={(e) =>
                                setParentData({ ...parentData, email: e.target.value })
                              }
                              className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              placeholder="Numéro de téléphone"
                              value={parentData.phone}
                              onChange={(e) =>
                                setParentData({ ...parentData, phone: e.target.value })
                              }
                              className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 mb-3 sm:mb-4">
                        <input
                          type="checkbox"
                          checked={parentData.hasSecondParent}
                          onChange={(e) =>
                            setParentData({ ...parentData, hasSecondParent: e.target.checked })
                          }
                          className="rounded text-[#7ECBC3] focus:ring-[#7ECBC3]"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">Parent 2 (optionnel)</span>
                      </label>

                      {parentData.hasSecondParent && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                                Prénom
                              </label>
                              <input
                                type="text"
                                placeholder="Prénom"
                                value={parentData.secondParentFirstName}
                                onChange={(e) =>
                                  setParentData({
                                    ...parentData,
                                    secondParentFirstName: e.target.value,
                                  })
                                }
                                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                                required={parentData.hasSecondParent}
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                                Nom
                              </label>
                              <input
                                type="text"
                                placeholder="Nom"
                                value={parentData.secondParentLastName}
                                onChange={(e) =>
                                  setParentData({
                                    ...parentData,
                                    secondParentLastName: e.target.value,
                                  })
                                }
                                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                                required={parentData.hasSecondParent}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                placeholder="votre@email.com"
                                value={parentData.secondParentEmail}
                                onChange={(e) =>
                                  setParentData({
                                    ...parentData,
                                    secondParentEmail: e.target.value,
                                  })
                                }
                                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                                required={parentData.hasSecondParent}
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                                Téléphone
                              </label>
                              <input
                                type="tel"
                                placeholder="Numéro de téléphone"
                                value={parentData.secondParentPhone}
                                onChange={(e) =>
                                  setParentData({
                                    ...parentData,
                                    secondParentPhone: e.target.value,
                                  })
                                }
                                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                                required={parentData.hasSecondParent}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900">Enfants</h3>
                        <button
                          type="button"
                          onClick={addChild}
                          className="text-xs sm:text-sm text-[#7ECBC3] hover:text-[#7ECBC3]/80 font-medium"
                        >
                          + Ajouter un enfant
                        </button>
                      </div>

                      {parentData.children.map((child, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-4">
                          <div className="w-full sm:w-1/3">
                            <div className="aspect-square w-full max-w-[150px] mx-auto sm:max-w-none bg-gray-100 rounded-xl overflow-hidden relative">
                              {child.photoPreview ? (
                                <img
                                  src={child.photoPreview}
                                  alt={`Photo de ${child.firstName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                  <Upload size={20} className="sm:w-8 sm:h-8" />
                                  <span className="mt-1 sm:mt-2 text-xs sm:text-sm">Photo de l'enfant</span>
                                </div>
                              )}
                              <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleChildPhotoChange(index, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex-1 space-y-3 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                                  Prénom de l'enfant
                                </label>
                                <input
                                  type="text"
                                  placeholder="Prénom"
                                  value={child.firstName}
                                  onChange={(e) => updateChild(index, 'firstName', e.target.value)}
                                  className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                                  Nom de l'enfant
                                </label>
                                <input
                                  type="text"
                                  placeholder="Nom"
                                  value={child.lastName}
                                  onChange={(e) => updateChild(index, 'lastName', e.target.value)}
                                  className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                                  required
                                />
                              </div>
                            </div>

                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeChild(index)}
                                className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium"
                              >
                                Supprimer cet enfant
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                        Adresse complète
                      </label>
                      <input
                        type="text"
                        placeholder="Adresse complète"
                        value={parentData.address}
                        onChange={(e) =>
                          setParentData({ ...parentData, address: e.target.value })
                        }
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#7ECBC3] focus:border-[#7ECBC3] placeholder-gray-400 text-xs sm:text-base"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7ECBC3] text-white py-2 sm:py-3 rounded-lg hover:bg-[#6BA59E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Chargement...' : 'Créer le compte'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/signin')}
                  className="text-[#7ECBC3] hover:underline"
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}