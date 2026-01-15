import { useState } from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  format,
  isToday,
  getDay,
  addMonths,
  subMonths
} from 'date-fns'
import { ChevronLeft, ChevronRight, Sparkles, Frown, Meh, Smile, Heart } from 'lucide-react'
import './MoodTracker.css'

const MOODS = [
  { id: 'amazing', label: 'Amazing', icon: Sparkles, color: '#10b981' },
  { id: 'good', label: 'Good', icon: Heart, color: '#84cc16' },
  { id: 'okay', label: 'Okay', icon: Smile, color: '#facc15' },
  { id: 'meh', label: 'Meh', icon: Meh, color: '#fb923c' },
  { id: 'bad', label: 'Bad', icon: Frown, color: '#ef4444' }
]

function MoodTracker({ selectedDate, setSelectedDate, journalData, onSaveDay, getDateKey }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)
  
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleMoodSelect = (date, moodId) => {
    const dateKey = getDateKey(date)
    const existingData = journalData[dateKey] || {}
    onSaveDay(dateKey, {
      ...existingData,
      mood: existingData.mood === moodId ? null : moodId
    })
  }

  const getMoodStats = () => {
    const stats = { amazing: 0, good: 0, okay: 0, meh: 0, bad: 0 }
    days.forEach(day => {
      const data = journalData[getDateKey(day)]
      if (data?.mood) {
        stats[data.mood]++
      }
    })
    return stats
  }

  const stats = getMoodStats()
  const totalTracked = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div className="mood-tracker">
      <div className="mood-header">
        <h2>Mood Tracker</h2>
        <p className="mood-subtitle">Track how you feel each day</p>
      </div>

      <div className="mood-content">
        <div className="calendar-section">
          <div className="month-nav">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="month-nav-btn">
              <ChevronLeft size={20} />
            </button>
            <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="month-nav-btn">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mood-calendar">
            <div className="weekday-row">
              {weekDays.map(day => (
                <div key={day} className="weekday-cell">{day}</div>
              ))}
            </div>

            <div className="mood-days">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="mood-day empty" />
              ))}
              
              {days.map(day => {
                const dateKey = getDateKey(day)
                const dayData = journalData[dateKey]
                const currentMood = MOODS.find(m => m.id === dayData?.mood)
                
                return (
                  <div 
                    key={dateKey} 
                    className={`mood-day ${isToday(day) ? 'today' : ''}`}
                  >
                    <span className="mood-day-number">{format(day, 'd')}</span>
                    <div className="mood-buttons">
                      {MOODS.map(mood => {
                        const Icon = mood.icon
                        const isSelected = dayData?.mood === mood.id
                        return (
                          <button
                            key={mood.id}
                            className={`mood-btn ${isSelected ? 'selected' : ''}`}
                            style={isSelected ? { backgroundColor: mood.color } : {}}
                            onClick={() => handleMoodSelect(day, mood.id)}
                            title={mood.label}
                          >
                            <Icon size={14} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Monthly Stats</h3>
          <div className="stats-summary">
            <div className="stat-total">
              <span className="stat-number">{totalTracked}</span>
              <span className="stat-label">days tracked</span>
            </div>
          </div>

          <div className="mood-stats">
            {MOODS.map(mood => {
              const count = stats[mood.id]
              const percentage = totalTracked > 0 ? (count / totalTracked) * 100 : 0
              const Icon = mood.icon
              
              return (
                <div key={mood.id} className="stat-row">
                  <div className="stat-mood">
                    <div className="stat-icon" style={{ backgroundColor: mood.color }}>
                      <Icon size={16} />
                    </div>
                    <span>{mood.label}</span>
                  </div>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: mood.color 
                      }} 
                    />
                  </div>
                  <span className="stat-count">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodTracker
