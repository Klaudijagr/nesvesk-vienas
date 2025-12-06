'use client';

import type { User } from '@/lib/types';

// Simple client-side auth storage (in a real app, use proper auth like NextAuth or Supabase)
export function setCurrentUser(user: User) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

export function updateCurrentUser(updates: Partial<User>) {
  const current = getCurrentUser();
  if (current) {
    const updated = { ...current, ...updates };
    setCurrentUser(updated);
    return updated;
  }
  return null;
}

// Mock user database (in a real app, this would be a backend API)
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const usersStr = localStorage.getItem('allUsers');
  if (!usersStr) return [];
  try {
    return JSON.parse(usersStr);
  } catch {
    return [];
  }
}

export function saveUser(user: User) {
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('allUsers', JSON.stringify(users));
}

export function findUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}
