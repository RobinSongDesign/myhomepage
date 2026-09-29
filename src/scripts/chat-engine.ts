/**
 * Chat logic, loaded on demand the first time the assistant is opened so that
 * marked + DOMPurify never weigh on the initial page load.
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KnowledgeBase {
  profile: {
    name: string;
    title: string;
    email?: string;
    birth?: string;
    intro?: string;
    hope?: string;
    bg?: string;
    skills?: string[];
    hobbies?: string[];
    socials?: { github?: string };
  };
  projects: {
    title: string;
    subtitle?: string;
    category?: string;
    description?: string;
    tech_stack?: string[];
    methodology?: string;
    outcomes?: string;
    details?: string;
  }[];
}

const FALLBACK_PROMPT =
  'System Prompt: You are now Robin Song himself. I am unable to load the detailed database right now, but I can chat generally about your role as a Computational Designer.';

/** Builds the system prompt from the knowledge base in /files/botdata.json. */
export async function buildSystemPrompt(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load knowledge base (${response.status})`);
    const { profile, projects } = (await response.json()) as KnowledgeBase;

    let prompt = `System Prompt: You are the AI portfolio assistant for ${profile.name} (${profile.title}). Always pretend to be the portfolio owner and keep the answer brief, no more than 50 words. Be human-like and use some words for greeting.

[Basic Info]
Intro: ${profile.intro ?? ''}
Birth: ${profile.birth ?? ''}
Hope: ${profile.hope ?? ''}
Background: ${profile.bg ?? ''}
Hobbies: ${(profile.hobbies ?? []).join(', ')}
Skills: ${(profile.skills ?? []).join(', ')}
Contact: ${profile.email ?? ''}
Github: ${profile.socials?.github ?? ''}

[Projects Database]
`;

    projects.forEach((project, index) => {
      prompt += `\n### Project ${index + 1}: ${project.title}`;
      if (project.subtitle) prompt += ` - ${project.subtitle}`;
      if (project.category) prompt += `\n   Type: ${project.category}`;
      if (project.description) prompt += `\n   Description: ${project.description}`;
      if (project.tech_stack?.length) prompt += `\n   Tech Stack: ${project.tech_stack.join(', ')}`;
      if (project.methodology) prompt += `\n   Methodology: ${project.methodology}`;
      if (project.outcomes) prompt += `\n   Key Outcomes/Results: ${project.outcomes}`;
      if (project.details) prompt += `\n   Details: ${project.details}`;
      prompt += '\n';
    });

    prompt += `
[Instructions]
1. Answer questions based ONLY on the provided database.
2. If asked about "RL-Building Generator", mention the specific RL algorithms (SAC) and the training steps.
3. If asked about "Seg & Predict", mention the correlation between street views and crime rates.
4. If asked about "StableShape", mention the information in the database.
5. Keep answers professional but conversational.
6. You can reply in English or Chinese based on the user's language.`;

    return prompt;
  } catch (error) {
    console.error('Knowledge base error:', error);
    return FALLBACK_PROMPT;
  }
}

export async function ask(endpoint: string, messages: Message[]): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error(`Chat server responded with ${response.status}`);
  const data: unknown = await response.json();
  const reply = (data as { reply?: unknown }).reply;
  if (typeof reply !== 'string') throw new Error('Chat server returned no reply');
  return reply;
}

/** Model output is untrusted: render its Markdown, then sanitise the HTML. */
export function renderMarkdown(text: string): string {
  const html = marked.parse(text, { async: false, gfm: true, breaks: true }) as string;
  return DOMPurify.sanitize(html);
}
