import { UserButton } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '../../convex/_generated/api';

export function TopBar() {
  const navigate = useNavigate();
  const unreadCount = useQuery(api.messages.getUnreadCount) ?? 0;
  const pendingInvites = useQuery(api.invitations.getPendingCount) ?? 0;
  const [searchQuery, setSearchQuery] = useState('');

  const totalNotifications = unreadCount + pendingInvites;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-6">
        {/* Search */}
        <form className="max-w-md flex-1" onSubmit={handleSearch}>
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-muted/50 pl-10"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hosts, guests, or cities..."
              type="search"
              value={searchQuery}
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3">
          {/* Notifications */}
          <Button
            className="relative"
            onClick={() => navigate('/dashboard?tab=invitations')}
            size="icon"
            variant="ghost"
          >
            <Bell className="h-5 w-5" />
            {totalNotifications > 0 && (
              <span className="-top-1 -right-1 absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 font-medium text-white text-xs">
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
