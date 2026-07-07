import { useState } from 'react'
import { unitOne } from '../data/units'

const DAILY_PROGRESS_KEY = 'sec3-chinese-daily-progress'

const dailyTasks = [
  {
    id: 'handwriting',
    title: '生字手写',
    target: 'handwriting',
    description: '完成 8 个新词，先看拼音和意思，再自己手写。',
  },
  {
    id: 'mistakeReview',
    title: '错词复仇',
    target: 'mistakeReview',
    description: '复习 3 个错词，连续写对 2 次才算真正掌握。',
  },
  {
    id: 'story',
    title: '故事闯关',
    target: 'story',
    description: '完成 1 个故事，把词语放回真实校园情境。',
  },
  {
    id: 'reading',
    title: '阅读理解',
    target: 'reading',
    description: '完成 5 道题，练习抓重点、推断和理解词义。',
  },
  {
    id: 'sentence',
    title: '句子仿写',
    target: 'sentence',
    description: '完成 2 句仿写，把词语用进自然表达。',
  },
  {
    id: 'writing',
    title: '小作文训练',
    target: 'writing',
    description: '完成 1 篇作文，练习结构、词语和表达。',
  },
]

function getTodayKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const date = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

function createEmptyProgress(date = getTodayKey()) {
  return {
    date,
    completed: {},
  }
}

function readDailyProgress() {
  try {
    const today = getTodayKey()
    const raw = localStorage.getItem(DAILY_PROGRESS_KEY)
    const parsed = raw ? JSON.parse(raw) : null

    if (!parsed || parsed.date !== today) {
      const resetProgress = createEmptyProgress(today)
      localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(resetProgress))
      return resetProgress
    }

    return {
      date: today,
      completed: parsed.completed || {},
    }
  } catch {
    return createEmptyProgress()
  }
}

function saveDailyProgress(progress) {
  localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(progress))
}

function DailyTaskMode({ onBack, onNavigate }) {
  const [progress, setProgress] = useState(() => readDailyProgress())

  const completedCount = dailyTasks.filter((task) => progress.completed[task.id]).length

  const toggleTask = (taskId) => {
    const nextProgress = {
      ...progress,
      completed: {
        ...progress.completed,
        [taskId]: !progress.completed[taskId],
      },
    }

    saveDailyProgress(nextProgress)
    setProgress(nextProgress)
  }

  const resetToday = () => {
    const resetProgress = createEmptyProgress()
    saveDailyProgress(resetProgress)
    setProgress(resetProgress)
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          <button className="danger-button" type="button" onClick={resetToday}>
            重置今日任务
          </button>
        </div>

        <div className="practice-heading">
          <p className="eyebrow">当前单元：{unitOne.title} / {unitOne.theme}</p>
          <h1>今日任务</h1>
        </div>

        <article className="prompt-card">
          <p className="label">今日完成</p>
          <h2>
            {completedCount} / {dailyTasks.length}
          </h2>
          <p>日期：{progress.date}</p>
        </article>

        <div className="daily-task-list">
          {dailyTasks.map((task) => {
            const isCompleted = Boolean(progress.completed[task.id])

            return (
              <article className="daily-task-card" key={task.id}>
                <div className="daily-task-main">
                  <span className={`task-status ${isCompleted ? 'done' : ''}`}>
                    {isCompleted ? '已完成' : '未完成'}
                  </span>
                  <div>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                  </div>
                </div>

                <div className="daily-task-actions">
                  <button type="button" onClick={() => onNavigate(task.target)}>
                    去练习
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => toggleTask(task.id)}
                  >
                    {isCompleted ? '取消完成' : '标记完成'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default DailyTaskMode
