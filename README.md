# 🎓 SmartEd - AI-Powered Learning Platform

<div align="center">

![SmartEd Banner](https://img.shields.io/badge/SmartEd-AI%20Learning%20Platform-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**An intelligent study companion that transforms textbooks into personalized learning experiences**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**SmartEd** is an AI-powered educational platform designed specifically for **+2 science students** preparing for board exams and entrance tests. It acts as a virtual teacher that converts PDFs/textbooks into structured daily lessons, generates intelligent assessments, and adapts to each student's learning capability using advanced AI algorithms.

### 🎯 Problem Statement

Students often struggle with:
- **Overwhelming Study Material**: Large textbooks without clear study schedules
- **Lack of Personalization**: One-size-fits-all learning approaches
- **Limited Practice Resources**: Insufficient quality questions for practice
- **No Real-time Assistance**: Unable to get instant clarification on doubts
- **Progress Tracking**: Difficulty in monitoring learning progress and identifying weak areas

### 💡 Solution

SmartEd addresses these challenges by providing:
- **Automated Schedule Generation**: AI creates personalized day-wise study plans from uploaded PDFs
- **Intelligent Content Delivery**: Breaks down complex topics into digestible subtopics
- **Dynamic Assessment**: Generates contextual MCQs and mock tests
- **AI Study Assistant**: 24/7 chatbot for doubt clarification with context awareness
- **Performance Analytics**: Tracks progress and provides insights on strengths/weaknesses
- **Community Learning**: Connect with peers, share insights, and discuss topics

---

## ✨ Features

### 📚 Core Learning Features

#### 1. **PDF Upload & Smart Scheduling**
- Upload textbooks/study materials in PDF format
- AI automatically extracts Table of Contents (TOC)
- Generates structured day-wise study schedules based on user-defined duration
- OCR support for scanned PDFs using Tesseract and pdf2image
- Cloudinary integration for secure file storage

#### 2. **Adaptive Content Generation**
- AI breaks down chapters into topics and subtopics
- Generates detailed explanations with examples
- Context-aware content delivery based on schedule
- Supports mathematical equations with KaTeX rendering
- Caches generated content for faster subsequent access

#### 3. **AI Chatbot Study Assistant**
- Context-aware chatbot that understands current study material
- Provides instant clarification on topics and subtopics
- Supports mathematical notation in responses
- Maintains conversation history for better context
- RAG (Retrieval-Augmented Generation) powered for accurate responses

#### 4. **MCQ Generation System**
- Automatically generates Multiple Choice Questions from study content
- Machine Learning models for:
  - **Question Generation**: Creates relevant questions from context
  - **Distractor Generation**: Generates plausible wrong options
  - **Keyword Extraction**: Identifies key concepts
- Configurable difficulty levels
- Instant scoring and performance feedback
- Day-wise MCQ practice aligned with study schedule

#### 5. **Mock Test System**
- Full-length practice exams for entrance preparation
- Supports multiple exam types (IOE, IOM, etc.)
- Timed tests with countdown timer
- Detailed performance analysis
- Score tracking and performance trends

#### 6. **Short Notes Generation**
- AI generates concise summary notes for each day's content
- Multiple note types support
- Perfect for quick revision before exams
- Cached for offline access

### 📊 Progress & Performance Tracking

#### 7. **Performance Analytics**
- Day-wise score tracking
- Performance level classification (Excellent, Good, Average, Needs Improvement)
- Visual progress charts using Chart.js
- Identifies weak areas for focused improvement

#### 8. **Study Progress Tracker**
- Tracks completion percentage of study schedule
- Visual doughnut charts for progress visualization
- Multiple course tracking support
- Motivational progress indicators

### 🌐 Community & Collaboration

#### 9. **Community Forum**
- Create posts with text and images
- Like, comment, and engage with peer discussions
- Share study tips and insights
- Follow/unfollow study partners

#### 10. **Entrance News & Updates**
- Real-time scraping of entrance exam news (IOE, IOM)
- Automated scheduler for periodic news updates
- Centralized dashboard for all exam-related announcements
- Web scraping using BeautifulSoup

### 🎯 Predefined Study Plans

#### 11. **Pre-built Course Content**
- Ready-to-use study plans for popular subjects
- 30-day structured learning paths
- No PDF upload required for predefined courses
- Admin-managed content creation

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Dashboard │  │ Service  │  │Community │  │ Progress │       │
│  │   View   │  │   View   │  │  Forum   │  │ Tracker  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes                            │  │
│  │  /auth  /pdf  /content  /mcq  /chat  /mock  /notes     │  │
│  │  /performance  /progress  /community  /entrance-news    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┼─────────────────────────────────┐  │
│  │         Services       │        ML Models                │  │
│  │  • Content Generator   │  • Question Generation         │  │
│  │  • MCQ Generator       │  • Distractor Generation       │  │
│  │  • Notes Summarizer    │  • Keyword Extraction          │  │
│  │  • Chatbot (RAG)       │                                 │  │
│  │  • PDF Processor       │                                 │  │
│  │  • Web Scraper         │                                 │  │
│  └────────────────────────┴─────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴─────────────────────────────────┐  │
│  │                  Data Layer                              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │  │
│  │  │ MongoDB  │  │Cloudinary│  │  FAISS   │             │  │
│  │  │  (Data)  │  │  (Files) │  │(Vectors) │             │  │
│  │  └──────────┘  └──────────┘  └──────────┘             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  • Google Gemini / Groq / Azure OpenAI (LLM)                   │
│  • Clerk Authentication                                         │
│  • Google Custom Search API                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

#### PDF Upload Flow
```
User uploads PDF → Compute MD5 hash → Check if exists in DB
                                      ↓
                        NO ← Is it scanned? → YES
                        ↓                      ↓
              Extract TOC directly    Run OCR (Tesseract)
                        ↓                      ↓
                     Upload to Cloudinary ←────┘
                        ↓
              Generate study schedule (AI)
                        ↓
              Store in MongoDB + Create vector embeddings
                        ↓
              Return schedule to user
```

#### Content Generation Flow
```
User selects topic → Check cache in MongoDB
                                ↓
                        Found? → YES → Return cached content
                          ↓ NO
                    Fetch from PDF (page range)
                          ↓
                    Generate content (LLM)
                          ↓
                    Cache in MongoDB
                          ↓
                    Return to user
```

#### MCQ Generation Flow
```
User requests MCQs → Check cache
                        ↓ (if not found)
              Fetch full day's content
                        ↓
              Generate questions (ML Model)
                        ↓
              Generate distractors (ML Model)
                        ↓
              Format & cache MCQs
                        ↓
              Return to user
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.3 with React 19
- **Styling**: Tailwind CSS 4.0
- **Authentication**: Clerk (@clerk/nextjs)
- **Animations**: Framer Motion, Lottie React, AOS
- **Charts**: Chart.js with react-chartjs-2
- **Markdown**: React Markdown with KaTeX support
- **Icons**: Lucide React, React Icons
- **Notifications**: React Hot Toast
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (PyMongo + Motor for async operations)
- **File Storage**: Cloudinary
- **Vector Database**: FAISS (Facebook AI Similarity Search)
- **LLM Integration**:
  - Google Gemini (gemini-2.5-flash)
  - Groq (llama-3.3-70b-versatile)
  - Azure OpenAI
  - LangChain for orchestration
- **ML Libraries**:
  - Transformers (Hugging Face)
  - PyTorch
  - PEFT (Parameter-Efficient Fine-Tuning)
  - Sentence Transformers
- **OCR**: Tesseract, pdf2image, Pillow
- **PDF Processing**: PyMuPDF, PyPDF, ReportLab
- **Web Scraping**: BeautifulSoup4, Requests
- **Task Scheduling**: APScheduler
- **Authentication**: JWT (PyJWT)
- **Security**: Passlib with Argon2

### AI/ML Models
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Question Generation**: Custom fine-tuned transformer models
- **Distractor Generation**: Custom ML model
- **Keyword Extraction**: Custom ML model

---

## 📦 Installation

### Prerequisites
- **Node.js**: v18+ (for Next.js frontend)
- **Python**: 3.10+ (for FastAPI backend)
- **MongoDB**: Local instance or MongoDB Atlas
- **Tesseract OCR**: For scanned PDF processing
- **Poppler**: For PDF to image conversion

### Environment Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/AayushSinghRajput/SmartEd-MajorProject.git
cd SmartEd-MajorProject
```

#### 2. Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `server` directory:

```env
# LLM API Keys (Choose at least one)
GOOGLE_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
AZURE_OPENAI_API_KEY=your_azure_api_key_here
AZURE_OPENAI_ENDPOINT=your_azure_endpoint_here
AZURE_OPENAI_DEPLOYMENT=your_deployment_name_here
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Google Search (for entrance news scraping)
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Database Configuration
MONGO_URI=mongodb://localhost:27017/
DB_NAME=smarted_db

# JWT Configuration
JWT_SECRET=your_secure_random_string_here
JWT_ALGORITHM=HS256

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OCR Paths (Windows example)
POPPLER_PATH=C:/Program Files/poppler/Library/bin
TESSERACT_PATH=C:/Program Files/Tesseract-OCR/tesseract.exe

# Environment
ENV=development
```

#### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install
```

Create a `.env.local` file in the `client` directory:

```env
# Clerk Authentication (Get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Usage

### Running the Application

#### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

#### 2. Start Backend Server
```bash
cd server
uvicorn main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

#### 3. Start Frontend
```bash
cd client
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Using the Platform

#### For Students:

1. **Sign Up / Login**
   - Create an account using email
   - Secured with Clerk authentication

2. **Upload Study Material**
   - Go to Dashboard → Click "Upload PDF"
   - Select your textbook/study material
   - Specify number of study days
   - AI generates personalized schedule

3. **Study Daily Content**
   - Navigate through day-wise schedule
   - Read AI-generated explanations
   - Ask questions to AI chatbot
   - Complete MCQ practice

4. **Track Progress**
   - View performance analytics
   - Monitor study completion percentage
   - Identify weak areas

5. **Take Mock Tests**
   - Practice full-length exams
   - Get instant scoring
   - Review performance trends

6. **Join Community**
   - Share study insights
   - Discuss topics with peers
   - Stay updated with entrance news

#### For Administrators:

1. **Create Predefined Study Plans**
   - Use `/api/ai/predefined-study-plan` endpoint
   - Define 30-day structured courses
   - Manage subject-wise content

2. **Monitor System**
   - Check user engagement
   - Review performance metrics
   - Manage community posts

---

## 🗂️ Project Structure

```
SmartEd-MajorProject/
├── client/                      # Next.js Frontend
│   ├── animations/              # Lottie animation files
│   ├── api/                     # API service functions
│   ├── assets/                  # Static assets
│   ├── components/              # React components
│   │   ├── Community/           # Community feature components
│   │   ├── EntranceNews/        # News components
│   │   ├── Service/             # Study service components
│   │   └── ui/                  # Reusable UI components
│   ├── constants/               # Constants and configurations
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   ├── pages/                   # Next.js pages
│   ├── public/                  # Public assets
│   ├── styles/                  # Global styles
│   └── utils/                   # Utility functions
│
├── server/                      # FastAPI Backend
│   ├── core/                    # Core configurations
│   │   ├── config.py            # Environment settings
│   │   └── llm.py              # LLM provider configuration
│   ├── db/                      # Database configurations
│   │   ├── config.py            # MongoDB setup
│   │   └── cloudinary.py       # Cloudinary integration
│   ├── middleware/              # Authentication middleware
│   ├── ml_model/                # ML models
│   │   ├── distractor_model/   # MCQ distractor generation
│   │   ├── keyword_model/      # Keyword extraction
│   │   └── question_model/     # Question generation
│   ├── prompts/                 # LLM prompts
│   │   ├── chat/               # Chatbot prompts
│   │   ├── content/            # Content generation prompts
│   │   ├── notes_summary/      # Notes generation prompts
│   │   └── pdf_upload/         # PDF processing prompts
│   ├── routes/                  # API endpoints
│   │   ├── auth.py             # Authentication routes
│   │   ├── pdf.py              # PDF upload & processing
│   │   ├── content.py          # Content generation
│   │   ├── mcq.py              # MCQ generation
│   │   ├── chat_api.py         # Chatbot API
│   │   ├── mock_routes.py      # Mock test routes
│   │   ├── notes_summarizer.py # Notes generation
│   │   ├── predefined.py       # Predefined plans
│   │   ├── performance.py      # Performance tracking
│   │   ├── progress.py         # Progress tracking
│   │   ├── community.py        # Community features
│   │   └── entrance_news.py    # News scraping
│   ├── schemas/                 # Pydantic schemas
│   ├── services/                # Business logic
│   │   ├── auth/               # Authentication service
│   │   ├── chatbot/            # Chatbot service
│   │   ├── content/            # Content generation
│   │   ├── mcq/                # MCQ generation
│   │   ├── mock_exam/          # Mock test service
│   │   ├── notes_summary/      # Notes generation
│   │   ├── pdf_upload/         # PDF processing
│   │   ├── pdf_upload_ocr/     # OCR service
│   │   ├── rag/                # RAG implementation
│   │   ├── performance_service/
│   │   ├── progress_service/
│   │   ├── community_service/
│   │   ├── predefined_service/
│   │   └── scraper_service/    # Web scraping
│   ├── utils/                   # Utility functions
│   ├── vector_store/            # FAISS vector storage
│   ├── main.py                  # FastAPI entry point
│   └── requirements.txt         # Python dependencies
│
└── README.md                    # Project documentation
```

---

## 🔑 Key Components Explained

### Content Generation Pipeline
1. **PDF Processing**: Extract text and structure using PyMuPDF
2. **TOC Extraction**: Parse table of contents to identify chapters
3. **Schedule Generation**: AI creates day-wise breakdown
4. **Content Generation**: LangChain + LLM generates explanations
5. **Caching**: Store in MongoDB for performance

### MCQ Generation System
1. **Content Fetching**: Retrieve day's full study material
2. **Question Generation**: ML model creates relevant questions
3. **Distractor Generation**: ML model generates plausible wrong options
4. **Validation**: Ensure question quality and relevance
5. **Storage**: Cache in database with PDF hash and day mapping

### RAG Chatbot
1. **Ingestion**: PDF chunked and embedded using Sentence Transformers
2. **Vector Storage**: FAISS stores embeddings for fast retrieval
3. **Query Processing**: User question embedded and similarity search performed
4. **Context Injection**: Retrieved chunks injected into LLM prompt
5. **Response Generation**: LLM generates contextually accurate answer

### OCR Pipeline
1. **Detection**: Check if PDF is scanned (low text extraction ratio)
2. **Conversion**: Convert PDF pages to images using pdf2image
3. **OCR**: Tesseract extracts text from images
4. **Reconstruction**: Create searchable PDF using ReportLab
5. **Processing**: Continue normal pipeline with searchable PDF

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Argon2 algorithm for password security
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Pydantic schemas for request validation
- **Protected Routes**: Middleware-based route protection
- **Environment Variables**: Sensitive data in .env files

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Prepared for dark theme implementation
- **Smooth Animations**: Framer Motion for fluid interactions
- **Loading States**: Skeleton screens and loading indicators
- **Toast Notifications**: User-friendly feedback messages
- **Progress Visualization**: Charts and progress bars
- **Accessibility**: Semantic HTML and ARIA labels

---

## 📊 Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  created_at: DateTime,
  clerk_id: String (optional)
}
```

#### PDFs
```javascript
{
  _id: ObjectId,
  original_hash: String,
  pdf_hash: String,
  was_scanned: Boolean,
  toc: Array,
  pdf_url: String,
  book_name: String,
  image_url: String,
  user_id: String,
  created_at: DateTime
}
```

#### Schedules
```javascript
{
  _id: ObjectId,
  pdf_hash: String,
  user_id: String,
  book_name: String,
  schedule: [
    {
      day: Number,
      topics: [
        {
          chapter: String,
          topic: String,
          subtopics: [String],
          page_range: String
        }
      ]
    }
  ],
  created_at: DateTime
}
```

#### Content Cache
```javascript
{
  _id: ObjectId,
  book_id: String,
  day_number: Number,
  topic_index: Number,
  subtopic_index: Number,
  chapter: String,
  topic: String,
  content: String,
  page_range: String,
  images: [String],
  created_at: DateTime
}
```

#### MCQs
```javascript
{
  _id: ObjectId,
  pdf_hash: String,
  day_number: Number,
  mcqs: [
    {
      question: String,
      options: [String],
      correct_answer: String,
      explanation: String
    }
  ],
  created_at: DateTime
}
```

#### Performance
```javascript
{
  _id: ObjectId,
  user_id: String,
  pdf_hash: String,
  day_wise_scores: [
    {
      day: Number,
      score: Number,
      total: Number,
      percentage: Number,
      performance_level: String,
      timestamp: DateTime
    }
  ]
}
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Study Management
- `POST /api/study/upload-and-schedule` - Upload PDF and generate schedule
- `GET /api/study/schedule/{pdf_hash}` - Get study schedule
- `DELETE /api/study/delete/{pdf_hash}` - Delete PDF and schedule
- `GET /api/study/user-plans` - Get user's study plans

