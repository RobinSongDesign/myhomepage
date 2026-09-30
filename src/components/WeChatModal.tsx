import { useEffect } from 'react'
import { useUi } from '../context/UiContext'

export default function WeChatModal() {
  const { isWeChatOpen, closeWeChat } = useUi()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWeChat()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeWeChat])

  useEffect(() => {
    document.body.style.overflow = isWeChatOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isWeChatOpen])

  if (!isWeChatOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeWeChat()
      }}
    >
      <div className="bg-white dark:bg-dark-200 rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center transform transition-all">
        <div className="mb-4">
          <img src="/images/weixin.jpg" alt="WeChat QR Code" className="w-48 h-64 mx-auto" />
        </div>
        <button
          onClick={closeWeChat}
          className="px-4 py-2 bg-primary-500 dark:bg-magenta-500 text-white rounded hover:bg-primary-600 dark:hover:bg-magenta-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
