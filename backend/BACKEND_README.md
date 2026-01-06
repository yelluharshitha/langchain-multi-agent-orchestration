# Arogya Wellness Assistant - Backend

## Overview

The Arogya Wellness Assistant backend is a sophisticated Flask-based REST API server that provides intelligent health and wellness consultations through a multi-agent AI orchestration system. The backend integrates advanced language models, retrieval-augmented generation (RAG), and specialized wellness agents to deliver personalized health guidance while maintaining strict safety protocols and ethical standards.

## Architecture

### Technology Stack

- **Framework**: Flask 2.3.3
- **Language**: Python 3.x
- **LLM Integration**: Groq API (OpenAI-compatible)
- **LLM Models**: Llama 3.3 70B Versatile
- **LangChain**: 0.3.0+ (AI orchestration framework)
- **Data Storage**: JSON-based file storage
- **API Communication**: RESTful HTTP with JSON payloads
- **Concurrency**: Asyncio and threading
- **CORS Support**: Flask-CORS for cross-origin requests
- **Production Server**: Gunicorn

### Core Design Principles

- **Multi-Agent Architecture**: Specialized agents handle different wellness aspects (symptoms, lifestyle, diet, fitness)
- **Shared Memory Context**: All agents access a unified conversation buffer for contextual awareness
- **API Key Pool Management**: Round-robin key distribution with cooldown handling for quota management
- **RAG-Enhanced Responses**: Local knowledge base integration for grounded recommendations
- **Streaming Support**: Real-time response streaming for improved user experience
- **Safety-First Approach**: Intent filtering and responsibility disclaimers throughout

## Project Structure

### Root Configuration

- **app.py**: Main Flask application entry point defining all REST API endpoints
- **wsgi.py**: WSGI configuration for production deployment with Gunicorn
- **requirements.txt**: Python dependency specifications

### Config Directory

#### settings.py

Centralized configuration management handling:

- Environment variable loading via `.env` file
- Groq API key configuration
- Model name specification
- YouTube API key management
- Path resolution for environment files

#### logging.py

Logging infrastructure providing:

- Structured logging configuration
- Debug and info level output
- Request/response logging capability
- Error tracking and reporting

### Services Directory

The services layer implements core business logic through specialized modules:

#### **agents.py**

Implements four specialized wellness consultation agents, each with distinct responsibilities:

- **Symptom Agent**: Analyzes reported symptoms for severity assessment and urgency evaluation. Provides guidance on whether immediate medical attention is needed without providing diagnoses.

- **Lifestyle Agent**: Evaluates daily habits, sleep patterns, stress management, and activity levels. Recommends lifestyle modifications aligned with wellness goals.

- **Diet Agent**: Analyzes nutritional habits, dietary preferences, and restrictions. Provides personalized nutrition recommendations based on health profile and wellness objectives.

- **Fitness Agent**: Assesses physical activity levels, fitness goals, and exercise capacity. Recommends appropriate exercise routines and fitness progression strategies.

**Key Features**:

- Shared memory access for context awareness across agents
- RAG-enhanced context retrieval for evidence-based recommendations
- API key management with fallback capabilities
- Structured output generation
- Safety constraints enforcing ethical wellness guidance

#### **orchestrator.py**

Central coordination system managing multi-agent workflows:

- **Agent Invocation**: Sequentially calls all four wellness agents to gather comprehensive insights
- **Output Synthesis**: Combines individual agent outputs into cohesive recommendations
- **Markdown Formatting**: Structures responses in readable markdown format with agent-specific sections
- **Streaming Support**: Implements streaming generator for real-time response delivery
- **Memory Management**: Resets and maintains conversation context across requests
- **State Persistence**: Saves interaction history to persistent storage

**Core Functions**:

- `orchestrate()`: Main orchestration flow executing all agents in sequence
- `stream_agent_updates()`: Streaming generator for progressive response delivery
- `_build_markdown_table()`: Formats agent outputs into structured markdown

#### **memory.py**

Shared conversation buffer management:

- **ConversationBufferMemory**: Maintains chat history across all agents in a single session
- **Global Access**: Provides unified memory instance for all agent interactions
- **Reset Capability**: Clears memory between user sessions to prevent context leakage
- **Message Preservation**: Retains full message objects for comprehensive context

#### **user_auth_store.py**

User authentication and account management:

- **Credential Verification**: Validates username and password combinations
- **User Registration**: Creates new user accounts with credentials
- **Persistent Storage**: JSON-based user credential storage
- **Duplicate Prevention**: Prevents duplicate account creation
- **Data Format**: Stores username, password, and full name information

#### **user_profile_store.py**

User health profile management:

- **Profile Persistence**: Stores and retrieves user health profiles
- **Health Information**: Manages medical history, allergies, preferences, wellness goals
- **Profile Updates**: Enables modification of user health information
- **Per-User Data**: Maintains individual profiles indexed by user ID

#### **history_store.py**

Conversation and interaction history storage:

