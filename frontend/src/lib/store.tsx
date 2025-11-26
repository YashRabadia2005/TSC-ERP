import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---

export type Role = "Admin" | "Manager" | "Operator" | "Accountant" | "Supervisor" | "Quality Control";

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface RolePermissions {
  [role: string]: string[]; // Array of permission IDs
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: "Active" | "Inactive";
  password?: string; // In a real app, this would be hashed. Here for mockup auth.
  avatar?: string;
}

export interface AttendanceRecord {
  id: number;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  hours: number;
  method: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  roles: Role[];
  rolePermissions: RolePermissions;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, "id" | "status">) => void;
  updateUser: (id: number, data: Partial<User>) => void;
  deleteUser: (id: number) => void;
  toggleUserStatus: (id: number) => void;
  updateRolePermissions: (role: Role, permissionIds: string[]) => void;
  availablePermissions: Permission[];
  hasPermission: (permissionId: string) => boolean;
  attendance: AttendanceRecord[];
  checkIn: () => void;
  checkOut: () => void;
  updateAttendance: (records: AttendanceRecord[]) => void;
}

// --- Default Data ---

export const MODULES_LIST = [
  "Dashboard",
  "HRMS",
  "Products",
  "Inventory",
  "Sales",
  "Purchases",
  "Customers",
  "Accounting",
  "Logistics",
  "System",
] as const;

export const ACTIONS_LIST = ["View", "Create", "Edit", "Delete", "Approve"] as const;

// Generate permissions
const DEFAULT_PERMISSIONS: Permission[] = MODULES_LIST.flatMap(module => 
  ACTIONS_LIST.map(action => ({
    id: `${module.toLowerCase()}_${action.toLowerCase()}`,
    name: `${action} ${module}`,
    description: `Allow ${action.toLowerCase()} access to ${module}`,
    module: module
  }))
);

const DEFAULT_ROLES: Role[] = ["Admin", "Manager", "Operator", "Accountant", "Supervisor", "Quality Control"];

// Helper to get all permissions for a module
const getModulePermissions = (module: string, actions: string[]) => 
  actions.map(action => `${module.toLowerCase()}_${action.toLowerCase()}`);

const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  "Admin": DEFAULT_PERMISSIONS.map(p => p.id), // Admin has everything
  "Manager": [
    ...getModulePermissions("Dashboard", ["View"]),
    ...getModulePermissions("HRMS", ["View", "Create", "Edit", "Approve"]),
    ...getModulePermissions("Sales", ["View", "Create", "Edit", "Approve"]),
    ...getModulePermissions("Inventory", ["View", "Create", "Edit", "Approve"]),
    ...getModulePermissions("Customers", ["View", "Create", "Edit"]),
  ],
  "Operator": [
    ...getModulePermissions("Dashboard", ["View"]),
    ...getModulePermissions("Inventory", ["View", "Create"]),
    ...getModulePermissions("Logistics", ["View", "Create"]),
  ],
  "Accountant": [
    ...getModulePermissions("Dashboard", ["View"]),
    ...getModulePermissions("Sales", ["View"]),
    ...getModulePermissions("Accounting", ["View", "Create", "Edit"]),
    ...getModulePermissions("Purchases", ["View", "Create", "Edit"]),
  ],
  "Supervisor": [
    ...getModulePermissions("Dashboard", ["View"]),
    ...getModulePermissions("Inventory", ["View", "Edit", "Approve"]),
    ...getModulePermissions("HRMS", ["View"]),
  ],
  "Quality Control": [
    ...getModulePermissions("Dashboard", ["View"]),
    ...getModulePermissions("Products", ["View", "Edit"]),
    ...getModulePermissions("Inventory", ["View"]),
  ],
};

const DEFAULT_USERS: User[] = [
  { id: 1, name: "Super Admin", email: "admin@tassos.com", password: "123456", role: "Admin", department: "IT", status: "Active", avatar: "https://github.com/shadcn.png" },
  { id: 2, name: "Sarah Johnson", email: "sarah@tassos.com", password: "123456", role: "Manager", department: "Engineering", status: "Active" },
  { id: 3, name: "Michael Chen", email: "michael@tassos.com", password: "123456", role: "Operator", department: "Product", status: "Active" },
  { id: 4, name: "Jessica Williams", email: "jessica@tassos.com", password: "123456", role: "Operator", department: "Human Resources", status: "Active" },
  { id: 5, name: "David Miller", email: "david@tassos.com", password: "123456", role: "Accountant", department: "Sales", status: "Active" },
  { id: 6, name: "Emily Davis", email: "emily@tassos.com", password: "123456", role: "Supervisor", department: "Marketing", status: "Active" },
];

