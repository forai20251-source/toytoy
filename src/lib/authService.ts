import { AdminUser, AdminPermission } from '../types';
import { INITIAL_ADMIN_USERS } from '../data/authData';

const AUTH_USER_KEY = 'toyland_logged_admin';
const ALL_USERS_KEY = 'toyland_admin_users_list_v1';

export async function loginAdminApi(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      saveSessionUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'اطلاعات ورود نادرست است' };
  } catch (err) {
    // Fallback to local user check if offline or server is temporarily unreachable
    console.warn('[Auth] Server API login failed, checking client fallback:', err);
    return loginAdminLocal(username, password);
  }
}

function loginAdminLocal(username: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  let users: AdminUser[] = INITIAL_ADMIN_USERS;
  try {
    const saved = localStorage.getItem(ALL_USERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) users = parsed;
    }
  } catch {
    // ignore
  }

  const cleanUser = username.toLowerCase().trim();
  const user = users.find(u => u.username.toLowerCase() === cleanUser);
  if (!user) {
    return { success: false, error: 'نام کاربری یا کلمه عبور نادرست است' };
  }

  if (!user.isActive) {
    return { success: false, error: 'این حساب کاربری غیرفعال شده است' };
  }

  const expectedPass = user.password || (user.username === 'admin' ? 'admin' : '123');
  if (password !== expectedPass) {
    return { success: false, error: 'رمز عبور وارد شده نادرست است' };
  }

  user.lastLogin = new Date().toLocaleDateString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  saveSessionUser(user);
  return { success: true, user };
}

export function getSessionUser(): AdminUser | null {
  try {
    const item = localStorage.getItem(AUTH_USER_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveSessionUser(user: AdminUser): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearSessionUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}

// Aliases for convenience
export const getStoredAdminUser = getSessionUser;
export const logoutAdmin = clearSessionUser;

export function hasPermission(user: AdminUser | null, permission: AdminPermission): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
}

// User CRUD API
export async function fetchAllUsersApi(): Promise<AdminUser[]> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch (err) {
    console.warn('[Auth] Error fetching users from server, falling back to local storage:', err);
  }

  try {
    const saved = localStorage.getItem(ALL_USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return INITIAL_ADMIN_USERS;
}

export async function createAdminUserApi(user: Partial<AdminUser> & { username: string; fullName: string; password?: string }): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'خطا در ثبت کاربر' };
  } catch (err) {
    return { success: false, error: 'عدم دسترسی به سرور' };
  }
}

export async function updateAdminUserApi(id: string, updates: Partial<AdminUser>): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'خطا در ویرایش کاربر' };
  } catch (err) {
    return { success: false, error: 'عدم دسترسی به سرور' };
  }
}

export async function deleteAdminUserApi(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true };
    }
    return { success: false, error: data.error || 'خطا در حذف کاربر' };
  } catch (err) {
    return { success: false, error: 'عدم دسترسی به سرور' };
  }
}