- **Session Recording**: Stores individual wellness consultation entries
- **Chronological Tracking**: Maintains ordered conversation history
- **User-Specific History**: Organizes interactions by user ID
- **Data Retrieval**: Enables users to review past consultations
- **Append-Only Design**: Maintains immutable historical records

#### **api_key_pool.py**

API key management and quota handling system:

- **Multi-Key Support**: Manages multiple Groq API keys as comma-separated values
- **Round-Robin Distribution**: Implements fair key distribution across requests
- **Cooldown Management**: Temporarily disables keys exceeding quotas (1-hour default)
- **Thread Safety**: Uses locks to ensure thread-safe key operations
- **Automatic Failover**: Switches to alternative keys when primary keys are exhausted

#### **rag.py** (Retrieval-Augmented Generation)

Local knowledge base integration system:

- **Knowledge Base**: Integrates `data/knowledge.json` for domain knowledge
- **Keyword Matching**: Implements lightweight keyword-based retrieval
- **Query Processing**: Extracts relevant knowledge snippets for agent context
- **Graceful Degradation**: Returns empty context if knowledge base unavailable
- **Top-K Retrieval**: Configurable maximum number of matching snippets

#### **youtube_recommendations.py**

Educational content curation system:

- **YouTube Integration**: Integrates YouTube API for video recommendations
- **Content Discovery**: Finds wellness and health-related educational videos
- **Personalized Curation**: Aligns video recommendations with user interests
- **Content Enrichment**: Provides supplementary learning resources
- **API Integration**: Manages YouTube API interactions and queries

### Storage Directory

Persistent data stored as JSON files:

- **users.json**: User credentials and account information
- **user_profiles.json**: Individual user health profiles and preferences
- **history.json**: Conversation history indexed by user ID
- **knowledge.json**: Local knowledge base for RAG system

### Utils Directory

#### **exceptions.py**

Custom exception hierarchy for application-specific error handling:

- **AuthError**: Authentication and authorization failures
- **InputError**: Invalid user input or malformed requests
- **AgentError**: Errors during agent execution
- **Custom Messages**: Descriptive error information for API responses

## API Endpoints

### Authentication Endpoints

#### `POST /login`

User authentication and session establishment.

**Request Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:

```json
{
  "success": true,
  "user_id": "string",
  "username": "string"
}
```

**Error Handling**: Returns 401 with error message for invalid credentials

#### `POST /register`

Create new user account.

**Request Body**:

```json
{
  "username": "string",
  "password": "string",
  "full_name": "string"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Wellness Consultation Endpoints

#### `POST /wellness`

Submit wellness query and receive AI-driven recommendations.

**Request Body**:

```json
{
  "user_id": "string",
  "symptoms": "string",
  "query": "string"
}
```

**Response**: Streaming JSON containing recommendations from all four agents:

```json
{
  "symptom_analysis": "string",
  "lifestyle_recommendations": "string",
  "diet_recommendations": "string",
  "fitness_recommendations": "string"
}
```

### User Profile Endpoints

#### `GET /profile/<user_id>`

Retrieve user health profile.

**Response**:

```json
{
  "user_id": "string",
  "age": "integer",
  "medical_history": "string",
  "allergies": "array",
  "wellness_goals": "array"
}
```

#### `POST /profile/<user_id>`

Update user health profile.

**Request Body**:

```json
{
  "age": "integer",
  "medical_history": "string",
  "allergies": "array",
  "wellness_goals": "array"
}
```

### History Endpoints

#### `GET /history/<user_id>`

Retrieve user consultation history.

**Response**:

```json
[
  {
    "timestamp": "ISO-8601 datetime",
    "query": "string",
    "response": "object"
  }
]
```

### YouTube Recommendations Endpoint

#### `GET /youtube-recommendations/<user_id>`

Get personalized YouTube wellness video recommendations.

**Response**:

```json
{
  "recommendations": [
    {
      "title": "string",
      "url": "string",
      "description": "string"
    }
  ]
}
```

## Core Workflows

### Health Consultation Flow

1. **User Input**: Frontend sends wellness query with user ID and symptom description
2. **Intent Validation**: System validates query is health-related
3. **Memory Initialization**: Shared memory buffer initialized for session
4. **Multi-Agent Processing**:
   - Symptom Agent analyzes reported symptoms
   - Lifestyle Agent evaluates daily patterns
   - Diet Agent assesses nutritional aspects
   - Fitness Agent recommends physical activity
5. **Context Enrichment**: RAG system retrieves relevant knowledge base snippets
6. **Synthesis**: Synthesizer LLM combines all agent outputs
7. **Streaming Response**: Results streamed progressively to frontend
8. **History Persistence**: Interaction saved to user history

### Authentication Flow

1. User submits credentials (login or registration)
2. System validates credentials against stored users
3. Session established with user ID returned
4. User ID used for all subsequent personalized operations

## Safety and Compliance

### Safety Mechanisms

- **Intent Filtering**: All queries validated to ensure health/wellness relevance
- **Disclaimer Requirements**: Responses include appropriate medical disclaimers
- **Symptom-Only Analysis**: System explicitly avoids diagnosis
- **Escalation Guidance**: Recommends professional medical consultation when appropriate
- **Ethical Constraints**: Prevents provision of inappropriate medical advice

### Data Privacy

- **User Isolation**: Each user's profile and history stored separately
- **Secure Storage**: JSON-based storage with appropriate file permissions
- **No Third-Party Sharing**: Data remains within system
- **Password Storage**: Plain text (recommend encryption enhancement for production)

## Configuration and Deployment

### Environment Setup

Create a `.env` file in the project root:

```
GROQ_API_KEY=key1,key2,key3
GROQ_MODEL_NAME=llama-3.3-70b-versatile
YOUTUBE_API_KEY=your_youtube_api_key
```

### Installation

```bash
pip install -r requirements.txt
```

### Development Server

```bash
python -m flask run
```

Server runs on `http://localhost:5000` with CORS enabled for all origins.

### Production Deployment

```bash
gunicorn -w 4 -b 0.0.0.0:8000 healthbackend.wsgi:app
```

Use production-grade server configuration:

- Multiple worker processes for concurrency
- Proper logging and monitoring
- HTTPS/SSL certificates
- API rate limiting
- Request/response size limits

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request**: Invalid input or malformed requests
- **401 Unauthorized**: Authentication failures
- **500 Internal Server Error**: Unexpected system errors

Error responses include descriptive messages:

```json
{
  "error": "Descriptive error message explaining the issue"
}
```

## Performance Optimization

### API Key Management

- **Round-Robin Distribution**: Evenly distributes load across available keys
- **Quota Awareness**: Automatically handles quota exceeded scenarios
- **Cooldown Mechanism**: 1-hour cooldown for exhausted keys prevents repeated failures

### Streaming Responses

- **Progressive Delivery**: Responses streamed incrementally for better UX
- **Reduced Latency**: Users see results as they become available
- **Memory Efficiency**: Large responses handled without buffering entirely

### Caching and Context

- **Shared Memory Buffer**: Reuses context across agents within session
- **RAG Integration**: Reduces redundant knowledge base lookups
- **History Indexing**: User-based indexing for quick history retrieval

## Development Best Practices

### Adding New Agents

1. Create agent function in `services/agents.py`
2. Implement memory access and RAG context retrieval
3. Define system prompt with safety constraints
4. Register in orchestrator workflow
5. Update markdown table generation for output

### Extending Knowledge Base

1. Add entries to `data/knowledge.json`
2. Include "content" field for keyword matching
3. Test retrieval with sample queries
4. Validate RAG context enhancement

### API Enhancements

1. Define new endpoint in `app.py`
2. Implement request validation
3. Add appropriate error handling
4. Update API documentation
5. Test with frontend integration

## Dependencies

### Core Framework

- Flask: Web application framework
- Flask-CORS: Cross-origin request support
- Gunicorn: WSGI HTTP server

### AI and LangChain

- langchain: AI orchestration framework
- langchain-openai: OpenAI-compatible client
- openai: OpenAI library for integration

### Utilities

- python-dotenv: Environment variable management
- requests: HTTP client library

## Monitoring and Logging

The application provides structured logging for:

- Request/response tracking
- Agent execution status
- Memory state changes
- API key utilization
- Error conditions and exceptions

Configure logging levels in `config/logging.py` for different environments.

## Testing Recommendations

### Unit Tests

- Test individual agent outputs
- Verify memory isolation between sessions
- Validate RAG context retrieval
- Test API key pool round-robin

### Integration Tests

- End-to-end wellness consultation flow
- Multi-agent orchestration
- User authentication and authorization
- History persistence and retrieval

### Load Testing

- API key quota management under load
- Concurrent user session handling
- Streaming response performance
- Memory management with long conversations

## Future Enhancements

- Vector database integration for advanced RAG
- Database migration from JSON to relational storage
- Enhanced security with JWT tokens
- API rate limiting per user
- Advanced analytics and health insights
- Integration with health tracking APIs
- Machine learning-based personalization
- Encrypted credential storage

## Troubleshooting

### API Key Quota Errors

If all keys are in cooldown, the system will return an error. Solutions:

- Wait for cooldown period (1 hour default)
- Add additional API keys to `.env`
- Reduce query frequency temporarily

### Knowledge Base Not Found

If RAG context is empty:

- Ensure `data/knowledge.json` exists and is valid JSON
- Check file permissions
- Verify knowledge base content format

### Memory Leaks

Shared memory cleared at:

- End of wellness consultation
- User logout
- Session timeout

Monitor conversation history length for long sessions.

## Contributing

When contributing to the backend:

- Follow Python PEP 8 style guidelines
- Implement comprehensive error handling
- Maintain safety constraints in agent prompts
- Add docstrings to all functions
- Test with multiple agents and scenarios
- Document new API endpoints
- Update configuration requirements
