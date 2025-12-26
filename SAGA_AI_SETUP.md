# Saga AI Chatbot Setup Guide

Your chat interface has been transformed into an AI assistant that answers questions based on your knowledge base.

## What Was Created

### 1. Database Schema
- **knowledge_base** table stores all Q&A content
- Columns: title, question, answer, category, tags
- Full-text search indexes for fast queries
- Row Level Security enabled for data protection

### 2. Edge Function API
- **ask-saga** function processes questions and searches the knowledge base
- Returns relevant answers with related topics
- Handles fuzzy matching for better results
- Deployed at: `YOUR_SUPABASE_URL/functions/v1/ask-saga`

### 3. Frontend Integration
- New `chat-ai.js` file handles AI interactions
- Connects to the Edge Function API
- Supports both text input and voice recognition
- Displays typing indicators and formatted responses

### 4. Sample Knowledge Base
Pre-loaded with examples including:
- Google Tag Manager installation in Prestashop
- Cache clearing procedures
- Google Analytics 4 setup
- Tag Manager best practices
- E-commerce tracking setup
- Troubleshooting guides

## Configuration Steps

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Project Settings" (gear icon)
3. Navigate to "API" section
4. Copy these two values:
   - **Project URL** (example: https://xxxxx.supabase.co)
   - **anon/public key** (starts with "eyJ...")

### Step 2: Configure the Frontend

Edit `js/supabase-config.js` and add your credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 3: Test the Chatbot

1. Open `chat.html` in your browser
2. Wait for Saga to greet you
3. Ask a question like: "How can I install Google Tag Manager in Prestashop?"
4. Saga will search the knowledge base and respond

## Adding More Knowledge

### Option 1: Direct SQL Insert

```sql
INSERT INTO knowledge_base (title, question, answer, category, tags)
VALUES (
  'Your Title',
  'The main question users might ask',
  'Detailed answer with step-by-step instructions',
  'Technical',
  ARRAY['tag1', 'tag2', 'tag3']
);
```

### Option 2: Using Supabase Dashboard

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "knowledge_base" table
4. Click "Insert row"
5. Fill in the fields and save

## Categories You Can Use

- **Technical** - Technical implementations and installations
- **Process** - Business processes and workflows
- **Troubleshooting** - Debugging and problem-solving
- **Product** - Product information and features
- **General** - General information

## How the AI Search Works

1. User asks a question in the chat
2. Frontend sends the question to the Edge Function
3. Edge Function searches the knowledge_base table
4. Searches across title, question, and answer fields
5. Returns the best match with confidence level
6. Shows related topics if available

## Improving Search Results

### Use Descriptive Tags
```sql
tags: ARRAY['Google Tag Manager', 'GTM', 'Prestashop', 'Installation']
```

### Write Natural Questions
Include variations of how users might ask:
```sql
question: 'How can I install Google Tag Manager in Prestashop CMS?'
```

### Provide Detailed Answers
- Use numbered steps
- Include code examples
- Add troubleshooting tips
- Mention common issues

### Use Keywords in Titles
```sql
title: 'Installing Google Tag Manager in Prestashop CMS'
```

## Voice Recognition

The microphone button allows users to ask questions by voice:

1. Press and hold the microphone button
2. Wait for the countdown (3 seconds)
3. Speak your question
4. Release to stop recording
5. Saga will process and respond

Voice recognition language is set to English (en-US) by default.

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can read the knowledge base
- Edge Function validates all requests
- API keys are kept secure in configuration

## Troubleshooting

### Issue: "System is not configured yet"
**Solution**: Add your Supabase credentials to `js/supabase-config.js`

### Issue: No answers returned
**Solution**:
- Check if knowledge_base has data
- Try rephrasing the question
- Add more content to the knowledge base

### Issue: CORS errors in console
**Solution**: The Edge Function includes proper CORS headers. Ensure you're using the correct Supabase URL.

### Issue: Tags not firing in Preview mode
**Solution**: Check your Edge Function deployment and API credentials.

## Next Steps

1. Configure your Supabase credentials
2. Test with the sample questions
3. Add your specific business knowledge
4. Train your team on available topics
5. Monitor questions to identify knowledge gaps
6. Regularly update and expand the knowledge base

## Support

For technical issues or questions:
- Check the Supabase logs in your dashboard
- Review the browser console for errors
- Contact the TechSol SAO team at ts-sme-all@google.com

---

Your Saga AI assistant is ready to help your team access knowledge faster and more efficiently!
