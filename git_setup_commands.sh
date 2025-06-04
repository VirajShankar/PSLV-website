# Navigate to your project directory (if not already there)
cd "c:\Users\viraj\Documents\PSLV Webiste Code"

# Initialize a Git repository
git init

# Configure Git (optional - if you haven't done this already)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files to staging
git add .

# Commit the files
git commit -m "Initial commit of PSLV Website"

# Add a remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/pslv-website.git

# Push to the remote repository
git push -u origin main
