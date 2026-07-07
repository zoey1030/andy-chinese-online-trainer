import { useState } from 'react'
import { unitOne } from '../data/units'

const READING_MISTAKES_KEY = 'andy-chinese-readingMistakes'

function readReadingMistakes() {
  try {
    const raw = localStorage.getItem(READING_MISTAKES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveReadingMistakes(wrongQuestions) {
  if (wrongQuestions.length === 0) return

  const today = new Date().toISOString()
  const oldRecords = readReadingMistakes()
  const nextRecords = [
    ...wrongQuestions.map((item) => ({
      id: `${item.id}-${today}`,
      questionId: item.id,
      type: item.type,
      question: item.question,
      date: today,
    })),
    ...oldRecords,
  ]

  localStorage.setItem(READING_MISTAKES_KEY, JSON.stringify(nextRecords))
}

function ReadingMode({ onBack }) {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')

  const questions = unitOne.readingQuestions

  const chooseAnswer = (questionId, optionIndex) => {
    if (submitted) return
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }))
    setMessage('')
  }

  const submitAnswers = () => {
    const unfinished = questions.some(
      (question) => selectedAnswers[question.id] === undefined,
    )

    if (unfinished) {
      setMessage('请先完成所有题目。')
      return
    }

    let nextScore = 0
    const wrongQuestions = []

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        nextScore += 1
      } else {
        wrongQuestions.push(question)
      }
    })

    setScore(nextScore)
    setSubmitted(true)
    setMessage('')
    saveReadingMistakes(wrongQuestions)
  }

  return (
    <main className="app">
      <section className="practice">
        <div className="top-bar">
          <button className="secondary-button" type="button" onClick={onBack}>
            返回首页
          </button>
          {submitted && (
            <span className="progress-pill">
              分数：{score} / {questions.length}
            </span>
          )}
        </div>

        <div className="practice-heading">
          <p className="eyebrow">阅读理解 · 朋友关系 / 小组合作</p>
          <h1>{unitOne.readingPassage.title}</h1>
        </div>

        <article className="reading-passage">
          {unitOne.readingPassage.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <div className="question-list">
          {questions.map((question, questionIndex) => {
            const selected = selectedAnswers[question.id]
            const isCorrect = selected === question.answer

            return (
              <article className="question-card" key={question.id}>
                <p className="label">
                  {questionIndex + 1}. {question.type}
                </p>
                <h2>{question.question}</h2>

                <div className="option-list">
                  {question.options.map((option, optionIndex) => {
                    const optionLetter = String.fromCharCode(65 + optionIndex)
                    const checked = selected === optionIndex

                    return (
                      <label
                        className={`option-row ${checked ? 'selected' : ''}`}
                        key={option}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          checked={checked}
                          disabled={submitted}
                          onChange={() => chooseAnswer(question.id, optionIndex)}
                        />
                        <span>{optionLetter}. {option}</span>
                      </label>
                    )
                  })}
                </div>

                {submitted && (
                  <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
                    <p>
                      <strong>{isCorrect ? '答对了' : '答错了'}</strong>
                    </p>
                    <p>
                      <strong>正确答案：</strong>
                      {String.fromCharCode(65 + question.answer)}. {question.options[question.answer]}
                    </p>
                    <p>
                      <strong>解释：</strong>
                      {question.explanation}
                    </p>
                    <p>
                      <strong>陷阱提醒：</strong>
                      {question.trap}
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {message && <p className="status-text warning-text">{message}</p>}

        <button type="button" onClick={submitAnswers} disabled={submitted}>
          提交答案
        </button>
      </section>
    </main>
  )
}

export default ReadingMode