// --- Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or defaults
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(() => {
    const saved = localStorage.getItem('rolePermissions');
    return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [
      { id: 1, employeeId: "EMP001", date: "2025-11-26", checkIn: "08:45", checkOut: "17:30", hours: 8.75, method: "Biometric", location: "New York Office - Main Entrance" },
      { id: 2, employeeId: "EMP002", date: "2025-11-26", checkIn: "09:00", checkOut: "17:45", hours: 8.75, method: "Web Check-in", location: "San Francisco Office - Remote" },
      { id: 3, employeeId: "EMP003", date: "2025-11-26", checkIn: "08:30", checkOut: "17:00", hours: 8.5, method: "Mobile App", location: "Boston Office - Conference Room" },
      { id: 4, employeeId: "EMP004", date: "2025-11-26", checkIn: "08:55", checkOut: "17:20", hours: 8.42, method: "Biometric", location: "Chicago Office - Main Gate" },
      { id: 5, employeeId: "EMP005", date: "2025-11-26", checkIn: "09:10", checkOut: "18:00", hours: 8.83, method: "Mobile App", location: "Los Angeles Office - Parking Lot" },
    ];
  });

  // Persist state changes
  useEffect(() => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        const isValid = foundUser && foundUser.password === password;
        
        if (isValid && foundUser) {
          if (foundUser.status === "Inactive") {
            resolve(false);
            return;
          }
          setUser(foundUser);
          resolve(true);
        } else {
          console.log("Login failed - user:", foundUser?.email, "password match:", foundUser?.password === password);
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (userData: Omit<User, "id" | "status">) => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      status: "Active",
      password: "123456",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: number, data: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
    // If updating current user, update session too
    if (user && user.id === id) {
      setUser({ ...user, ...data });
    }
  };

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "Active" ? "Inactive" : "Active" };
      }
      return u;
    }));
  };

  const deleteUser = (id: number) => {
    // For this mockup, we'll just remove it from the array
    setUsers(users.filter(u => u.id !== id));
  };

  const updateRolePermissions = (role: Role, permissionIds: string[]) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: permissionIds
    }));
  };

  const hasPermission = (permissionId: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permissionId);
  };

  const checkIn = () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const empId = `EMP${String(user.id).padStart(3, "0")}`;
    const existingRecord = attendance.find(a => a.employeeId === empId && a.date === today);
    
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    if (existingRecord) {
      setAttendance(attendance.map(a => 
        a.id === existingRecord.id 
          ? { ...a, checkIn: checkInTime }
          : a
      ));
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.max(...attendance.map(a => a.id), 0) + 1,
        employeeId: empId,
        date: today,
        checkIn: checkInTime,
        checkOut: null,
        hours: 0,
        method: "Web Check-in",
        location: user.department || "Office"
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  const checkOut = () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const empId = `EMP${String(user.id).padStart(3, "0")}`;
    const record = attendance.find(a => a.employeeId === empId && a.date === today);
    
    if (!record) return;
    
    const now = new Date();
    const checkOutTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    const [checkInHour, checkInMin] = record.checkIn.split(":").map(Number);
    const [checkOutHour, checkOutMin] = checkOutTime.split(":").map(Number);
    const totalMinutes = (checkOutHour * 60 + checkOutMin) - (checkInHour * 60 + checkInMin);
    const hours = parseFloat((totalMinutes / 60).toFixed(2));
    
    setAttendance(attendance.map(a => 
      a.id === record.id 
        ? { ...a, checkOut: checkOutTime, hours }
        : a
    ));
  };

  const updateAttendance = (records: AttendanceRecord[]) => {
    setAttendance(records);
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      roles: DEFAULT_ROLES,
      rolePermissions,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      toggleUserStatus,
      updateRolePermissions,
      availablePermissions: DEFAULT_PERMISSIONS,
      hasPermission,
      attendance,
      checkIn,
      checkOut,
      updateAttendance
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
