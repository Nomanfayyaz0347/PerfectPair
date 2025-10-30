import bcrypt from 'bcryptjs';

interface AdminUser {
  email: string;
  name: string;
  password: string; 
}

// In-memory admin storage
const adminUsers: AdminUser[] = [];

export class InMemoryAdminStorage {
  static async createAdmin(email: string, password: string, name: string = 'Admin User'): Promise<AdminUser> {
    // Check if admin already exists
    const existing = adminUsers.find(admin => admin.email === email);
    if (existing) {
      return existing;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin: AdminUser = {
      email,
      name,
      password: hashedPassword
    };
    
    adminUsers.push(admin);
    return admin;
  }
  
  static async findByEmail(email: string): Promise<AdminUser | null> {
    return adminUsers.find(admin => admin.email === email) || null;
  }
  
  static async verifyPassword(admin: AdminUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, admin.password);
  }
  
  static async initializeDefaultAdmin(): Promise<void> {
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@matchmaker.com';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'securepassword';
    
    await this.createAdmin(defaultEmail, defaultPassword, 'Default Admin');
  }
}