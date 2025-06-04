// Simplified Supabase initialization with proper error handling

// Your Supabase project details
const SUPABASE_URL = 'https://berfykdzrhhayqzjpyua.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcmZ5a2R6cmhoYXlxempweXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzAzOTgsImV4cCI6MjA1ODU0NjM5OH0.DIjkvmjKsZ3G45M4vR_V_pqsOwHBz7s70IAlmE7aDZ4';

// Course data for enrollment
window.courseData = {
    acca: { 
        name: "ACCA Certification",
        description: "Professional Accounting Qualification"
    },
    ifrs: { 
        name: "IFRS Course",
        description: "International Financial Reporting Standards"
    },
    accountancy: { 
        name: "Accountancy",
        description: "11th & 12th Standard Course"
    }
};

// Function to check if Supabase can successfully write to database
async function testSupabaseConnection() {
    try {
        if (!window.supabase) return false;
        
        // Test supabase connection with a simple fetch of PSLV_users table
        const { error } = await window.supabase.from('PSLV_users').select('count').limit(1);
        
        // If there's a permission error, it could indicate missing RLS policies
        if (error && error.code === '42501') {
            console.error("PERMISSION ERROR: This could indicate missing RLS policies. Check table_setup.sql");
            showRlsWarning();
            return false;
        }
        
        return !error;
    } catch (e) {
        console.error("Supabase connection test failed:", e);
        return false;
    }
}

// Warning function for RLS issues
function showRlsWarning(tableName, operation = 'read') {
    // Create a warning notification about RLS
    const div = document.createElement('div');
    div.style = "position:fixed; top:10px; left:10px; background:#ffcc00; color:black; padding:15px; border-radius:5px; z-index:9999; max-width:80%; box-shadow:0 4px 8px rgba(0,0,0,0.1);";
    div.innerHTML = `
        <strong>Database Permission Error</strong><br>
        Your database is missing Row Level Security (RLS) policies.<br>
        Please run the SQL from rls_setup.sql in your Supabase dashboard.<br>
        <a href="#" onclick="this.parentNode.style.display='none'; return false;" style="color:#dc3545; text-decoration:none; font-weight:bold; float:right;">✕</a>
    `;
    document.body.appendChild(div);
}

// Warning function for missing tables
function showTableMissingWarning(tableName) {
    // Remove any existing warnings first
    const existingWarnings = document.querySelectorAll('.table-missing-warning');
    existingWarnings.forEach(warning => warning.remove());
    
    const div = document.createElement('div');
    div.className = 'table-missing-warning';
    div.style = "position:fixed; top:80px; left:50%; transform:translateX(-50%); background:#dc3545; color:white; padding:20px; border-radius:5px; z-index:9999; max-width:80%; box-shadow:0 4px 15px rgba(0,0,0,0.2); text-align:center;";
    div.innerHTML = `
        <strong>Database Setup Required</strong><br>
        <p>The table '${tableName}' does not exist in your Supabase database.</p>
        <ol style="text-align:left; margin-top:10px;">
            <li>Go to your Supabase dashboard</li>
            <li>Click on "SQL Editor" in the left sidebar</li>
            <li>Create a new query</li>
            <li>Copy the entire SQL script from <code>table_setup.sql</code></li>
            <li>Run the SQL query by clicking "Run"</li>
        </ol>
        <p style="font-weight:bold; margin-top:10px;">Note: Your tables use the PSLV_ prefix!</p>
        <a href="#" onclick="window.open('https://app.supabase.com/project/_/sql', '_blank'); return false;" 
           style="display:inline-block; background:#fff; color:#dc3545; text-decoration:none; font-weight:bold; padding:10px 20px; border-radius:5px; margin-top:10px;">
           Open Supabase SQL Editor
        </a>
        <button onclick="this.parentNode.style.display='none'; return false;" 
                style="position:absolute; top:10px; right:10px; background:none; border:none; color:white; cursor:pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    document.body.appendChild(div);
    
    // Create a flashing button at the bottom to run setup
    const setupButton = document.createElement('div');
    setupButton.className = 'setup-button-hint';
    setupButton.style = "position:fixed; bottom:20px; right:20px; background:#dc3545; color:white; padding:15px; border-radius:50px; z-index:9999; box-shadow:0 4px 15px rgba(0,0,0,0.2); cursor:pointer; animation:pulse 2s infinite;";
    setupButton.innerHTML = `<i class="fas fa-database"></i> Run Database Setup`;
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        </style>
    `);
    setupButton.onclick = function() {
        // Show the main warning again if it was closed
        const warningElement = document.querySelector('.table-missing-warning');
        if (warningElement) {
            warningElement.style.display = 'block';
        } else {
            showTableMissingWarning(tableName);
        }
    };
    document.body.appendChild(setupButton);
}

