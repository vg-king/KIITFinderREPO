// Mock API service for demonstration
// In a real application, this would connect to your backend (e.g., Supabase)

// Mock data
let mockItems = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    description: 'Black iPhone 13 Pro found near the library. Has a blue case with initials "JS" on it.',
    category: 'Electronics',
    type: 'found',
    location: 'Central Library',
    dateReported: '2024-01-15T10:30:00Z',
    status: 'active',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'student@kiit.ac.in',
    userPhone: '+91 9876543211',
    images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'],
    tags: ['phone', 'apple', 'black'],
    reward: 500
  },
  {
    id: '2',
    title: 'Blue Backpack',
    description: 'Lost my blue Adidas backpack containing important documents and laptop charger.',
    category: 'Bags',
    type: 'lost',
    location: 'Academic Block 2',
    dateReported: '2024-01-14T14:20:00Z',
    status: 'active',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'student@kiit.ac.in',
    userPhone: '+91 9876543211',
    images: ['https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400'],
    tags: ['backpack', 'blue', 'adidas'],
    reward: 200
  },
  {
    id: '3',
    title: 'Gold Watch',
    description: 'Found a gold-colored watch in the cafeteria. Appears to be expensive.',
    category: 'Accessories',
    type: 'found',
    location: 'Main Cafeteria',
    dateReported: '2024-01-13T12:15:00Z',
    status: 'active',
    userId: '1',
    userName: 'Admin User',
    userEmail: 'admin@kiit.ac.in',
    userPhone: '+91 9876543210',
    images: ['https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400'],
    tags: ['watch', 'gold', 'expensive'],
    reward: 0
  },
  {
    id: '4',
    title: 'Red Water Bottle',
    description: 'Lost my red stainless steel water bottle with university stickers.',
    category: 'Personal Items',
    type: 'lost',
    location: 'Sports Complex',
    dateReported: '2024-01-12T16:45:00Z',
    status: 'resolved',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'student@kiit.ac.in',
    userPhone: '+91 9876543211',
    images: ['https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400'],
    tags: ['bottle', 'red', 'stickers'],
    reward: 0
  }
];

let mockUsers = [
  {
    id: '1',
    email: 'admin@kiit.ac.in',
    name: 'Admin User',
    role: 'admin',
    studentId: 'ADMIN001',
    phone: '+91 9876543210',
    joinedDate: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    email: 'student@kiit.ac.in',
    name: 'John Doe',
    role: 'student',
    studentId: 'KIIT2024001',
    phone: '+91 9876543211',
    joinedDate: '2024-01-10T00:00:00Z',
    status: 'active'
  }
];

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Items API
export const itemsAPI = {
  // Get all items with optional filters
  getItems: async (filters = {}) => {
    await delay();
    
    let filteredItems = [...mockItems];
    
    // Apply filters
    if (filters.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }
    
    if (filters.category) {
      filteredItems = filteredItems.filter(item => item.category === filters.category);
    }
    
    if (filters.status) {
      filteredItems = filteredItems.filter(item => item.status === filters.status);
    }
    
    if (filters.location) {
      filteredItems = filteredItems.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters.userId) {
      filteredItems = filteredItems.filter(item => item.userId === filters.userId);
    }
    
    // Sort by date (newest first)
    filteredItems.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));
    
    return {
      success: true,
      data: filteredItems,
      total: filteredItems.length
    };
  },

  // Get single item by ID
  getItem: async (id) => {
    await delay();
    
    const item = mockItems.find(item => item.id === id);
    
    if (!item) {
      return {
        success: false,
        error: 'Item not found'
      };
    }
    
    return {
      success: true,
      data: item
    };
  },

  // Create new item
  createItem: async (itemData) => {
    await delay();
    
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      dateReported: new Date().toISOString(),
      status: 'active'
    };
    
    mockItems.push(newItem);
    
    return {
      success: true,
      data: newItem
    };
  },

  // Update item
  updateItem: async (id, updates) => {
    await delay();
    
    const itemIndex = mockItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Item not found'
      };
    }
    
    mockItems[itemIndex] = {
      ...mockItems[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: mockItems[itemIndex]
    };
  },

  // Delete item
  deleteItem: async (id) => {
    await delay();
    
    const itemIndex = mockItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Item not found'
      };
    }
    
    mockItems.splice(itemIndex, 1);
    
    return {
      success: true,
      message: 'Item deleted successfully'
    };
  },

  // Mark item as resolved
  resolveItem: async (id) => {
    await delay();
    
    return await itemsAPI.updateItem(id, { status: 'resolved' });
  }
};

// Users API (for admin)
export const usersAPI = {
  // Get all users
  getUsers: async () => {
    await delay();
    
    return {
      success: true,
      data: mockUsers,
      total: mockUsers.length
    };
  },

  // Get user by ID
  getUser: async (id) => {
    await delay();
    
    const user = mockUsers.find(user => user.id === id);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return {
      success: true,
      data: user
    };
  },

  // Update user
  updateUser: async (id, updates) => {
    await delay();
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: mockUsers[userIndex]
    };
  },

  // Delete user
  deleteUser: async (id) => {
    await delay();
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    mockUsers.splice(userIndex, 1);
    
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
};

// Statistics API
export const statsAPI = {
  getStats: async () => {
    await delay();
    
    const totalItems = mockItems.length;
    const lostItems = mockItems.filter(item => item.type === 'lost').length;
    const foundItems = mockItems.filter(item => item.type === 'found').length;
    const resolvedItems = mockItems.filter(item => item.status === 'resolved').length;
    const activeItems = mockItems.filter(item => item.status === 'active').length;
    const totalUsers = mockUsers.length;
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentItems = mockItems.filter(item => 
      new Date(item.dateReported) >= sevenDaysAgo
    ).length;
    
    return {
      success: true,
      data: {
        totalItems,
        lostItems,
        foundItems,
        resolvedItems,
        activeItems,
        totalUsers,
        recentItems,
        resolutionRate: totalItems > 0 ? Math.round((resolvedItems / totalItems) * 100) : 0
      }
    };
  }
};

// Categories
export const categories = [
  'Electronics',
  'Bags',
  'Accessories',
  'Personal Items',
  'Documents',
  'Books',
  'Clothing',
  'Sports Equipment',
  'Keys',
  'Other'
];

// Common locations on campus
export const locations = [
  'Central Library',
  'Academic Block 1',
  'Academic Block 2',
  'Academic Block 3',
  'Main Cafeteria',
  'Food Court',
  'Sports Complex',
  'Hostel Area',
  'Parking Area',
  'Auditorium',
  'Computer Lab',
  'Laboratory',
  'Garden Area',
  'Bus Stop',
  'Other'
];