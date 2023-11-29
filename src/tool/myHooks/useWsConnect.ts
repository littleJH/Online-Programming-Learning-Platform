import React, { useEffect } from 'react'

const useWsConnect = (options: { wsApi?: WebSocket; onMessage?: (message: any) => void; onOpen?: () => void; immediately?: boolean }) => {
  const { wsApi, onMessage, onOpen, immediately = true } = options
  let ws: WebSocket

  useEffect(() => {
    immediately && wsApi && connectWs(wsApi)
    const interval = setInterval(() => {
      if (ws && ws.readyState === ws.CLOSED) {
        console.log('reOpenWs...')
        wsApi && connectWs(wsApi)
      }
    }, 5000)
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [])

  const connectWs = (wsApi: WebSocket) => {
    ws = wsApi
    ws.onopen = (e: Event) => {
      console.log('chatWsOpen...')
      onOpen && onOpen()
    }
    ws.onmessage = async (e: MessageEvent) => {
      const message = JSON.parse(e.data)
      console.log('chatWsMessage ==> ', message)
      onMessage && onMessage(message)
    }
    ws.onclose = (e: Event) => {
      console.log('chatWsClose...')
    }
  }

  return { connectWs }
}

export default useWsConnect
