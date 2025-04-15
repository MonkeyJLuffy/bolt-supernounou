import React, { useState } from 'react';
import { User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { ProfileModal } from '../profile/ProfileModal';

export function UserDropdown() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-auto rounded-full flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              {user?.firstName} {user?.lastName}
            </span>
            <ChevronDown className="h-4 w-4 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 shadow-lg bg-white" align="end" forceMount>
          <DropdownMenuItem 
            onClick={handleProfileClick}
            className="text-primary hover:bg-primary hover:text-white"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Mon compte</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="text-primary hover:bg-primary hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
} 