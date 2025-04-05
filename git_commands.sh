# Navigate to your project directory (if not already there)
cd "c:\Users\viraj\Documents\PSLV Webiste Code"

# Initialize a Git repository
git init

# Add all files to staging
git add .

# Commit your changes with a message
git commit -m "Initial commit of PSLV Learning Ventures website"

# Link your local repository to your GitHub repository
# Replace "yourusername" with your actual GitHub username and "repository-name" with your desired repo name
git remote add origin https://github.com/yourusername/repository-name.git

# Push your code to GitHub 
# If your default branch is named "main":
git push -u origin main

# OR if your default branch is named "master" (older Git versions):
# git push -u origin master
