import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  Search, 
  ShieldAlert,
  UserCheck,
  UserX,
  Lock,
  RefreshCw,
  Info
} from 'lucide-react';
import { AdminUser, UserRole, AdminPermission } from '../../types';
import { 
  ROLE_DEFINITIONS, 
  PERMISSION_DEFINITIONS, 
  DEFAULT_ROLE_PERMISSIONS 
} from '../../data/authData';
import { 
  fetchAllUsersApi, 
  createAdminUserApi, 
  updateAdminUserApi, 
  deleteAdminUserApi 
} from '../../lib/authService';

interface UserManagementTabProps {
  currentUser: AdminUser;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer');
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([]);
  const [isActive, setIsActive] = useState(true);

  const canManageUsers = currentUser.role === 'super_admin' || (currentUser.permissions && currentUser.permissions.includes('manage_users'));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await fetchAllUsersApi();
    setUsers(list);
    setLoading(false);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    // Preset permissions from role definition
    setSelectedPermissions(DEFAULT_ROLE_PERMISSIONS[newRole] || []);
  };

  const togglePermission = (permId: AdminPermission) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const handleSelectAllPermissions = () => {
    const all = Object.keys(PERMISSION_DEFINITIONS) as AdminPermission[];
    setSelectedPermissions(all);
  };

  const handleDeselectAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setUsername('');
    setFullName('');
    setEmail('');
    setPassword('');
    setSelectedRole('viewer');
    setSelectedPermissions(DEFAULT_ROLE_PERMISSIONS['viewer'] || []);
    setIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditUserModal = (user: AdminUser) => {
    setEditingUser(user);
    setUsername(user.username);
    setFullName(user.fullName);
    setEmail(user.email || '');
    setPassword(''); // leave empty if not changing
    setSelectedRole(user.role);
    setSelectedPermissions(user.permissions || []);
    setIsActive(user.isActive !== false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim()) {
      setModalError('نام کاربری و نام کامل الزامی هستند.');
      return;
    }

    if (!editingUser && !password.trim()) {
      setModalError('رمز عبور برای کاربر جدید الزامی است.');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    const roleName = ROLE_DEFINITIONS[selectedRole]?.name || selectedRole;

    if (editingUser) {
      // Update
      const updates: Partial<AdminUser> = {
        fullName: fullName.trim(),
        email: email.trim(),
        role: selectedRole,
        roleName,
        permissions: selectedPermissions,
        isActive
      };
      if (password.trim()) {
        updates.password = password.trim();
      }

      const res = await updateAdminUserApi(editingUser.id, updates);
      if (res.success) {
        setActionSuccess('اطلاعات کاربر با موفقیت به‌روزرسانی شد.');
        setIsModalOpen(false);
        loadUsers();
      } else {
        setModalError(res.error || 'خطا در ویرایش کاربر');
      }
    } else {
      // Create
      const newUser = {
        username: username.trim().toLowerCase(),
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        role: selectedRole,
        roleName,
        permissions: selectedPermissions,
        isActive
      };

      const res = await createAdminUserApi(newUser);
      if (res.success) {
        setActionSuccess(`کاربر ${fullName} با موفقیت به سامانه افزوده شد.`);
        setIsModalOpen(false);
        loadUsers();
      } else {
        setModalError(res.error || 'خطا در ایجاد کاربر');
      }
    }
    setModalLoading(false);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (user.username === 'admin') {
      alert('امکان حذف مدیر ارشد اصلی وجود ندارد.');
      return;
    }
    if (user.id === currentUser.id) {
      alert('امکان حذف حساب کاربری جاری خودتان وجود ندارد.');
      return;
    }

    if (!confirm(`آیا از حذف حساب کاربری "${user.fullName}" (${user.username}) اطمینان دارید؟`)) {
      return;
    }

    const res = await deleteAdminUserApi(user.id);
    if (res.success) {
      setActionSuccess(`کاربر "${user.fullName}" با موفقیت حذف گردید.`);
      loadUsers();
      setTimeout(() => setActionSuccess(null), 4000);
    } else {
      alert(res.error || 'خطا در حذف کاربر');
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    if (user.username === 'admin') {
      alert('نمی‌توانید مدیر کل سیستم را غیرفعال کنید.');
      return;
    }

    const res = await updateAdminUserApi(user.id, {
      isActive: !user.isActive
    });
    if (res.success) {
      loadUsers();
    } else {
      alert(res.error || 'خطا در تغییر وضعیت کاربر');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Banner / Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>مدیریت کاربران و سطوح دسترسی (RBAC)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            کاربران پنل مدیریت و مجوزهای تفکیک‌شده
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            برای ورود به پنل، حساب‌های جداگانه با کلمه عبور اختصاصی بسازید و دسترسی به هر بخش (محصولات، پادکست‌ها، نظرات، تنظیمات و آمار) را تفکیک کنید.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={loadUsers}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="به‌روزرسانی فهرست"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {canManageUsers && (
            <button
              id="admin-add-user-btn"
              onClick={openNewUserModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>افزودن کاربر جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* Success alert */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Permission Matrix Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {Object.entries(ROLE_DEFINITIONS).map(([rKey, rDef]) => {
          const count = users.filter(u => u.role === rKey).length;
          return (
            <div 
              key={rKey} 
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {rDef.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {count} کاربر
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {rDef.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی کاربر بر اساس نام، نام کاربری یا ایمیل..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">فیلتر نقش:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden"
          >
            <option value="all">همه نقش‌ها</option>
            {Object.entries(ROLE_DEFINITIONS).map(([key, def]) => (
              <option key={key} value={key}>{def.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black text-slate-600 dark:text-slate-300">
                <th className="py-3.5 px-4">کاربر</th>
                <th className="py-3.5 px-4">نقش سیستمی</th>
                <th className="py-3.5 px-4">مجوزهای فعال</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4">آخرین ورود</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    هیچ کاربری با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleDef = ROLE_DEFINITIONS[u.role] || { name: u.role, color: 'bg-slate-500' };
                  const isCurrent = u.id === currentUser.id;
                  const isSuper = u.role === 'super_admin';

                  return (
                    <tr 
                      key={u.id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                        !u.isActive ? 'opacity-60 bg-slate-50/30 dark:bg-slate-900/40' : ''
                      }`}
                    >
                      {/* Name & username */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl ${roleDef.color} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                                  شما
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>@{u.username}</span>
                              {u.email && <span>• {u.email}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold text-white ${roleDef.color}`}>
                          <ShieldCheck className="w-3 h-3" />
                          <span>{roleDef.name}</span>
                        </span>
                      </td>

                      {/* Permissions preview */}
                      <td className="py-4 px-4 max-w-xs">
                        {isSuper ? (
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            دسترسی تام و نامحدود به تمامی بخش‌ها
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {(u.permissions || []).slice(0, 3).map((p) => {
                              const permDef = PERMISSION_DEFINITIONS.find(item => item.key === p);
                              return (
                                <span 
                                  key={p} 
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                                >
                                  {permDef?.label || p}
                                </span>
                              );
                            })}
                            {(u.permissions || []).length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                                +{(u.permissions || []).length - 3} مورد دیگر
                              </span>
                            )}
                            {(!u.permissions || u.permissions.length === 0) && (
                              <span className="text-[10px] text-slate-400">بدون مجوز اختصاصی</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="py-4 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>فعال</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>غیرفعال</span>
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="py-4 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                        {u.lastLogin || 'تاکنون وارد نشده'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {canManageUsers && (
                            <>
                              <button
                                onClick={() => openEditUserModal(u)}
                                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="ویرایش اطلاعات و دسترسی‌ها"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {u.username !== 'admin' && !isCurrent && (
                                <>
                                  <button
                                    onClick={() => handleToggleActive(u)}
                                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                      u.isActive 
                                        ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40' 
                                        : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                    }`}
                                    title={u.isActive ? 'غیرفعال کردن حساب' : 'فعال‌سازی مجدد'}
                                  >
                                    {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    title="حذف کاربر"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingUser ? `ویرایش کاربر: ${editingUser.fullName}` : 'ایجاد کاربر جدید با نقش و رمز عبور'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    تعیین دقیق سطح دسترسی به بخش‌های مختلف داشبورد
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    نام کاربری لاگین (Username)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!!editingUser}
                    placeholder="مثال: editor_reza"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 dir-ltr text-left"
                    required
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: رضا محمدی"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    آدرس ایمیل
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reza@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 dir-ltr text-left"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>کلمه عبور ورود</span>
                    {editingUser && <span className="text-[10px] text-slate-400">خالی بگذارید تا تغییر نکند</span>}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingUser ? 'تغییر رمز عبور (اختیاری)' : 'رمز عبور قوی وارد کنید'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 dir-ltr text-left"
                    required={!editingUser}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  انتخاب نقش کاربری پایه
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {Object.entries(ROLE_DEFINITIONS).map(([rKey, rDef]) => {
                    const isSelected = selectedRole === rKey;
                    return (
                      <button
                        key={rKey}
                        type="button"
                        onClick={() => handleRoleChange(rKey as UserRole)}
                        className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-500/10 shadow-xs' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{rDef.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {rDef.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>مجوزهای دسترسی تفکیک‌شده (Permissions)</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-amber-600 font-bold hover:underline cursor-pointer"
                    >
                      انتخاب همه
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllPermissions}
                      className="text-slate-400 hover:underline cursor-pointer"
                    >
                      عدم انتخاب
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {PERMISSION_DEFINITIONS.map((pDef) => {
                    const isChecked = selectedPermissions.includes(pDef.key);
                    return (
                      <label
                        key={pDef.key}
                        onClick={() => togglePermission(pDef.key)}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent label
                          className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {pDef.label}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            {pDef.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status active checkbox */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    وضعیت حساب کاربری
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    در صورت غیرفعال بودن، کاربر اجازه ورود به پنل را نخواهد داشت
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isActive ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  {modalLoading ? 'در حال ذخیره‌سازی...' : (editingUser ? 'ذخیره تغییرات کاربر' : 'ایجاد حساب کاربری')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
