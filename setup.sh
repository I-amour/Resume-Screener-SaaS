#!/bin/bash

echo "🚀 Setting up Resume Screener SaaS Application..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS. Please install dependencies manually."
    exit 1
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first: https://brew.sh"
    exit 1
fi

echo "📦 Installing system dependencies..."

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    brew install node
else
    echo "✅ Node.js already installed"
fi

# Install Python
if ! command -v python3 &> /dev/null; then
    echo "Installing Python..."
    brew install python@3.11
else
    echo "✅ Python already installed"
fi

# Install PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    brew install postgresql
    brew services start postgresql
    
    # Create database
    echo "Creating database..."
    createdb resume_screener 2>/dev/null || echo "Database might already exist"
else
    echo "✅ PostgreSQL already installed"
    brew services start postgresql 2>/dev/null || true
fi

# Setup project structure
echo "📁 Setting up project structure..."
mkdir -p resume-screener-saas
cd resume-screener-saas

# Setup Frontend
echo "🎨 Setting up frontend..."
if [ ! -d "frontend" ]; then
    npx create-vite@latest frontend --template react-ts --yes
fi

cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
npm install axios framer-motion react-dropzone lucide-react @headlessui/react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

cd ..

# Setup Backend
echo "🔧 Setting up backend..."
mkdir -p backend
cd backend

# Create Python virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing backend dependencies..."
source venv/bin/activate
pip install --upgrade pip

# Create requirements.txt if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
PyPDF2==3.0.1
openai==1.3.0
pydantic==2.0.0
python-docx==1.1.0
EOF
fi

pip install -r requirements.txt

cd ..

# Create environment file
echo "⚙️  Creating environment configuration..."
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# OpenAI API Configuration (optional - app works with mock data)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres@localhost/resume_screener

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
fi

# Create startup scripts
echo "📜 Creating startup scripts..."

# Backend start script
cat > start-backend.sh << EOF
#!/bin/bash
cd backend
source venv/bin/activate
python main.py
EOF
chmod +x start-backend.sh

# Frontend start script
cat > start-frontend.sh << EOF
#!/bin/bash
cd frontend
npm run dev
EOF
chmod +x start-frontend.sh

# Combined start script
cat > start-app.sh << EOF
#!/bin/bash
echo "🚀 Starting Resume Screener SaaS..."

# Start backend in background
echo "Starting backend server..."
./start-backend.sh &
BACKEND_PID=\$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
./start-frontend.sh &
FRONTEND_PID=\$!

echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
wait

# Cleanup
kill \$BACKEND_PID \$FRONTEND_PID 2>/dev/null
EOF
chmod +x start-app.sh

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set your OpenAI API key in backend/.env (optional - app works with mock data)"
echo "2. Run: ./start-app.sh"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo ""
echo "📝 Notes:"
echo "   - The app works with mock AI analysis if no OpenAI API key is provided"
echo "   - PostgreSQL database will be created automatically"
echo "   - Upload PDF, DOC, or DOCX files to test the resume screening"