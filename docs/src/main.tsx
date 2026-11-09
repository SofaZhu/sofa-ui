import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { setPrimaryColor, setDarkMode } from 'sofa-ui'
import '@sofa/styles/index.css'
import '@sofa/styles/dark.css'
import './demo.css'

// 初始化默认主题：主色 #8A2BE2，全色系由主色调配注入
setPrimaryColor('#8A2BE2')

// 读取本地暗色偏好
if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
  setDarkMode(true)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)