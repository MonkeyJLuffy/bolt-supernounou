import { User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export function UserDropdown() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin', { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-auto rounded-full flex items-center gap-2">
          <User className="h-5 w-5 text-[#4B0082]" />
          <span className="text-sm font-medium text-[#4B0082]">{user?.email}</span>
          <ChevronDown className="h-4 w-4 text-[#4B0082]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-[#4B0082] hover:bg-[#4B0082]/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 