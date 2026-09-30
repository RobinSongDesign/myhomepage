import { useEffect, useRef, useState } from 'react'
import { marked } from 'marked'

const API_URL = '/api/chat'
const VERIFY_URL = '/api/verify'
const ACCESS_KEY_STORAGE = 'hermes_access_key'
const CHAT_ID_STORAGE = 'hermes_chat_id'

interface Message {
  text: string
  sender: 'user' | 'ai'
}

function getAccessKey(): string {
  try {
    return localStorage.getItem(ACCESS_KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

function getChatId(): string {
  try {
    let id = localStorage.getItem(CHAT_ID_STORAGE)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(CHAT_ID_STORAGE, id)
    }
    return id
  } catch {
    return 'c-' + Date.now()
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm Robin's AI assistant. 首次使用请先输入访问密钥（向 Robin 索取），之后就可以直接提问了。",
      sender: 'ai',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages((prev) => [...prev, { text, sender }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const msg = input.trim()
    if (!msg || loading) return
    addMessage(msg, 'user')
    setInput('')
    setLoading(true)

    try {
      const key = getAccessKey()

      // 首次使用：无密钥时，把输入当作访问密钥验证
      if (!key) {
        const res = await fetch(VERIFY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: msg }),
        })
        if (res.ok) {
          localStorage.setItem(ACCESS_KEY_STORAGE, msg)
          addMessage('✓ 访问密钥正确！现在可以开始对话了。', 'ai')
        } else if (res.status === 429) {
          addMessage('尝试太频繁，请稍后再试。', 'ai')
        } else {
          addMessage('密钥不正确。请向 Robin 索取访问密钥后，直接输入密钥即可。', 'ai')
        }
        return
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Access-Key': key },
        body: JSON.stringify({ message: msg, chat_id: getChatId() }),
      })

      if (res.status === 401) {
        localStorage.removeItem(ACCESS_KEY_STORAGE)
        addMessage('访问密钥已失效，请重新输入密钥。', 'ai')
        return
      }
      if (res.status === 429) {
        addMessage('消息太频繁了，请稍等几秒再发。', 'ai')
        return
      }
      if (!res.ok) throw new Error('Server error')

      const data = await res.json()
      addMessage(data.reply ?? '（空回复）', 'ai')
    } catch {
      addMessage("Sorry, I can't reach the server right now.", 'ai')
    } finally {
      setLoading(false)
    }
  }

  const renderMarkdown = (text: string) => {
    try {
      return { __html: marked.parse(text) as string }
    } catch {
      return { __html: text }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none font-sans">
      {/* Chat box */}
      <div
        className={`pointer-events-auto bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-300 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{ width: 'min(480px, 90vw)', height: 'min(520px, 80vh)', display: open ? 'flex' : 'none' }}
      >
        {/* Header */}
        <div className="bg-primary-500 dark:bg-magenta-700 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-semibold text-sm tracking-wide">Robin's AI Assistant</span>
          </div>
          <button onClick={() => setOpen(false)} className="hover:text-gray-200 transition-colors">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 bg-gray-50 dark:bg-dark-100">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 chat-bubble-enter ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                  m.sender === 'user'
                    ? 'bg-gray-400'
                    : 'bg-gradient-to-br from-primary-400 to-primary-600 dark:from-magenta-500 dark:to-magenta-700'
                }`}
              >
                {m.sender === 'user' ? <i className="fas fa-user" /> : 'AI'}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm shadow-sm max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary-500 dark:bg-magenta-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-400 text-gray-700 dark:text-gray-200 rounded-tl-none'
                }`}
                dangerouslySetInnerHTML={m.sender === 'ai' ? renderMarkdown(m.text) : undefined}
              >
                {m.sender === 'user' ? m.text : null}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 dark:from-magenta-500 dark:to-magenta-700 flex items-center justify-center shrink-0 text-white text-xs">
                AI
              </div>
              <div className="bg-white dark:bg-dark-300 p-3 rounded-2xl rounded-tl-none text-sm">
                <i className="fas fa-spinner fa-spin text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-dark-200 border-t border-gray-100 dark:border-dark-300 shrink-0">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              autoComplete="off"
              className="w-full bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-white rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-magenta-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary-500 dark:bg-magenta-600 text-white rounded-full hover:bg-primary-600 dark:hover:bg-magenta-700 transition-colors disabled:opacity-50"
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-arrow-up'} text-xs`} />
            </button>
          </form>
        </div>
      </div>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-magenta-600 dark:to-magenta-800 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center relative"
      >
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-dark-100 rounded-full animate-bounce" />
        <i className="fas fa-robot text-xl" />
      </button>
    </div>
  )
}
