import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface SignUpFormProps {
  onClose: () => void;
}

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

export function SignUpForm({ onClose }: SignUpFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'inscription
    console.log({
      userType,
      nounouData,
      parentData,
    });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-3 sm:p-8 max-w-4xl w-full my-2 sm:my-4">
        <div className="space-y-3 sm:space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Demande de création de compte</h2>
              <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">Veuillez remplir le formulaire correspondant à votre profil</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex gap-1 sm:gap-4 bg-gray-50 p-1 rounded-lg">
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

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
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
                        type="text"
                        placeholder="jj/mm/aaaa"
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

                <div className="space-y-3 sm:space-y-6">
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
                    <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-8">
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
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#7ECBC3] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-[#7ECBC3]/90 transition-colors text-xs sm:text-base"
            >
              Soumettre la demande
            </button>
          </form>

          <div className="text-center text-xs sm:text-sm text-gray-600">
            Déjà un compte ?{' '}
            <button onClick={onClose} className="text-[#7ECBC3] hover:underline">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 