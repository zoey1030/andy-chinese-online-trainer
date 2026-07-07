import { useState } from 'react'

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

function countChineseText(text = '') {
  return text.replace(/\s/g, '').length
}

function formatDate(date) {
  if (!date) return '未记录'

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleString('zh-SG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function WritingRecords({ onBack }) {
  const [records, setRecords] = useState(() => readWritingRecords())
  const [openIds, setOpenIds] = useState({})

  const clearRecords = () => {
    if (!window.confirm('确定要清空所有作文记录吗？')) return

    localStorage.setItem(WRITING_RECORDS_KEY, JSON.stringify([]))
    setRecords([])
    setOpenIds({})
  }

  const toggleRecord = (recordKey) => {
    setOpenIds((current) => ({
      ...current,
      [recordKey]: !current[recordKey],
    }))
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <button className="danger-button" type="button" onClick={clearRecords}>
            清空作文记录
          </button>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">本机保存</p>
          <h1>作文记录</h1>
        </div>

        {records.length === 0 ? (
          <article className="prompt-card">
            <p>暂无作文记录，请先完成小作文训练。</p>
          </article>
        ) : (
          <div className="record-list">
            {records.map((record, index) => {
              const recordKey = `${record.date || 'record'}-${index}`
              const isOpen = Boolean(openIds[recordKey])
              const usedWords = record.usedWords || []
              const missingWords = record.missingWords || []

              return (
                <article className="record-card" key={recordKey}>
                  <div className="record-header">
                    <div>
                      <p className="label">作文题目</p>
                      <h2>{record.title || '未命名作文'}</h2>
                    </div>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => toggleRecord(recordKey)}
                    >
                      {isOpen ? '收起全文' : '展开全文'}
                    </button>
                  </div>

                  <dl className="record-meta">
                    <div>
                      <dt>保存日期</dt>
                      <dd>{formatDate(record.date)}</dd>
                    </div>
                    <div>
                      <dt>作文字数</dt>
                      <dd>{countChineseText(record.content)} 字</dd>
                    </div>
                    <div>
                      <dt>已使用词语</dt>
                      <dd>{usedWords.length > 0 ? usedWords.join('、') : '无'}</dd>
                    </div>
                    <div>
                      <dt>未使用词语</dt>
                      <dd>{missingWords.length > 0 ? missingWords.join('、') : '无'}</dd>
                    </div>
                  </dl>

                  {isOpen && (
                    <div className="record-content">
                      <p className="label">作文内容</p>
                      <p>{record.content}</p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default WritingRecords
