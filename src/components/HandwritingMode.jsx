import { useState } from 'react'
import { unitOne } from '../data/units'
import HandwritingCanvas from './HandwritingCanvas'

const MISTAKES_KEY = 'andy-chinese-mistakes'

function readMistakes() {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMistake(word, reason) {
  const mistakes = readMistakes()
  const today = new Date().toISOString().slice(0, 10)
  const existing = mistakes.find((item) => item.id === word.id)
  const sourceMode = `生字手写：${reason}`

  const nextMistakes = existing
    ? mistakes.map((item) =>
        item.id === word.id
          ? {
              ...item,
              word: word.word,
              pinyin: word.pinyin,
              meaning: word.meaning,
              reason,
              sourceMode,
              date: today,
              correctCount: 0,
              count: (item.count || 1) + 1,
            }
          : item,
      )
    : [
        ...mistakes,
        {
          id: word.id,
          word: word.word,
          pinyin: word.pinyin,
          meaning: word.meaning,
          reason,
          sourceMode,
          date: today,
          correctCount: 0,
          count: 1,
        },
      ]

  localStorage.setItem(MISTAKES_KEY, JSON.stringify(nextMistakes))
}

function HandwritingMode({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [message, setMessage] = useState('')

  const words = unitOne.words
  const currentWord = words[currentIndex]

  const goNext = () => {
    setCurrentIndex((index) => (index + 1) % words.length)
    setShowAnswer(false)
    setMessage('')
  }

  const markResult = (result) => {
    if (result === 'wrong' || result === 'unknown') {
      saveMistake(currentWord, result === 'wrong' ? '写错了' : '完全不会')
      setMessage('已存入错词本。')
      return
    }

    setMessage('已记录：写对了。')
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <span className="progress-pill">
            第 {currentIndex + 1} 题 / 共 {words.length} 题
          </span>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">
            {unitOne.title} · {unitOne.theme}
          </p>
          <h1>生字手写</h1>
        </div>

        <article className="prompt-card">
          <div>
            <p className="label">拼音</p>
            <h2>{currentWord.pinyin}</h2>
          </div>
          <div>
            <p className="label">意思</p>
            <p>{currentWord.meaning}</p>
          </div>
          <div>
            <p className="label">解释</p>
            <p>{currentWord.explanation}</p>
          </div>
        </article>

        {showAnswer && (
          <article className="answer-card">
            <p className="label">正确词语</p>
            <h2>{currentWord.word}</h2>
            <p>
              <strong>例句：</strong>
              {currentWord.example}
            </p>
            <p>
              <strong>记忆方法：</strong>
              {currentWord.memoryTip}
            </p>
            <div>
              <strong>常见错误：</strong>
              <ul>
                {currentWord.wrongExamples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </article>
        )}

        <HandwritingCanvas resetKey={currentWord.id} />

        <div className="action-row">
          <button type="button" onClick={() => setShowAnswer(true)}>
            显示答案
          </button>
          <button type="button" onClick={() => markResult('correct')}>
            写对了
          </button>
          <button type="button" onClick={() => markResult('wrong')}>
            写错了
          </button>
          <button type="button" onClick={() => markResult('unknown')}>
            完全不会
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

export default HandwritingMode
