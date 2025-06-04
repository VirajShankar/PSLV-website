/**
 * Simple Frontend Backend Simulation
 * This JavaScript file simulates backend functionality using localStorage
 */

// Backend simulation object
const Backend = {
    // Initialize the backend
    init: function() {
        // Create collections if they don't exist
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('enrollments')) {
            localStorage.setItem('enrollments', JSON.stringify([]));
        }
        if (!localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify(null));
        }
        console.log("Backend initialized");
    },

    // User management
    users: {
        // Register a new user
        register: function(userData) {
            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                // Check if email already exists
                if (users.some(user => user.email === userData.email)) {
                    return { success: false, message: "Email already registered" };
                }
                
                // Add user with a unique ID
                const newUser = {
                    id: Date.now().toString(),
                    ...userData,
                    registeredOn: new Date().toISOString()
                };
                
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                return { success: true, user: newUser };
            } catch (error) {
                console.error("Registration error:", error);
                return { success: false, message: "Registration failed" };
            }
        },
        
        // Login a user
        login: function(email, password, rememberMe = false) {
            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Update last login time
                    user.lastLogin = new Date().toISOString();
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Store current user without password
                    const { password, ...userWithoutPassword } = user;
                    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                    
                    // If remember me is checked, store credentials
                    if (rememberMe) {
                        localStorage.setItem('remembered_email', email);
                        localStorage.setItem('remembered_password', password);
                    } else {
                        // Clear stored credentials if not remembering
                        localStorage.removeItem('remembered_email');
                        localStorage.removeItem('remembered_password');
                    }
                    
                    return { success: true, user: userWithoutPassword };
                } else {
                    return { success: false, message: "Invalid email or password" };
                }
            } catch (error) {
                console.error("Login error:", error);
                return { success: false, message: "Login failed" };
            }
        },
        
        // Logout current user
        logout: function() {
            localStorage.setItem('currentUser', JSON.stringify(null));
            // Don't clear remembered_email and remembered_password to preserve the "remember me" feature
            return { success: true };
        },
        
        // Get current logged in user
        getCurrentUser: function() {
            return JSON.parse(localStorage.getItem('currentUser'));
        },
        
        // Get all users (admin function)
        getAll: function() {
            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                // Return users without passwords
                return users.map(({password, ...user}) => user);
            } catch (error) {
                console.error("Error getting users:", error);
                return [];
            }
        }
    },
    
    // Course enrollments
    enrollments: {
        // Enroll in a course
        create: function(courseData) {
            try {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser) {
                    return { success: false, message: "You must be logged in to enroll" };
                }
                
                const enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
                
                // Check if already enrolled
                if (enrollments.some(e => e.userId === currentUser.id && e.courseId === courseData.courseId)) {
                    return { success: false, message: "Already enrolled in this course" };
                }
                
                // Create enrollment
                const newEnrollment = {
                    id: Date.now().toString(),
                    userId: currentUser.id,
                    ...courseData,
                    enrolledOn: new Date().toISOString(),
                    status: "Active"
                };
                
                enrollments.push(newEnrollment);
                localStorage.setItem('enrollments', JSON.stringify(enrollments));
                
                return { success: true, enrollment: newEnrollment };
            } catch (error) {
                console.error("Enrollment error:", error);
                return { success: false, message: "Enrollment failed" };
            }
        },
        
        // Get user's enrollments
        getUserEnrollments: function() {
            try {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser) return [];
                
                const enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
                return enrollments.filter(e => e.userId === currentUser.id);
            } catch (error) {
                console.error("Error getting enrollments:", error);
                return [];
            }
        },
        
        // Get all enrollments (admin function)
        getAll: function() {
            try {
                return JSON.parse(localStorage.getItem('enrollments')) || [];
            } catch (error) {
                console.error("Error getting all enrollments:", error);
                return [];
            }
        }
    },

    // Additional Backend functionality
    testimonials: {
        // Submit a testimonial
        submit: function(testimonialData) {
            try {
                const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
                
                // Add testimonial with ID
                const newTestimonial = {
                    id: Date.now().toString(),
                    ...testimonialData,
                    submittedOn: new Date().toISOString(),
                    approved: false
                };
                
                testimonials.push(newTestimonial);
                localStorage.setItem('testimonials', JSON.stringify(testimonials));
                
                return { success: true, testimonial: newTestimonial };
            } catch (error) {
                console.error("Testimonial submission error:", error);
                return { success: false, message: "Submission failed" };
            }
        },
        
        // Get all approved testimonials
        getApproved: function() {
            try {
                const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
                return testimonials.filter(t => t.approved);
            } catch (error) {
                console.error("Error getting testimonials:", error);
                return [];
            }
        },
        
        // For demo purposes - approve all testimonials
        approveAll: function() {
            try {
                const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
                const updatedTestimonials = testimonials.map(t => ({...t, approved: true}));
                localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
                return { success: true };
            } catch (error) {
                return { success: false };
            }
        }
    },

    progress: {
        // Update course progress
        update: function(courseId, moduleId, completed) {
            try {
                const currentUser = Backend.users.getCurrentUser();
                if (!currentUser) return { success: false, message: "Not logged in" };
                
                // Get user progress
                const progressData = JSON.parse(localStorage.getItem('progress')) || {};
                const userId = currentUser.id;
                
                // Initialize user progress if needed
                if (!progressData[userId]) progressData[userId] = {};
                if (!progressData[userId][courseId]) progressData[userId][courseId] = {
                    modules: {},
                    lastUpdated: new Date().toISOString()
                };
                
                // Update progress
                progressData[userId][courseId].modules[moduleId] = completed;
                progressData[userId][courseId].lastUpdated = new Date().toISOString();
                
                localStorage.setItem('progress', JSON.stringify(progressData));
                return { success: true };
            } catch (error) {
                console.error("Error updating progress:", error);
                return { success: false, message: "Failed to update progress" };
            }
        },
        
        // Get user progress for a course
        get: function(courseId) {
            try {
                const currentUser = Backend.users.getCurrentUser();
                if (!currentUser) return null;
                
                const progressData = JSON.parse(localStorage.getItem('progress')) || {};
                return progressData[currentUser.id]?.[courseId] || { modules: {}, lastUpdated: null };
            } catch (error) {
                console.error("Error getting progress:", error);
                return null;
            }
        },
        
        // Get overall progress for a course
        getOverallProgress: function(courseId) {
            try {
                const courseProgress = this.get(courseId);
                if (!courseProgress || !courseProgress.modules) return 0;
                
                const modules = Object.values(courseProgress.modules);
                if (modules.length === 0) return 0;
                
                const completedCount = modules.filter(Boolean).length;
                return Math.round((completedCount / modules.length) * 100);
            } catch (error) {
                return 0;
            }
        }
    }
};

