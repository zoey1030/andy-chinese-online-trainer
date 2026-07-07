import { useState } from 'react'
import { unitOne } from '../data/units'

const MISTAKES_KEY = 'andy-chinese-mistakes'

function readMistakes() {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveFocusWordsToMistakes(focusWords, reason) {
  const mistakes = readMistakes()
  const today = new Date().toISOString().slice(0, 10)
  const sourceMode = `句子仿写：${reason}`

  const nextMistakes = focusWords.reduce((currentMistakes, focusWord) => {
    const wordData = unitOne.words.find((word) => word.word === focusWord)
    if (!wordData) return currentMistakes

    const existing = currentMistakes.find((item) => item.id === wordData.id)

    if (existing) {
      return currentMistakes.map((item) =>
        item.id === wordData.id
          ? {
              ...item,
              word: wordData.word,
              pinyin: wordData.pinyin,
              meaning: wordData.meaning,
              reason,
              sourceMode,
              date: today,
              correctCount: 0,
              count: (item.count || 1) + 1,
            }
          : item,
      )
    }

    return [
      ...currentMistakes,
      {
        id: wordData.id,
        word: wordData.word,
        pinyin: wordData.pinyin,
        meaning: wordData.meaning,
        reason,
        sourceMode,
        date: today,
        correctCount: 0,
        count: 1,
      },
    ]
  }, mistakes)

  localStorage.setItem(MISTAKES_KEY, JSON.stringify(nextMistakes))
}

function SentenceImitationMode({ onBack }) {
  const questions = unitOne.sentenceImitation
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [showReference, setShowReference] = useState(false)
  const [message, setMessage] = useState('')

  const currentQuestion = questions[currentIndex]

  const goNext = () => {
    setCurrentIndex((index) => (index + 1) % questions.length)
    setAnswerText('')
    setShowReference(false)
    setMessage('')
  }

  const markUsage = (result) => {
    if (result === '会用') {
      setMessage('已记录：这一题可以继续在作文里使用。')
      return
    }

    saveFocusWordsToMistakes(currentQuestion.focusWords, result)
    setMessage('已把重点词语加入错词本。')
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <span className="progress-pill">
            第 {currentIndex + 1} 题 / 共 {questions.length} 题
          </span>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">词语进入句子</p>
          <h1>句子仿写</h1>
        </div>

        <article className="prompt-card">
          <div>
            <p className="label">重点词语</p>
            <div className="word-chip-list">
              {currentQuestion.focusWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="label">原句</p>
            <h2 className="sentence-text">{currentQuestion.originalSentence}</h2>
          </div>
          <div>
            <p className="label">句式结构</p>
            <p>{currentQuestion.sentencePattern}</p>
          </div>
          <div>
            <p className="label">仿写要求</p>
            <p>{currentQuestion.prompt}</p>
          </div>
        </article>

        <textarea
          className="writing-area"
          value={answerText}
          onChange={(event) => setAnswerText(event.target.value)}
          rows="6"
          placeholder="在这里输入仿写句。"
        />

        {showReference && (
          <article className="answer-card">
            <p className="label">参考答案</p>
            <h2 className="sentence-text">{currentQuestion.sampleAnswer}</h2>
            <p>
              <strong>说明：</strong>
              {currentQuestion.explanation}
            </p>
          </article>
        )}

        <div className="action-row">
          <button type="button" onClick={() => setShowReference(true)}>
            显示参考答案
          </button>
          <button type="button" onClick={() => markUsage('会用')}>
            会用
          </button>
          <button type="button" onClick={() => markUsage('不自然')}>
            不自然
          </button>
          <button type="button" onClick={() => markUsage('不会用')}>
            不会用
          </button>
          <button className="next-button" type="button" onClick={goNext}>
            下一题
          </button>
        </div>

        {message && <p className="status-text">{message}</p>}
      </section>
    </main>
  )
}

export default SentenceImitationMode
