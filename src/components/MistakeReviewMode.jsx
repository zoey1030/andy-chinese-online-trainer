import { useState } from 'react'
import { unitOne } from '../data/units'
import HandwritingCanvas from './HandwritingCanvas'

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

function writeMistakes(mistakes) {
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes))
}

function getFullWord(mistake) {
  return unitOne.words.find((word) => word.id === mistake.id) || mistake
}

function MistakeReviewMode({ onBack }) {
  const [mistakes, setMistakes] = useState(() => readMistakes())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [message, setMessage] = useState('')

  const currentMistake = mistakes[currentIndex]
  const currentWord = currentMistake ? getFullWord(currentMistake) : null

  const refreshMistakes = (nextMistakes) => {
    writeMistakes(nextMistakes)
    setMistakes(nextMistakes)
    setCurrentIndex((index) => {
      if (nextMistakes.length === 0) return 0
      return Math.min(index, nextMistakes.length - 1)
    })
    setShowAnswer(false)
  }

  const goNext = () => {
    if (mistakes.length === 0) return
    setCurrentIndex((index) => (index + 1) % mistakes.length)
    setShowAnswer(false)
    setMessage('')
  }

  const markCorrect = () => {
    const nextMistakes = mistakes
      .map((item) => {
        if (item.id !== currentMistake.id) return item

        const nextCorrectCount = (item.correctCount || 0) + 1
        return {
          ...item,
          correctCount: nextCorrectCount,
          remove: nextCorrectCount >= 2,
        }
      })
      .filter((item) => !item.remove)

    const removed = nextMistakes.length < mistakes.length
    refreshMistakes(nextMistakes)
    setMessage(removed ? '连续写对 2 次，已从错词本移除。' : '写对 1 次，再写对一次就移除。')
  }

  const markWrong = (reason) => {
    const today = new Date().toISOString().slice(0, 10)
    const nextMistakes = mistakes.map((item) =>
      item.id === currentMistake.id
        ? {
            ...item,
            sourceMode: reason,
            reason,
            date: today,
            correctCount: 0,
          }
        : item,
    )

    refreshMistakes(nextMistakes)
    setMessage('已保留在错词本，正确次数归 0。')
  }

  if (!currentWord) {
    return (
      <main className="app">
        <section className="practice">
          <div className="top-bar">
            <button className="secondary-button" type="button" onClick={onBack}>
              返回首页
            </button>
          </div>

          <div className="practice-heading">
            <p className="eyebrow">错词复习</p>
            <h1>错词复仇</h1>
          </div>

          <article className="prompt-card">
            <p>暂无错词，请先完成生字手写练习。</p>
          </article>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <span className="progress-pill">
            第 {currentIndex + 1} 题 / 共 {mistakes.length} 题
          </span>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">连续写对 2 次即可移除</p>
          <h1>错词复仇</h1>
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
            <p>{currentWord.explanation || '暂无解释，可先根据拼音和意思回想词语。'}</p>
          </div>
        </article>

        {showAnswer && (
          <article className="answer-card">
            <p className="label">正确词语</p>
            <h2>{currentWord.word}</h2>
            <p>
              <strong>例句：</strong>
              {currentWord.example || '暂无例句'}
            </p>
            <p>
              <strong>记忆方法：</strong>
              {currentWord.memoryTip || '先把字形、意思和使用场景连起来记。'}
            </p>
          </article>
        )}

        <HandwritingCanvas resetKey={currentMistake.id} />

        <div className="action-row">
          <button type="button" onClick={() => setShowAnswer(true)}>
            显示答案
          </button>
          <button type="button" onClick={markCorrect}>
            写对了
          </button>
          <button type="button" onClick={() => markWrong('错词复仇：又写错了')}>
            又写错了
          </button>
          <button type="button" onClick={() => markWrong('错词复仇：完全不会')}>
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

export default MistakeReviewMode
