# EduLearn - Educational Platform

A small-scale educational content viewing platform inspired by NPTEL, built as a college mini-project.

## 🚀 Features

- **Course Listing**: Browse through 8 available courses with search and filter functionality
- **Course Details**: Detailed course view with video player, lecture sidebar, and materials
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Video Player**: Embedded YouTube videos for lectures
- **Progress Tracking**: Visual progress indicators (mock implementation)

## 🛠️ Technology Stack

- **Frontend**: React 18 (Functional Components & Hooks)
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Data**: Mock JSON data (no backend required)

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Header.jsx       # Navigation header
│   └── CourseCard.jsx   # Course card component
├── pages/               # Page components
│   ├── CourseList.jsx   # Home/Course listing page
│   └── CourseDetails.jsx # Course detail page
├── data/                # Mock data
│   └── mockData.json    # Course and lecture data
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles with Tailwind

```

## 🎯 Core Functionalities

### 1. Home/Course Listing Page
- Displays 8 mock courses
- Search functionality (by title, instructor, or description)
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- Responsive grid layout
- Course cards show title, instructor, description, and metadata

### 2. Course Details Page
- Video player with embedded YouTube content
- Expandable sidebar with module and lecture listings
- Course materials section
- Progress tracking (mock implementation)
- Breadcrumb navigation

### 3. Navigation
- Clean header with branding
- Navigation links (All Courses, About)
- Responsive design

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 Sample Courses Included

**No pre-loaded courses** - Start with a clean slate! The platform is ready for you to add your own courses through the admin interface.

### Getting Started with Content:
1. **Access Admin Panel**: Visit `/admin/login`
2. **Login**: Use credentials `admin` / `admin123`
3. **Add Your First Course**: Click "Add New Course" in the dashboard
4. **Upload Content**: Add course details, thumbnails, modules, and video lectures

The platform supports:
- **Unlimited Courses**: Add as many courses as you need
- **Rich Content**: Thumbnails, multiple modules, video lectures, materials
- **All Difficulty Levels**: Beginner, Intermediate, Advanced
- **Persistent Storage**: All your content is saved locally

## 🎨 Design Features

- **Color Scheme**: Professional blue theme with gray accents
- **Typography**: Modern, readable fonts
- **Responsive**: Mobile-first design approach
- **Interactive**: Hover effects and smooth transitions
- **Accessible**: Good contrast ratios and semantic HTML

## 🔗 Routing Structure

- `/` - Course listing page
- `/course/:courseId` - Course details page
- `/about` - About page
- `*` - 404 error page

## 📝 Mock Data Structure

Each course includes:
- Basic info (title, instructor, description, level, duration)
- Modules with nested lectures
- Video URLs (YouTube embeds)
- Course materials list
- Metadata (thumbnails, duration, etc.)

## 🚀 Future Enhancements

- User authentication and profiles
- Real backend integration
- Video upload functionality
- Quiz and assignment features
- Discussion forums
- Certificate generation
- Payment integration
- Advanced search with filters

## 📄 License

This project is created for educational purposes as a college mini-project.

## 👥 Contributing

This is a mini-project for educational purposes. Feel free to fork and modify for your own learning!"# ONE_CREDIT" 
