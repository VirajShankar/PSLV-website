// Handles user authentication UI across all pages
document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Get current session
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        const loginStatusElement = document.getElementById('loginStatus');
        
        if (loginStatusElement) {
            if (session && session.user) {
                // User is logged in
                loginStatusElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <span class="me-2">Welcome, ${session.user.email}</span>
                        <button id="logoutBtn" class="btn btn-sm btn-outline-danger">Logout</button>
                    </div>
                `;
                
                // Add logout functionality
                document.getElementById('logoutBtn').addEventListener('click', async () => {
                    const { error } = await window.supabase.auth.signOut();
                    if (!error) {
                        window.location.reload();
                    }
                });
                
                // Update any register buttons to dashboard links
                const registerButtons = document.querySelectorAll('a[href="registration.html"]');
                registerButtons.forEach(button => {
                    button.textContent = "My Dashboard";
                    button.href = "dashboard.html";
                });
            } else {
                // User is not logged in
                loginStatusElement.innerHTML = `
                    <div class="d-flex">
                        <a href="login.html" class="nav-link me-2">Login</a>
                        <a href="registration.html" class="nav-link">Register</a>
                    </div>
                `;
            }
        }
    } catch (err) {
        console.error("Error checking authentication status:", err);
    }
});
