# Arogya Wellness Assistant - Frontend

## Overview

The Arogya Wellness Assistant frontend is a modern React-based Single Page Application (SPA) designed to provide users with personalized wellness guidance, health recommendations, and access to educational content. The application delivers an intuitive, responsive user interface that facilitates health-conscious decision-making through conversational AI-driven interactions and curated wellness resources.

## Architecture

### Technology Stack

- **Framework**: React 18.x
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Module Bundler**: Vite
- **Linting**: ESLint
- **Package Manager**: npm

### Development Features

- Hot Module Replacement (HMR) for real-time development updates
- Optimized build output for production deployments
- ESLint configuration for code quality enforcement
- Tailwind CSS for utility-first styling approach

## Project Structure

### Core Files

- **index.html**: Main entry point containing the root DOM element
- **main.jsx**: Application bootstrap and React root rendering
- **App.jsx**: Primary application component and routing logic
- **config.js**: Centralized configuration for API endpoints and environment settings
- **App.css**: Global application styles
- **index.css**: Base CSS initialization and global utilities

### Components Directory

The application consists of six primary functional components:

#### 1. **HomePage.jsx**

Main landing page component providing users with an overview of the application's capabilities. Serves as the initial interaction point for new users and displays key value propositions of the wellness assistant.

#### 2. **LoginPage.jsx**

Authentication component handling user login flows. Manages credential validation, session establishment, and user authentication state. Ensures secure access to personalized features.

#### 3. **WellnessPage.jsx**

Core wellness consultation interface enabling users to interact with the AI-powered assistant. Provides conversational interface for health-related queries, personalized recommendations, and wellness guidance based on user profiles and preferences.

#### 4. **HistoryPage.jsx**

Historical interaction log component displaying past conversations and wellness recommendations. Allows users to review previous consultations, track recommendations over time, and maintain a record of their wellness journey.

#### 5. **ProfilePage.jsx**

User profile management component enabling users to view and update personal health information, preferences, wellness goals, and configuration settings. Maintains user-specific data for personalized recommendations.

#### 6. **YouTubeRecommendations.jsx**

Educational content delivery component integrating curated YouTube video recommendations aligned with user wellness interests and health concerns. Provides supplementary learning resources and expert wellness content.

#### 7. **NavBar.jsx**

Navigation component providing consistent application navigation across all pages. Manages routing links, user session indicators, and application menu access.

### Styles Directory

- **YouTubeRecommendations.css**: Specialized styling for the YouTube recommendations component, including video grid layout and responsive media handling

### Assets Directory

Contains static application assets including icons, images, and other media resources referenced throughout the application.

## Routing and Navigation

The application implements client-side routing through the NavBar component, providing seamless navigation between:

- Home page (landing and introduction)
- Login and authentication flows
- Main wellness consultation interface
- User conversation history
- User profile and settings
- Educational content recommendations

## Feature Highlights

### User Authentication

Secure login mechanism protecting access to personalized wellness features and maintaining user session state across the application.

### Conversational Interface

Interactive wellness consultation powered by backend AI services, enabling natural language health-related queries and personalized recommendations.

### Personalization

Profile-driven recommendations based on user health information, preferences, and wellness goals stored in the backend system.

### Content Curation

Integration with educational video resources providing supplementary wellness information and expert guidance aligned with user interests.

### Session Management

Persistent conversation history enabling users to review and reference previous wellness consultations and recommendations.

## Development Workflow

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Starts the development server with HMR enabled for rapid iteration and testing.

### Production Build

```bash
npm run build
```

Generates optimized production bundle with minified assets and optimized asset loading.

### Code Quality

```bash
npm run lint
```

Runs ESLint to identify and report code quality issues.

## Configuration

The `config.js` file centralizes all environment-specific configuration including:

- Backend API endpoint URLs
- Environment-based settings (development, staging, production)
- Feature flags and behavior toggles

## Styling Architecture

The application employs Tailwind CSS for utility-first styling, providing:

- Responsive design capabilities
- Consistent design system implementation
- Reduced CSS file size through PurgeCSS optimization
- Rapid prototyping and customization

## Dependencies

All frontend dependencies are specified in [package.json](package.json) and include:

- React for UI component framework
- Vite for development and build tooling
- Tailwind CSS for styling
- ESLint for code quality

## Performance Considerations

- Vite's optimized bundling ensures minimal initial load times
- Component-based architecture enables code splitting and lazy loading
- Responsive design adapts to various device sizes and screen resolutions
- HMR in development accelerates development iteration cycles

## Browser Compatibility

The application is optimized for modern browsers supporting ES6+ JavaScript standards. It is recommended to use recent versions of:

- Chrome
- Firefox
- Safari
- Edge

## Contributing

When contributing to the frontend, ensure adherence to:

- ESLint configuration standards
- Tailwind CSS utility conventions
- Component-based architecture principles
- Responsive design best practices
