import React from 'react';
import { User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useNavigate } from 'react-router-dom';

export function UserDropdown() {
  const { user, signOut } = useAuthStore();
  const { currentTheme, themes } = useThemeStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-auto rounded-full flex items-center gap-2">
          <User className={`h-5 w-5 text-[${themes[currentTheme].colors.primary.main}]`} />
          <span className={`text-sm font-medium text-[${themes[currentTheme].colors.primary.main}]`}>
            {user?.firstName} {user?.lastName}
          </span>
          <ChevronDown className={`h-4 w-4 text-[${themes[currentTheme].colors.primary.main}]`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-lg bg-white" align="end" forceMount>
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className={`text-[${themes[currentTheme].colors.primary.main}] hover:bg-[${themes[currentTheme].colors.primary.main}] hover:text-white`}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className={`text-[${themes[currentTheme].colors.primary.main}] hover:bg-[${themes[currentTheme].colors.primary.main}] hover:text-white`}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 