// Course modules and lessons for progress tracking
const courseModules = {
    acca: [
        { id: 'module1', title: 'Introduction to ACCA', lessons: 5 },
        { id: 'module2', title: 'Financial Accounting', lessons: 8 },
        { id: 'module3', title: 'Management Accounting', lessons: 6 },
        { id: 'module4', title: 'Corporate Law', lessons: 7 },
        { id: 'module5', title: 'Business Taxation', lessons: 9 }
    ],
    ifrs: [
        { id: 'module1', title: 'IFRS Framework', lessons: 4 },
        { id: 'module2', title: 'Financial Statements', lessons: 7 },
        { id: 'module3', title: 'Revenue Recognition', lessons: 5 },
        { id: 'module4', title: 'Leases & Assets', lessons: 6 }
    ],
    accountancy: [
        { id: 'module1', title: 'Basic Accounting', lessons: 6 },
        { id: 'module2', title: 'Journal Entries', lessons: 5 },
        { id: 'module3', title: 'Trial Balance', lessons: 4 },
        { id: 'module4', title: 'Financial Statements', lessons: 7 }
    ]
};

// Initialize the backend when the page loads
document.addEventListener('DOMContentLoaded', function() {
    Backend.init();
    Search.init();
    updateLoginStatus();
    setupSearchFunctionality();
});

