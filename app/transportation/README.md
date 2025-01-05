# Content Processing System

## Overview
The content processing system is designed to handle large text documents by intelligently splitting them into manageable chunks and processing them through OpenAI's API. This system is particularly useful for analyzing lengthy documents like meeting minutes, reports, or any large text content.

## Component Relationships

```mermaid
graph TD
    MeetingDetail[MeetingDetail.tsx] --> AIProcessingPanel[AIProcessingPanel.tsx]
    AIProcessingPanel --> ProcessContentAPI[/api/process-content/route.ts]
    AIProcessingPanel --> ScrapeAPI[/api/scrape/route.ts]
    ProcessContentAPI --> OpenAI[OpenAI API]
    
    subgraph Frontend
        MeetingDetail
        AIProcessingPanel
        AIProcessingPanel --> |State Management| ContentState[Content State]
        AIProcessingPanel --> |UI Controls| ProcessingControls[Processing Controls]
        ProcessingControls --> ChunkSizeInput[Chunk Size Input]
        ProcessingControls --> ProcessTypeSelect[Process Type Select]
        ProcessingControls --> ReprocessButton[Reprocess Button]
    end
    
    subgraph Backend
        ProcessContentAPI
        ScrapeAPI
        OpenAI
    end

    subgraph Data Flow
        ContentState --> |Split| Chunks[Text Chunks]
        Chunks --> |Process| ProcessContentAPI
        ProcessContentAPI --> |Response| ContentState
    end
```

### Component Details

1. **Frontend Components**:
   - `MeetingDetail.tsx`: Parent component that displays meeting information
   - `AIProcessingPanel.tsx`: Main processing interface component
     - Manages content state
     - Handles user interactions
     - Controls content processing flow

2. **Backend Routes**:
   - `/api/process-content/route.ts`: 
     - Handles content processing requests
     - Communicates with OpenAI API
     - Returns processed results
   - `/api/scrape/route.ts`:
     - Handles URL content scraping
     - Returns scraped content for processing

3. **Data Flow**:
   - Content Loading:
     ```
     URL/Document → AIProcessingPanel → Content State
     ```
   - Content Processing:
     ```
     Content State → Chunking → API Route → OpenAI → Combined Results → Content State
     ```

4. **State Management**:
   - Content: Raw and processed text
   - UI States: Loading, error, processing states
   - Configuration: Chunk size, processing type

5. **Processing Pipeline**:
   ```
   Raw Content → Split into Chunks → Process Each Chunk → Combine Results → Display
   ```

### Interaction Flow

1. **User Interactions**:
   ```
   Load Content → Configure Settings → Trigger Processing → View Results
   ```

2. **API Communication**:
   ```
   Frontend Request → API Route → OpenAI Processing → Response → State Update
   ```

3. **Error Handling Flow**:
   ```
   Error Detection → Error State Update → User Notification → Recovery Options
   ```

## Key Components

### 1. AIProcessingPanel (Frontend)
- **Content Loading**: Supports two methods of content input:
  - Direct loading from document URLs
  - URL scraping for web content

- **Processing Controls**:
  - Processing Type Selection:
    - Summarize: Creates concise summaries
    - Analyze: Extracts key points and insights
    - Extract Facts: Pulls out main facts and data points
  - Chunk Size Control: Allows users to adjust the size of text chunks (default: 4000 characters)

- **Smart Chunking System**:
  - Splits content at sentence boundaries to maintain context
  - Preserves semantic integrity of the text
  - Prevents mid-sentence splits
  - Automatically handles large documents by breaking them into processable pieces

### 2. API Route (Backend)
- **Dynamic Processing**: Uses `force-dynamic` to ensure real-time processing
- **CORS Support**: Includes proper headers for cross-origin requests
- **Error Handling**: Comprehensive error catching and reporting
- **Context Awareness**: Each chunk is processed with awareness of its position in the document

## How It Works

1. **Content Splitting**:
   ```typescript
   // Splits text into chunks while preserving sentence boundaries
   const chunks = splitContentIntoChunks(content, chunkSize);
   ```

2. **Chunk Processing**:
   - Each chunk is processed individually
   - Context information is included: "This is part X of Y of the document"
   - Results are collected in sequence

3. **Result Combination**:
   - Processed chunks are combined with separators
   - Maintains readability of the final output

## Usage Tips

1. **Optimal Chunk Size**:
   - Start with the default 4000 characters
   - Adjust based on your content type and OpenAI model limits
   - Smaller chunks for more detailed analysis
   - Larger chunks for better context preservation

2. **Processing Types**:
   - **Summarize**: Best for getting quick overviews
   - **Analyze**: Good for detailed understanding
   - **Extract Facts**: Useful for data-heavy content

3. **Performance Considerations**:
   - Larger chunks mean fewer API calls but might hit token limits
   - Smaller chunks process faster but might lose some context
   - Find the balance based on your specific use case

## Error Handling
- Token limit errors are automatically handled by the chunking system
- Network errors are caught and displayed
- Invalid responses are properly handled and reported

## Technical Implementation
- Built with Next.js App Router
- Uses OpenAI's GPT API
- Implements React state management for UI updates
- Supports both synchronous and asynchronous processing

## Future Improvements
- Add support for more processing types
- Implement parallel processing for faster results
- Add progress indicators for multi-chunk processing
- Support for different language models
- Enhanced error recovery mechanisms 