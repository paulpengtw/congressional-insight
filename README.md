# Congressional Insight

A web application for tracking and analyzing congressional meetings and transcripts.

## Chinese Text Constants Implementation

### Overview
All Chinese text in this codebase is managed through constants defined in `app/constants/zh.ts`. This architectural decision was made to:

1. **Improve LLM Processing**: Large Language Models can sometimes struggle with processing Chinese characters directly in code. Using constants reduces this issue.
2. **Type Safety**: Provides TypeScript type checking for Chinese text keys.
3. **Maintainability**: Single source of truth for all Chinese text.
4. **Easier Internationalization**: Makes future i18n implementation simpler.

### Implementation Details

```typescript
// app/constants/zh.ts
export const MEETING = {
  MEETING_CODE: '會議代碼',
  MEETING_TITLE: '會議標題',
  // ... other constants
} as const;

// Usage in components
meeting[MEETING.MEETING_CODE] // instead of meeting.會議代碼
```

### Type System Integration

The constants are integrated with TypeScript's type system:

```typescript
// app/types.ts
type Meeting = {
  [MEETING.MEETING_CODE]: string;
  [MEETING.MEETING_TITLE]: string;
  // ... other fields
}
```

### Benefits

1. **Code Consistency**: Eliminates typos and inconsistencies in Chinese character usage
2. **IDE Support**: Better autocomplete and type checking
3. **Refactoring**: Easier to find and replace text across the codebase
4. **Documentation**: Constants serve as self-documenting code
5. **Performance**: Potential reduction in encoding-related issues

### Contributing Guidelines

When adding new Chinese text to the codebase:

1. Add the text as a constant in `app/constants/zh.ts`
2. Use meaningful English keys that describe the text's purpose
3. Update types if the constant is used in interfaces/types
4. Use bracket notation to access the constants: `object[MEETING.SOME_KEY]`
5. Add optional chaining (`?.`) when accessing nested properties

### Example

```typescript
// ❌ Don't do this
const title = meeting.會議標題;

// ✅ Do this
const title = meeting[MEETING.MEETING_TITLE];
```

## Getting Started

[Add your regular project setup instructions here] 