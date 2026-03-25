import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, Settings, User } from 'lucide-react';
import { TezLogo } from '@/components/TezLogo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface AppHeaderProps {
  title: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function AppHeader({ title, showMenu, onMenuClick }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Get initial count
    supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('read', false)
      .then(({ count }) => setNotificationCount(count || 0));

    // Subscribe to notifications
    const subscription = supabase
      .from('notifications')
      .on('*', (payload) => {
        if (payload.new.user_id === user.id && !payload.new.read) {
          setNotificationCount((prev) => prev + 1);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userName = user?.user_metadata?.name || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showMenu && (
            <button onClick={onMenuClick} className="md:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="md:hidden"><TezLogo collapsed /></div>
          <h1 className="text-lg font-semibold hidden md:block">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/patient/profile')} className="gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/patient/profile')} className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
