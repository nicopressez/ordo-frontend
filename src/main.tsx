import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router.tsx'
import { Provider } from 'react-redux'
import { store } from './reducers/store.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router />
  </Provider>
)
