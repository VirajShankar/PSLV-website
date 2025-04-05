# PSLV Learning Ventures Website

## Overview
This is a website I created for Prabha Shankar Learning Ventures, providing a platform for students to learn about and enroll in ACCA, IFRS, and Accountancy courses.

## Features
- **Course Catalog**: Information about ACCA, IFRS, and Accountancy courses
- **User Authentication**: Registration and login functionality using Supabase
- **User Dashboard**: Personalized dashboard for enrolled students
- **Course Enrollment**: System for students to enroll in courses
- **Responsive Design**: Works well on desktop and mobile devices

## Technologies Used
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Supabase for backend database and authentication
- FontAwesome for icons

## Database Structure
The application uses the following Supabase tables:
- `PSLV_users`: Stores user information
- `PSLV_enrollments`: Tracks course enrollments
- `PSLV_testimonials`: Stores student testimonials
- `PSLV_contact_us`: Manages contact form submissions

## Setup Instructions
1. Clone this repository
2. Set up a Supabase project and update the connection details in `js/supabase-init.js`
3. Run the SQL scripts in the project to create the required tables
4. Host the files on any web server (or use the included Express server)

## Local Development
To run the site locally:
```bash
# Install dependencies
npm install

# Start the server
npm start
```
The site will be available at http://localhost:5055

## Deployment
This site can be deployed to any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## Project Status
The core functionality is complete, including:
- User registration and authentication
- Course browsing and enrollment
- Student dashboard
- Contact form

## Future Enhancements
- Add online course content delivery
- Implement payment processing
- Create admin dashboard for course management
- Add progress tracking features

## Credits
- Created by: [Your Name]
- For: Prabha Shankar Learning Ventures
- Date: [Month Year]
