import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css'

bridge.send('VKWebAppInit')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
