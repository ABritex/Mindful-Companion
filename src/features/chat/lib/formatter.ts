import { Message } from '../actions/schemas';

export function formatMessageForDisplay(message: Message): string {
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  return `[${timestamp}] ${message.role.toUpperCase()}: ${message.content}`;
}

export function formatMessageForStorage(message: Message): string {
  return JSON.stringify({
    ...message,
    timestamp: message.timestamp.toISOString(),
  });
}

export function parseStoredMessage(messageString: string): Message {
  const parsed = JSON.parse(messageString);
  return {
    ...parsed,
    timestamp: new Date(parsed.timestamp),
  };
}

export function formatChatHistory(messages: Message[]): string {
  return messages.map(formatMessageForDisplay).join('\n');
} 