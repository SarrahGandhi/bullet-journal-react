import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths
} from 'date-fns'
import './MonthlyPlanner.css'

function MonthlyPlanner({ selectedDate, setSelectedDate, journalData, onSaveDay, getDateKey }) {
  const [plannerNotes, setPlannerNotes] = useState(() => {
    const key = `planner-notes-${format(selectedDate, 'yyyy-MM')}`
    return localStorage.getItem(key) || ''
  })

  const [dayNotes, setDayNotes] = useState({})

  const currentMonth = selectedDate.getMonth()
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getMondayStartDay = (date) => {
    const day = getDay(date)
    return day === 0 ? 6 : day - 1
  }

  const startDay = getMondayStartDay(monthStart)

  useEffect(() => {
    const notes = {}
    days.forEach(day => {
      const key = getDateKey(day)
      if (journalData[key]?.plannerNote) {
        notes[key] = journalData[key].plannerNote
      }
    })
    setDayNotes(notes)
  }, [selectedDate, journalData])

  useEffect(() => {
    const key = `planner-notes-${format(selectedDate, 'yyyy-MM')}`
    localStorage.setItem(key, plannerNotes)
  }, [plannerNotes, selectedDate])

  useEffect(() => {
    const key = `planner-notes-${format(selectedDate, 'yyyy-MM')}`
    setPlannerNotes(localStorage.getItem(key) || '')
  }, [selectedDate])

  const changeMonth = (delta) => {
    const newDate = delta > 0 ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1)
    setSelectedDate(newDate)
  }

  const handleDayNoteChange = (dateKey, value) => {
    setDayNotes(prev => ({ ...prev, [dateKey]: value }))
    const existingData = journalData[dateKey] || {}
    onSaveDay(dateKey, { ...existingData, plannerNote: value })
  }

  const createWeeks = () => {
    const weeks = []
    let currentWeek = { left: [], right: [] }
    
    for (let i = 0; i < startDay; i++) {
      if (i < 4) currentWeek.left.push(null)
      else currentWeek.right.push(null)
    }

    days.forEach((day, index) => {
      const dayOfWeek = getMondayStartDay(day)
      
      if (dayOfWeek === 0 && index !== 0) {
        weeks.push(currentWeek)
        currentWeek = { left: [], right: [] }
      }

      if (dayOfWeek < 4) currentWeek.left.push(day)
      else currentWeek.right.push(day)
    })

    if (currentWeek.left.length > 0 || currentWeek.right.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }

  const weeks = createWeeks()

  return (
    <div className="monthly-planner">
      <div className="binder-rings">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>

      <div className="planner-header">
        <button onClick={() => changeMonth(-1)} className="month-nav-btn">
          <ChevronLeft size={24} />
        </button>
        <h1 className="month-title">{format(selectedDate, 'MMMM')}</h1>
        <button onClick={() => changeMonth(1)} className="month-nav-btn">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="planner-spread">
        <div className="planner-page left-page">
          <div className="weekday-headers">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
          </div>
          <div className="days-grid left-grid">
            {weeks.map((week, weekIndex) => (
              week.left.map((day, dayIndex) => (
                <div 
                  key={`left-${weekIndex}-${dayIndex}`} 
                  className={`day-cell ${day ? '' : 'empty'} ${day && format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}`}
                >
                  {day && (
                    <>
                      <span className="day-number">{format(day, 'd')}</span>
                      <textarea
                        className="day-input"
                        value={dayNotes[getDateKey(day)] || ''}
                        onChange={(e) => handleDayNoteChange(getDateKey(day), e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))
            )).flat()}
          </div>
        </div>

        <div className="planner-page right-page">
          <div className="right-content">
            <div className="weekend-section">
              <div className="weekday-headers weekend-headers">
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
              <div className="days-grid right-grid">
                {weeks.map((week, weekIndex) => (
                  week.right.map((day, dayIndex) => (
                    <div 
                      key={`right-${weekIndex}-${dayIndex}`} 
                      className={`day-cell ${day ? '' : 'empty'} ${day && format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}`}
                    >
                      {day && (
                        <>
                          <span className="day-number">{format(day, 'd')}</span>
                          <textarea
                            className="day-input"
                            value={dayNotes[getDateKey(day)] || ''}
                            onChange={(e) => handleDayNoteChange(getDateKey(day), e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  ))
                )).flat()}
              </div>
            </div>

            <div className="notes-section">
              <div className="notes-header">NOTES</div>
              <textarea
                className="notes-input"
                value={plannerNotes}
                onChange={(e) => setPlannerNotes(e.target.value)}
                placeholder="Monthly notes..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="page-fold"></div>
    </div>
  )
}

export default MonthlyPlanner
