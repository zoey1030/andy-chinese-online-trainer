import { useState } from 'react'
import HandwritingMode from './components/HandwritingMode'
import MistakeBook from './components/MistakeBook'
import MistakeReviewMode from './components/MistakeReviewMode'
import ReadingMode from './components/ReadingMode'
import SentenceImitationMode from './components/SentenceImitationMode'
import StoryMode from './components/StoryMode'
import WritingMode from './components/WritingMode'
import WritingRecords from './components/WritingRecords'

const menuItems = [
  '今日任务',
  '生字手写',
  '故事闯关',
  '阅读理解',
  '句子仿写',
  '小作文训练',
  '作文记录',
  '错词复仇',
  '错词本',
]

function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'handwriting') {
    return <HandwritingMode onBack={() => setScreen('home')} />
  }

  if (screen === 'story') {
    return <StoryMode onBack={() => setScreen('home')} />
  }

  if (screen === 'reading') {
    return <ReadingMode onBack={() => setScreen('home')} />
  }

  if (screen === 'sentence') {
    return <SentenceImitationMode onBack={() => setScreen('home')} />
  }

  if (screen === 'writing') {
    return <WritingMode onBack={() => setScreen('home')} />
  }

  if (screen === 'writingRecords') {
    return <WritingRecords onBack={() => setScreen('home')} />
  }

  if (screen === 'mistakeReview') {
    return <MistakeReviewMode onBack={() => setScreen('home')} />
  }

  if (screen === 'mistakeBook') {
    return <MistakeBook onBack={() => setScreen('home')} />
  }

  return (
    <main className="app">
      <section className="home">
        <p className="eyebrow">中三华文 · 长期在线训练</p>
        <h1>中三华文综合训练系统</h1>
        <p className="intro">
          围绕生字手写、阅读理解、句子表达和作文练习，逐步把词语从“认得出”练到“写得准、用得自然”。
        </p>

        <div className="menu-grid" aria-label="训练功能入口">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              className="menu-button"
              onClick={() => {
                if (item === '生字手写') setScreen('handwriting')
                if (item === '故事闯关') setScreen('story')
                if (item === '阅读理解') setScreen('reading')
                if (item === '句子仿写') setScreen('sentence')
                if (item === '小作文训练') setScreen('writing')
                if (item === '作文记录') setScreen('writingRecords')
                if (item === '错词复仇') setScreen('mistakeReview')
                if (item === '错词本') setScreen('mistakeBook')
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
