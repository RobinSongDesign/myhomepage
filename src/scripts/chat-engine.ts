/**
 * Chat logic, loaded on demand the first time the assistant is opened so that
 * marked + DOMPurify never weigh on the initial page load.
 *
 * The server (portfolio-chat.service behind /api/chat) owns the API key and the
 * system prompt, so the browser only sends the visible conversation.
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/** Thrown for any failed request; `status` is the HTTP status when there was one. */
export class ChatError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

export async function ask(endpoint: string, messages: Message[]): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new ChatError(`Chat server responded with ${response.status}`, response.status);
  const data: unknown = await response.json();
  const reply = (data as { reply?: unknown }).reply;
  if (typeof reply !== 'string') throw new ChatError('Chat server returned no reply');
  return reply;
}

/** Model output is untrusted: render its Markdown, then sanitise the HTML. */
export function renderMarkdown(text: string): string {
  const html = marked.parse(text, { async: false, gfm: true, breaks: true }) as string;
  return DOMPurify.sanitize(html);
}
