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

function saveStoryMistake(word, reason) {
  const mistakes = readMistakes()
  const today = new Date().toISOString().slice(0, 10)
  const sourceMode = `故事闯关：${reason}`
  const existing = mistakes.find((item) => item.id === word.id)

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

function getWord(wordId) {
  return unitOne.words.find((word) => word.id === wordId)
}

function StoryMode({ onBack }) {
  const story = unitOne.story
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [message, setMessage] = useState('')
  const [completed, setCompleted] = useState(false)

  const currentBlank = story.blanks[currentIndex]
  const currentWord = currentBlank ? getWord(currentBlank.wordId) : null
  const practicedWords = story.blanks.map((blank) => getWord(blank.wordId)).filter(Boolean)

  const goNext = () => {
    if (currentIndex >= story.blanks.length - 1) {
      setCompleted(true)
      setMessage('')
      return
    }

    setCurrentIndex((index) => index + 1)
    setShowAnswer(false)
    setMessage('')
  }

  const markResult = (result) => {
    if (result === 'wrong' || result === 'unknown') {
      saveStoryMistake(currentWord, result === 'wrong' ? '写错了' : '完全不会')
      setMessage('已存入错词本。')
      return
    }

    setMessage('已记录：写对了。')
  }

  if (completed) {
    return (
      <main className="app">
        <section className="practice">
          <div className="top-bar">
            <button className="secondary-button" type="button" onClick={onBack}>
              返回首页
            </button>
          </div>

          <div className="practice-heading">
            <p className="eyebrow">{story.title}</p>
            <h1>今日故事完成！</h1>
          </div>

          <article className="prompt-card">
            <p className="label">今日练习词语：</p>
            <div className="word-chip-list">
              {practicedWords.map((word) => (
                <span key={word.id}>{word.word}</span>
              ))}
            </div>
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
            第 {currentIndex + 1} 空 / 共 {story.blanks.length} 空
          </span>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">故事闯关</p>
          <h1>{story.title}</h1>
        </div>

        <article className="story-card">
          <p className="label">故事背景</p>
          <p>{story.background}</p>
        </article>

        <article className="prompt-card">
          <div>
            <p className="label">当前句子</p>
            <h2 className="story-sentence">{currentBlank.sentence}</h2>
          </div>
          <div className="hint-grid">
            <div>
              <p className="label">拼音</p>
              <p>{currentWord.pinyin}</p>
            </div>
            <div>
              <p className="label">意思</p>
              <p>{currentWord.meaning}</p>
            </div>
          </div>
        </article>

        {showAnswer && (
          <article className="answer-card">
            <p className="label">正确答案</p>
            <h2>{currentWord.word}</h2>
            <p>
              <strong>例句：</strong>
              {currentWord.example}
            </p>
            <p>
              <strong>记忆方法：</strong>
              {currentWord.memoryTip}
            </p>
          </article>
        )}

        <HandwritingCanvas resetKey={currentBlank.id} />

        <div className="action-row">
          <button type="button" onClick={() => setShowAnswer(true)}>
            显示答案
          </button>
          {showAnswer && (
            <>
              <button type="button" onClick={() => markResult('correct')}>
                写对了
              </button>
              <button type="button" onClick={() => markResult('wrong')}>
                写错了
              </button>
              <button type="button" onClick={() => markResult('unknown')}>
                完全不会
              </button>
            </>
          )}
          <button className="next-button" type="button" onClick={goNext}>
            下一空
          </button>
        </div>

        {message && <p className="status-text">{message}</p>}
      </section>
    </main>
  )
}

export default StoryMode