### Content
- `POST /api/content/generate` - Generate topic content

### MCQ
- `POST /api/mcq/generate` - Generate MCQs for a day

### Notes
- `POST /api/notes/summarize` - Generate short notes

### Chat
- `POST /api/chat/aichat` - Chat with AI assistant

### Mock Tests
- `POST /api/exams/` - Create mock test
- `GET /api/exams/{mock_type}` - Get mock test

### Performance
- `POST /api/performance/submit-mcq` - Submit MCQ score
- `GET /api/performance/get` - Get performance data

### Progress
- `POST /api/progress/update` - Update study progress

### Community
- `POST /api/community/` - Create post
- `GET /api/community/` - Get all posts
- `POST /api/community/{post_id}/like` - Like post
- `POST /api/community/{post_id}/comment` - Add comment

### Predefined Plans
- `POST /api/ai/predefined-study-plan` - Create predefined plan
- `GET /api/ai/predefined-study-plan/{subject}` - Get plan by subject
- `GET /api/ai/predefined-study-plans` - Get all plans

### Entrance News
- `POST /api/entrance-news/scrape` - Scrape news
- `GET /api/entrance-news/ioe` - Get IOE news
- `GET /api/entrance-news/iom` - Get IOM news

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer**: Aayush Singh Rajput
- GitHub: [@AayushSinghRajput](https://github.com/AayushSinghRajput)

---

## 🙏 Acknowledgments

- **LangChain**: For LLM orchestration framework
- **Hugging Face**: For transformer models and embeddings
- **Google Gemini**: For advanced language model capabilities
- **MongoDB**: For flexible document storage
- **Cloudinary**: For reliable file storage
- **Vercel & Next.js**: For excellent frontend framework
- **FastAPI**: For high-performance backend framework

---

## 📞 Support

For support, email aayushsinghrajput3003@gmail.com or open an issue in the GitHub repository.

---

## 🚧 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Video lecture integration
- [ ] Voice-based learning
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Collaborative study rooms
- [ ] Gamification features
- [ ] Integration with more entrance exams
- [ ] Teacher/mentor dashboard
- [ ] Advanced ML models for better content generation

---

<div align="center">

**Made with ❤️ for students aspiring to excel in their academic journey**

⭐ Star this repo if you find it helpful!

</div>
