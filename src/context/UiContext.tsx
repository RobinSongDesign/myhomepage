import { createContext, useCallback, useContext, useState } from 'react'

interface UiContextValue {
  isWeChatOpen: boolean
  openWeChat: () => void
  closeWeChat: () => void
}

const UiContext = createContext<UiContextValue>({
  isWeChatOpen: false,
  openWeChat: () => {},
  closeWeChat: () => {},
})

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [isWeChatOpen, setIsWeChatOpen] = useState(false)
  const openWeChat = useCallback(() => setIsWeChatOpen(true), [])
  const closeWeChat = useCallback(() => setIsWeChatOpen(false), [])

  return (
    <UiContext.Provider value={{ isWeChatOpen, openWeChat, closeWeChat }}>
      {children}
    </UiContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUi() {
  return useContext(UiContext)
}
