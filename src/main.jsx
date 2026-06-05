import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'                                    // ← add this
import QuestionPaperBuilder from './createQuestions/QuestionPaperBuilder.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuestionPaperBuilder />
  </StrictMode>,
)