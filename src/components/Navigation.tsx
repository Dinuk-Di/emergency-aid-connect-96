
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, LogOut, User, UserCheck, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  // If there's no user, we render a more minimal header
  if (!currentUser) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-emergency-500" />
            <span className="text-xl font-bold">Emergency Aid Connect</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/report">
              <Button variant="outline" className="flex items-center gap-2 border-emergency-300 text-emergency-600 hover:bg-emergency-50">
                <AlertTriangle className="h-4 w-4" />
                Report Emergency
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-safety-500 hover:bg-safety-600">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Role-specific navigation
  let navItems = [
    { path: '/', label: 'Dashboard', access: [UserRole.USER, UserRole.FIRST_RESPONDER, UserRole.ADMIN] },
    { path: '/report', label: 'Report Emergency', access: [UserRole.USER, UserRole.FIRST_RESPONDER, UserRole.ADMIN] },
  ];

  // Add role-specific navigation items
  if (currentUser.role === UserRole.FIRST_RESPONDER || currentUser.role === UserRole.ADMIN) {
    navItems.push({ path: '/emergencies', label: 'All Emergencies', access: [UserRole.FIRST_RESPONDER, UserRole.ADMIN] });
  }

  if (currentUser.role === UserRole.ADMIN) {
    navItems.push(
      { path: '/users', label: 'Manage Users', access: [UserRole.ADMIN] },
      { path: '/settings', label: 'System Settings', access: [UserRole.ADMIN] }
    );
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => item.access.includes(currentUser.role));

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.FIRST_RESPONDER:
        return 'First Responder';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Users className="h-4 w-4" />;
      case UserRole.FIRST_RESPONDER:
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-emergency-500" />
            <span className="text-xl font-bold">Emergency Aid Connect</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-gray-600 hover:text-safety-600 font-medium",
                  isActive(item.path) && "text-safety-600 border-b-2 border-safety-500"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {getRoleIcon(currentUser.role)}
              <span>{getRoleLabel(currentUser.role)}</span>
            </div>

            <div className="text-sm font-medium">
              {currentUser.name}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-600 hover:text-emergency-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {mobileNavOpen && (
          <div className="md:hidden mt-4 border-t pt-4">
            <nav className="flex flex-col space-y-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-gray-600 hover:text-safety-600 font-medium py-2",
                    isActive(item.path) && "text-safety-600 bg-gray-50 px-2 rounded"
                  )}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t pt-4 mt-2 flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {getRoleIcon(currentUser.role)}
                    <span>{getRoleLabel(currentUser.role)}</span>
                  </div>
                  <div className="text-sm font-medium ml-2">
                    {currentUser.name}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  className="flex justify-start hover:bg-gray-100 gap-2 text-gray-600 hover:text-emergency-500"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
