import React, { useEffect } from 'react'

const useWsConnect = (wsApi: () => WebSocket, onMessage: (message: any) => void) => {
  const ws: WebSocket = wsApi()

  useEffect(() => {
    connectWs()
    const interval = setInterval(() => {
      if (ws && ws.readyState === ws.CLOSED) {
        console.log('reOpenWs...')
        connectWs()
      }
    }, 5000)
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [])

  const connectWs = () => {
    ws.onopen = (e: Event) => {
      console.log('chatWsOpen', e)
    }
    ws.onmessage = async (e: MessageEvent) => {
      const message = JSON.parse(e.data)
      console.log('chatWsMessage', message)
      onMessage(message)
    }
    ws.onclose = (e: Event) => {
      console.log('chatWsClose', e)
    }
  }
}

export default useWsConnect