// Add table debugging utility with better error handling
window.debugSupabaseTable = async function(tableName) {
    try {
        console.log(`Checking table '${tableName}'...`);
        if (!window.supabase) {
            console.error("Supabase not initialized");
            return;
        }
        
        // First check if the table exists
        const { data: tablesData, error: tablesError } = await window.supabase
            .rpc('check_table_exists', { table_name: tableName });
            
        if (tablesError) {
            console.error("Error checking if table exists:", tablesError);
            // Continue anyway to get more specific error
        } else if (tablesData === false) {
            console.error(`TABLE DOES NOT EXIST: '${tableName}'`);
            showTableMissingWarning(tableName);
            return;
        }
        
        // Try to query the table
        const { data, error } = await window.supabase
            .from(tableName)
            .select('count')
            .limit(1);
            
        if (error) {
            console.error(`Error reading from '${tableName}':`, error);
            
            // Check error code to provide specific guidance
            if (error.code === '42P01') {
                console.error(`TABLE DOES NOT EXIST: '${tableName}' - Code 42P01`);
                showTableMissingWarning(tableName);
                return;
            } else if (error.code === '42501') {
                console.error(`PERMISSION DENIED: Missing RLS policy for '${tableName}' - Code 42501`);
                showRlsWarning(tableName);
                return;
            } else if (error.message && error.message.includes("does not exist")) {
                console.error(`TABLE DOES NOT EXIST: '${tableName}'`);
                showTableMissingWarning(tableName);
                return;
            }
        } else {
            console.log(`✓ Table '${tableName}' exists and is accessible`);
            
            // Now try to get actual data
            const { data: rowData, error: rowError } = await window.supabase
                .from(tableName)
                .select('*')
                .limit(10);
                
            if (rowError) {
                console.error(`Error fetching rows from '${tableName}':`, rowError);
            } else {
                console.log(`Data in '${tableName}':`, rowData);
                console.log(`Found ${rowData.length} rows in '${tableName}'`);
            }
        }
    } catch (e) {
        console.error(`Debug error for table '${tableName}':`, e);
    }
};

// Initialize Supabase with a reliable method
(function initializeSupabase() {
    try {
        console.log("Initializing Supabase client");
        
        // Create Supabase client directly
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Test client was properly created
        if (!window.supabase || !window.supabase.auth) {
            throw new Error("Failed to create Supabase client properties");
        }
        
        console.log("Supabase initialized successfully");
        
        // Test db connection in background
        testSupabaseConnection().then(success => {
            console.log("Supabase connection test:", success ? "✅ Success" : "❌ Failed");
        });
    } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        
        // Create a simple error notification
        const div = document.createElement('div');
        div.style = "position:fixed; top:10px; right:10px; background:#dc3545; color:white; padding:10px; border-radius:5px; z-index:9999;";
        div.innerHTML = "Error initializing database. Please refresh the page.";
        document.body.appendChild(div);
        
        // Remove after 5 seconds
        setTimeout(() => div.remove(), 5000);
    }
})();

// Recovery function if initialization fails
window.initSupabaseClient = function() {
    if (!window.supabase) {
        console.log("Using recovery initialization");
        try {
            return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.error("Recovery initialization failed:", e);
            return null;
        }
    }
    return window.supabase;
};

// Add global function to check login status
window.checkLoginStatus = async function() {
    if (!window.supabase || !window.supabase.auth) {
        console.error("Supabase auth not available");
        return false;
    }
    
    try {
        const { data } = await window.supabase.auth.getSession();
        return !!data.session; // Convert to boolean
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
};

// UPDATED: Function to update all nav elements and register buttons based on login status
window.updateNavLoginStatus = async function() {
    const isLoggedIn = await window.checkLoginStatus();
    
    // Update login status in navbar
    const loginStatusElement = document.getElementById('loginStatus');
    if (loginStatusElement) {
        if (isLoggedIn) {
            const { data } = await window.supabase.auth.getUser();
            const userName = data?.user?.user_metadata?.full_name || data?.user?.email || 'User';
            
            loginStatusElement.innerHTML = `
                <a href="dashboard.html" class="btn btn-sm btn-outline-danger me-2">Dashboard</a>
                <button class="btn btn-sm btn-danger" onclick="handleLogout()">Logout</button>
            `;
        } else {
            loginStatusElement.innerHTML = `
                <a href="login.html" class="btn btn-sm btn-outline-danger me-2">Login</a>
                <a href="registration.html" class="btn btn-sm btn-danger">Register</a>
            `;
        }
    }
    
    // Update ALL register links to dashboard links if logged in
    if (isLoggedIn) {
        // For all register links in navigation and other areas
        document.querySelectorAll('a[href="registration.html"]').forEach(link => {
            link.href = "dashboard.html";
            if (link.textContent.includes("Register")) {
                link.textContent = link.textContent.replace("Register", "Dashboard");
            }
        });
        
        // For call-to-action buttons that may not have the exact registration.html link
        document.querySelectorAll('.btn-danger').forEach(button => {
            if (button.textContent.includes("Register") && !button.hasAttribute('data-course-id')) {
                button.textContent = button.textContent.replace("Register", "Go to Dashboard");
                button.href = "dashboard.html";
            }
        });
    }
};

// Run login status check when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.updateNavLoginStatus();
    
    // Special handling for enrollment from course pages
    const courseParams = new URLSearchParams(window.location.search);
    const courseToEnroll = courseParams.get('enroll');
    
    if (courseToEnroll) {
        // If there's an enrollment parameter and user is logged in, process direct enrollment
        window.checkLoginStatus().then(isLoggedIn => {
            if (isLoggedIn && window.enrollInCourse) {
                window.supabase.auth.getUser().then(({ data }) => {
                    if (data?.user?.id) {
                        const courseName = window.courseData[courseToEnroll]?.name || courseToEnroll;
                        window.enrollInCourse(courseToEnroll, courseName, data.user.id);
                    }
                });
            } else if (!isLoggedIn) {
                // If not logged in, redirect to login with a return parameter
                sessionStorage.setItem('enrollAfterLogin', courseToEnroll);
                window.location.href = 'login.html?returnTo=courses.html&enroll=' + courseToEnroll;
            }
        });
    }
});

// Debug Supabase connection
async function debugSupabaseConnection() {
    try {
        const { data, error } = await window.supabase
            .from('PSLV_contact_us')
            .select('*')
            .limit(1);

        if (error) {
            console.error("Supabase connection test failed:", error);
        } else {
            console.log("Supabase connection test succeeded. Data:", data);
        }
    } catch (err) {
        console.error("Unexpected error during Supabase connection test:", err);
    }
}

// Call the debug function on page load
document.addEventListener('DOMContentLoaded', debugSupabaseConnection);
