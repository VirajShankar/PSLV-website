/**
 * Global Authentication Handler
 * This file ensures consistent auth handling across all pages
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Check if Supabase is available
    if (!window.supabase || !window.supabase.auth) {
        console.error("Supabase not available for auth check");
        return;
    }
    
    try {
        // Check current session
        const { data: { session } } = await window.supabase.auth.getSession();
        const loginStatusElement = document.getElementById('loginStatus');
        
        if (!loginStatusElement) return;
        
        if (session) {
            // User is logged in
            const userName = session.user.user_metadata?.full_name || 
                             session.user.email?.split('@')[0] || 
                             'User';
            
            loginStatusElement.innerHTML = `
                <a href="dashboard.html" class="btn btn-sm btn-outline-danger me-2">Dashboard</a>
                <button class="btn btn-sm btn-danger" onclick="window.handleLogout()">Logout</button>
            `;
            
            // Also update "Register" buttons to point to dashboard
            document.querySelectorAll('a[href="registration.html"]').forEach(link => {
                link.innerText = "My Dashboard";
                link.href = "dashboard.html";
            });
        } else {
            // User is not logged in
            loginStatusElement.innerHTML = `
                <a href="login.html" class="btn btn-sm btn-outline-danger me-2">Login</a>
                <a href="registration.html" class="btn btn-sm btn-danger">Register</a>
            `;
        }
    } catch (error) {
        console.error("Auth check error:", error);
    }
});

// Add a global function to check if user is logged in
window.isUserLoggedIn = async function() {
    if (!window.supabase || !window.supabase.auth) return false;
    
    try {
        const { data: { session } } = await window.supabase.auth.getSession();
        return !!session;
    } catch (error) {
        console.error("Login check error:", error);
        return false;
    }
};
