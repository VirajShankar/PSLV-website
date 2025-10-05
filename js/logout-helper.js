/**
 * Logout Helper Script
 * This provides a standalone logout function to ensure consistent logout behavior across the site
 */

// Add the logout button event handler to all logout buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    });
    
    // Also handle onclick="handleLogout()" legacy buttons
    window.handleLogout = performLogout;
});

// Perform the actual logout
async function performLogout() {
    console.log("Logout requested");
    
    try {
        // Clear local storage first
        localStorage.removeItem('currentUser');
        
        // Sign out from Supabase
        if (window.supabase && window.supabase.auth) {
            await window.supabase.auth.signOut();
            console.log("Supabase signOut called successfully");
        }
        
        // Force redirect to home page
        console.log("Redirecting to home page");
        window.location.replace('index.html');
        
        return false; // Prevent default for onclick handlers
    } catch (error) {
        console.error("Error during logout:", error);
        alert("There was a problem logging out. The page will now refresh.");
        window.location.reload();
        return false;
    }
}
