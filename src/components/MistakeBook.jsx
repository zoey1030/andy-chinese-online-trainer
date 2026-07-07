import { useState } from 'react'

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

function MistakeBook({ onBack }) {
  const [mistakes, setMistakes] = useState(() => readMistakes())

  const clearMistakes = () => {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify([]))
    setMistakes([])
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <button className="danger-button" type="button" onClick={clearMistakes}>
            清空错词本
          </button>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">复习记录</p>
          <h1>错词本</h1>
        </div>

        {mistakes.length === 0 ? (
          <article className="prompt-card">
            <p>目前没有错词。</p>
          </article>
        ) : (
          <div className="mistake-list">
            {mistakes.map((item) => (
              <article className="mistake-card" key={item.id}>
                <div>
                  <p className="label">词语</p>
                  <h2>{item.word}</h2>
                  <p>{item.pinyin}</p>
                  <p>{item.meaning}</p>
                </div>

                <dl className="mistake-meta">
                  <div>
                    <dt>来源模式</dt>
                    <dd>{item.sourceMode || item.reason || '生字手写'}</dd>
                  </div>
                  <div>
                    <dt>日期</dt>
                    <dd>{item.date || '未记录'}</dd>
                  </div>
                  <div>
                    <dt>正确次数 correctCount</dt>
                    <dd>{item.correctCount || 0}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default MistakeBook
