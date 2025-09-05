export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_MESSAGES_PER_SESSION: 100,
  DEFAULT_SYSTEM_MESSAGE: 'You are a helpful AI assistant.',
  MESSAGE_TYPES: {
    USER: 'user',
    ASSISTANT: 'assistant',
  },
} as const;

export const CHAT_ROUTES = {
  BASE: '/chat',
  NEW: '/chat/new',
  SESSION: (id: string) => `/chat/${id}`,
} as const; 