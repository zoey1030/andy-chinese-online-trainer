import { useEffect, useMemo, useState } from 'react'
import { unitOne } from '../data/units'

const WRITING_RECORDS_KEY = 'andy-writing-records'

function readWritingRecords() {
  try {
    const raw = localStorage.getItem(WRITING_RECORDS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveWritingRecord(record) {
  const records = readWritingRecords()
  localStorage.setItem(WRITING_RECORDS_KEY, JSON.stringify([record, ...records]))
}

function countChineseText(text) {
  return text.replace(/\s/g, '').length
}

function WritingMode({ onBack }) {
  const prompt = unitOne.writingPrompt
  const [content, setContent] = useState('')
  const [showSample, setShowSample] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setContent('')
    setShowSample(false)
    setMessage('')
  }, [])

  const usedWords = useMemo(
    () => prompt.requiredWords.filter((word) => content.includes(word)),
    [content, prompt.requiredWords],
  )

  const missingWords = useMemo(
    () => prompt.requiredWords.filter((word) => !content.includes(word)),
    [content, prompt.requiredWords],
  )

  const wordCount = countChineseText(content)

  const handleSave = () => {
    if (content.trim() === '') {
      setMessage('请先写作文再保存。')
      return
    }

    const record = {
      title: prompt.title,
      content,
      usedWords,
      missingWords,
      date: new Date().toISOString(),
    }

    saveWritingRecord(record)
    setMessage('作文已保存，可到“作文记录”查看。')
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <span className="progress-pill">当前字数：{wordCount}</span>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">小作文训练</p>
          <h1>{prompt.title}</h1>
        </div>

        <article className="prompt-card">
          <div>
            <p className="label">字数要求</p>
            <p>{prompt.wordCountRange}</p>
          </div>

          <div>
            <p className="label">必须使用的词语</p>
            <div className="word-chip-list">
              {prompt.requiredWords.map((word) => (
                <span className={usedWords.includes(word) ? 'used-word' : ''} key={word}>
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="label">结构提示</p>
            <ul className="structure-list">
              {prompt.structureTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="word-check">
            <p className="label">已使用词语检测</p>
            {missingWords.length > 0 ? (
              <p className="warning-text">还没有使用：{missingWords.join('、')}</p>
            ) : (
              <p className="success-text">指定词语都已经使用。</p>
            )}
          </div>
        </article>

        <textarea
          className="essay-area"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows="10"
          placeholder="在这里写 120–180 字。先写清楚误会怎样产生，再写大家如何沟通解决。"
        />

        <div className="action-row">
          <button type="button" onClick={handleSave}>
            保存作文
          </button>
          <button type="button" onClick={() => setShowSample(true)}>
            显示参考范文
          </button>
        </div>

        {message && <p className="status-text">{message}</p>}

        {showSample && (
          <article className="answer-card">
            <p className="label">参考范文</p>
            <p>{prompt.sampleEssay}</p>
          </article>
        )}
      </section>
    </main>
  )
}

export default WritingMode
