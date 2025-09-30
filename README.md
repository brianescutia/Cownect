# Cownect - UC Davis Tech Club Discovery Platform

A full-stack web application helping UC Davis students discover tech clubs, explore career paths, and build community connections. Features real club data, user authentication, interactive career quiz, and modern responsive design.

** Live Demo:** https://www.cownect.org/  
** GitHub:** https://github.com/brianescutia/Cownect

---

##  Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB Atlas (Cloud Database)
- bcrypt Authentication
- Session Management
- RESTful APIs

**Frontend:**
- Vanilla JavaScript (ES6+)
- Modern CSS3 (Glassmorphism UI)
- Responsive Design
- Drag & Drop Interactions

**DevOps:**
- Git Version Control
- Environment Configuration
- Database Seeding Scripts
- Production Ready

---

##  Key Features

###  **Full Authentication System**
- Secure user registration/login with bcrypt
- Session-based authentication
- UC Davis email validation
- Protected routes and middleware

###  **Dynamic Club Discovery**
- Real UC Davis tech club database (20+ clubs)
- Advanced search & filtering system
- Tag-based categorization
- Pagination and responsive cards

###  **Personal Bookmark System**
- Real-time bookmark management
- Database persistence
- User dashboard integration
- Visual feedback system

###  **Interactive Career Quiz**
- Research-backed career assessment
- Drag-and-drop ranking interface
- Progressive difficulty levels
- Personalized recommendations with salary data

###  **Modern UX/UI**
- Mobile-first responsive design
- Glassmorphism visual effects
- Smooth animations and transitions
- Cross-browser compatibility

---

##  Architecture & Design Patterns

**MVC Architecture:**
- Separation of concerns with models, views, controllers
- Modular code organization
- Scalable file structure

**Database Design:**
- Normalized MongoDB schemas
- Efficient querying with indexing
- Relationship modeling between users, clubs, bookmarks

**Security:**
- Password hashing with salt rounds
- Session security with MongoDB store
- Input validation and sanitization
- Environment variable management

**Performance:**
- Optimized database queries
- Client-side pagination
- Efficient image loading
- Minimal bundle size

---

##  Quick Start

```bash
# Clone and install
git clone https://github.com/brianescutia/Cownect.git
cd Cownect && npm install

# Configure environment
cp .env.example .env  # Add MongoDB URI

# Seed database with real data
node backend/seedClubs.js
node backend/seedQuizData.js

# Run application
npm run dev  # Development mode
npm start    # Production mode
```

---

##  Technical Achievements

- **Database Management:** Designed and implemented 4 MongoDB collections with complex relationships
- **API Development:** 15+ RESTful endpoints with proper error handling and status codes
- **Real-time Features:** Live bookmark system with instant UI updates
- **Data Processing:** Advanced search algorithm with multi-field filtering
- **User Experience:** Interactive quiz engine with weighted scoring system
- **Responsive Design:** Mobile-optimized interface supporting all screen sizes

---

##  Business Impact

- **Problem Solved:** UC Davis students struggle to discover relevant tech opportunities
- **Solution:** Centralized platform with 20+ verified tech clubs and career guidance
- **Target Users:** 1,000+ UC Davis engineering and CS students
- **Scalability:** Architecture supports expansion to other UC campuses

---

##  Future Enhancements

- [ ] **Events Management System** - Calendar integration for club events
- [ ] **Mentor Matching** - Connect students with alumni professionals  
- [ ] **Mobile App** - React Native companion application
- [ ] **Analytics Dashboard** - Data insights for club officers
- [ ] **AI Recommendations** - Machine learning for personalized suggestions

---

##  Technical Skills Demonstrated

**Backend Development:**
- RESTful API design and implementation
- Database schema design and optimization
- User authentication and session management
- Server-side validation and error handling

**Frontend Development:**
- Modern JavaScript (ES6+, Promises, Async/Await)
- DOM manipulation and event handling
- Responsive CSS design and animations
- Cross-browser compatibility

**Full-Stack Integration:**
- Client-server communication
- State management across components
- Real-time UI updates
- Form handling and validation

**DevOps & Tools:**
- Git version control and collaboration
- Environment configuration management
- Database seeding and migration scripts
- Production deployment preparation


##  Team Roles

| Name     | Role                       |
|----------|----------------------------|
| Brian    | Project Manager + Backend Developer |
| Yash     | Backend Developer          |
| Luke     | Frontend Designer          |
| Eric     | UX & Design Oversight      |
| Corbin   | Senior Technical Advisor   |

---
*Seeking Software Engineering Internship opportunities for Summer 2025*

## 📁 File Structure
