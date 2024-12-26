//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// @ts-ignore
import App from './App.jsx'

if (! document.getElementById('myRoot')){
  const myRoot = document.createElement('div');
  myRoot.id = 'myRoot';
  document.querySelector('body')?.appendChild(myRoot)
}

createRoot(document.getElementById('myRoot')!).render(

    <App />

)
