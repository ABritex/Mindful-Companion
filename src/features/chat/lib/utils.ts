import { Message } from '../actions/schemas';
import { CHAT_CONSTANTS } from '../data/constants';

export function formatMessage(message: Message): string {
  return `${message.role}: ${message.content}`;
}

export function validateMessage(content: string): boolean {
  return content.length <= CHAT_CONSTANTS.MAX_MESSAGE_LENGTH;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
} 