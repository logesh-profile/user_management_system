const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const SALT_ROUNDS = 12;

const User = {
  async create(userData) {
    const { email, password, fullname, profileImage, profileImagePublicId, role } = userData;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: uuidv4(),
        email: email.toLowerCase(),
        password: hashedPassword,
        fullname,
        profile_image: profileImage,
        profile_image_public_id: profileImagePublicId,
        role: role || 'user',
        is_blocked: false
      })
      .select('id, fullname, email, profile_image, profile_image_public_id, role, is_blocked, last_login, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        const conflictError = new Error('Email already exists');
        conflictError.code = 'DUPLICATE_EMAIL';
        throw conflictError;
      }
      throw error;
    }

    return { ...data, toPublicJSON: () => this.toPublicJSON(data) };
  },

  async findById(id, includePassword = false) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('id', id);

    const { data, error } = await query.single();
    if (error) return null;

    if (!includePassword) {
      delete data.password;
    }

    return { ...data, toPublicJSON: () => this.toPublicJSON(data) };
  },

  async findByEmail(email, includePassword = false) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) return null;

    if (!includePassword) {
      delete data.password;
    }

    return { ...data, toPublicJSON: () => this.toPublicJSON(data) };
  },

  async findAll(options = {}) {
    const { page = 1, limit = 10, search = '', role = '', sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, fullname, email, profile_image, role, is_blocked, last_login, created_at, updated_at', { count: 'exact' });

    if (search) {
      query = query.or(`fullname.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      users: (data || []).map(user => ({ ...user, toPublicJSON: () => this.toPublicJSON(user) })),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  },

  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, fullname, email, profile_image, profile_image_public_id, role, is_blocked, last_login, created_at, updated_at')
      .single();

    if (error) throw error;
    return { ...data, toPublicJSON: () => this.toPublicJSON(data) };
  },

  async deleteById(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  toPublicJSON(user) {
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profile_image,
      profileImagePublicId: user.profile_image_public_id,
      role: user.role,
      isBlocked: user.is_blocked,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  },

  async getStats() {
    const { count: total } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: admins } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    const { count: blocked } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_blocked', true);

    const { count: active } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_blocked', false);

    return {
      total: total || 0,
      admins: admins || 0,
      blocked: blocked || 0,
      active: active || 0
    };
  }
};

module.exports = User;
