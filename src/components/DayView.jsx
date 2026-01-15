import { useState, useEffect } from 'react'
import { format, addDays, subDays, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Save, Sparkles, Frown, Meh, Smile, Heart, Calendar } from 'lucide-react'
import './DayView.css'

const MOODS = [
  { id: 'amazing', label: 'Amazing', icon: Sparkles, color: '#10b981' },
  { id: 'good', label: 'Good', icon: Heart, color: '#84cc16' },
  { id: 'okay', label: 'Okay', icon: Smile, color: '#facc15' },
  { id: 'meh', label: 'Meh', icon: Meh, color: '#fb923c' },
  { id: 'bad', label: 'Bad', icon: Frown, color: '#ef4444' }
]

function DayView({ selectedDate, setSelectedDate, journalData, onSaveDay, getDateKey }) {
  const dateKey = getDateKey(selectedDate)
  const dayData = journalData[dateKey] || {}
  
  const [notes, setNotes] = useState(dayData.notes || '')
  const [gratitude, setGratitude] = useState(dayData.gratitude || '')
  const [goals, setGoals] = useState(dayData.goals || '')
  const [mood, setMood] = useState(dayData.mood || null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const data = journalData[dateKey] || {}
    setNotes(data.notes || '')
    setGratitude(data.gratitude || '')
    setGoals(data.goals || '')
    setMood(data.mood || null)
    setSaved(false)
  }, [dateKey, journalData])

  const handleSave = () => {
    onSaveDay(dateKey, {
      notes,
      gratitude,
      goals,
      mood
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="day-view">
      <div className="day-header">
        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="day-nav-btn">
          <ChevronLeft size={20} />
        </button>
        
        <div className="day-info">
          <h2>{format(selectedDate, 'EEEE')}</h2>
          <p className="day-date">{format(selectedDate, 'MMMM d, yyyy')}</p>
          {!isToday(selectedDate) && (
            <button onClick={goToToday} className="today-btn">
              <Calendar size={14} />
              Go to Today
            </button>
          )}
        </div>
        
        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="day-nav-btn">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="day-content">
        <div className="mood-section">
          <h3>How are you feeling today?</h3>
          <div className="mood-selector">
            {MOODS.map(moodOption => {
              const Icon = moodOption.icon
              const isSelected = mood === moodOption.id
              return (
                <button
                  key={moodOption.id}
                  className={`mood-option ${isSelected ? 'selected' : ''}`}
                  style={isSelected ? { backgroundColor: moodOption.color, borderColor: moodOption.color } : {}}
                  onClick={() => setMood(moodOption.id)}
                >
                  <Icon size={24} />
                  <span>{moodOption.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="notes-grid">
          <div className="note-card gratitude-card">
            <h3>Gratitude</h3>
            <p className="note-prompt">What are you grateful for today?</p>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="I'm grateful for..."
              rows={4}
            />
          </div>

          <div className="note-card goals-card">
            <h3>Today's Goals</h3>
            <p className="note-prompt">What do you want to accomplish?</p>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Today I want to..."
              rows={4}
            />
          </div>
        </div>

        <div className="note-card main-notes">
          <h3>Daily Notes</h3>
          <p className="note-prompt">Write about your day, thoughts, or anything on your mind</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start writing..."
            rows={10}
          />
        </div>

        <button onClick={handleSave} className={`save-btn ${saved ? 'saved' : ''}`}>
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Entry'}
        </button>
      </div>
    </div>
  )
}

export default DayView