// Update login status in navbar
function updateLoginStatus() {
    const loginStatusElement = document.getElementById('loginStatus');
    if (!loginStatusElement) return;
    
    const currentUser = Backend.users.getCurrentUser();
    
    if (currentUser) {
        loginStatusElement.innerHTML = `
            <span class="me-2">Welcome, ${currentUser.name}</span>
            <button class="btn btn-sm btn-outline-danger" onclick="handleLogout()">Logout</button>
        `;
    } else {
        loginStatusElement.innerHTML = `
            <a href="login.html" class="btn btn-sm btn-outline-danger">Login</a>
        `;
    }
}

// Handle logout
function handleLogout() {
    Backend.users.logout();
    updateLoginStatus();
    // Redirect to home if on dashboard or other protected page
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('my-courses')) {
        window.location.href = 'index.html';
    }
}

// Course data
const courseData = {
    acca: {
        id: "acca",
        name: "ACCA Certification",
        description: "Association of Chartered Certified Accountants qualification",
        levels: ["Applied Knowledge", "Applied Skills", "Strategic Professional"]
    },
    ifrs: {
        id: "ifrs",
        name: "IFRS Course",
        description: "International Financial Reporting Standards",
        modules: ["Foundation", "Core Standards", "Advanced", "Specialized Topics"]
    },
    accountancy: {
        id: "accountancy",
        name: "11th & 12th Accountancy",
        description: "High school accountancy preparation",
        subjects: ["Accounting Principles", "Financial Statements", "Corporate Accounting"]
    }
};

// Search functionality
const Search = {
    data: null,
    
    init: function() {
        // Pre-populate search data
        this.data = [
            { title: 'ACCA Course', url: 'acca-courses.html', type: 'course', 
              keywords: 'accounting chartered certified finance professional qualification' },
            { title: 'IFRS Course', url: 'ifrs-courses.html', type: 'course',
              keywords: 'international financial reporting standards accounting' },
            { title: 'Accountancy', url: 'accountancy-courses.html', type: 'course',
              keywords: '11th 12th standard high school accounting' },
            { title: 'About Us', url: 'about.html', type: 'page',
              keywords: 'company history mission vision achievements' },
            { title: 'Contact Us', url: 'contact.html', type: 'page',
              keywords: 'reach out message form email phone' },
            { title: 'Registration', url: 'registration.html', type: 'action',
              keywords: 'sign up account enroll join' },
            { title: 'Login', url: 'login.html', type: 'action',
              keywords: 'sign in account access' }
        ];
    },
    
    perform: function(query) {
        if (!query || query.length < 2) return [];
        
        query = query.toLowerCase();
        return this.data.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(query);
            const keywordMatch = item.keywords.toLowerCase().includes(query);
            return titleMatch || keywordMatch;
        }).sort((a, b) => {
            // Sort by type priority: action > course > page
            const typeOrder = { action: 0, course: 1, page: 2 };
            return typeOrder[a.type] - typeOrder[b.type];
        });
    }
};

// Setup search functionality
function setupSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value;
            const resultsContainer = this.nextElementSibling;
            if (!resultsContainer) return;

            if (!query || query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }

            const results = Search.perform(query);
            if (results.length > 0) {
                let html = '';
                results.forEach(result => {
                    const icon = result.type === 'course' ? 'fa-book' :
                               (result.type === 'action' ? 'fa-arrow-right' : 'fa-file');
                    html += `
                        <a href="${result.url}" class="list-group-item list-group-item-action">
                            <div class="d-flex align-items-center">
                                <i class="fas ${icon} me-2 text-danger"></i>
                                <div>
                                    <div>${result.title}</div>
                                    <small class="text-muted">${result.type.charAt(0).toUpperCase() + result.type.slice(1)}</small>
                                </div>
                            </div>
                        </a>
                    `;
                });
                resultsContainer.innerHTML = html;
                resultsContainer.style.display = 'block';
            } else {
                resultsContainer.innerHTML = '<div class="list-group-item">No results found</div>';
                resultsContainer.style.display = 'block';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            const resultsContainer = input.nextElementSibling;
            if (!resultsContainer) return;

            if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    });
}

// Initialize search functionality on page load
document.addEventListener('DOMContentLoaded', function() {
    setupSearchFunctionality();
});
