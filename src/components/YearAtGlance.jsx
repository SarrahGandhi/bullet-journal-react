import { 
  startOfYear, 
  endOfYear, 
  eachMonthOfInterval, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  format,
  isToday,
  getDay
} from 'date-fns'
import './YearAtGlance.css'

const MOOD_COLORS = {
  amazing: '#10b981',
  good: '#84cc16',
  okay: '#facc15',
  meh: '#fb923c',
  bad: '#ef4444'
}

function YearAtGlance({ selectedDate, onDateSelect, journalData }) {
  const year = selectedDate.getFullYear()
  const yearStart = startOfYear(new Date(year, 0, 1))
  const yearEnd = endOfYear(new Date(year, 0, 1))
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const getDayData = (date) => {
    const dateKey = date.toISOString().split('T')[0]
    return journalData[dateKey]
  }

  const getMondayStartDay = (date) => {
    const day = getDay(date)
    return day === 0 ? 6 : day - 1
  }

  return (
    <div className="year-at-glance">
      <div className="year-header">
        <div className="tape tape-left"></div>
        <div className="header-content">
          <span className="year-number">{year}</span>
          <h2>overview</h2>
        </div>
        <div className="tape tape-right"></div>
      </div>

      <div className="months-grid">
        {months.map((month) => {
          const monthStart = startOfMonth(month)
          const monthEnd = endOfMonth(month)
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
          const startDay = getMondayStartDay(monthStart)

          return (
            <div key={month.toISOString()} className="month-card">
              <h3 className="month-name">{format(month, 'MMM').toUpperCase()}</h3>
              
              <div className="weekday-headers">
                {weekDays.map((day, i) => (
                  <span key={i} className="weekday">{day}</span>
                ))}
              </div>
              
              <div className="days-grid">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="day-cell empty" />
                ))}
                
                {days.map((day) => {
                  const dayData = getDayData(day)
                  const hasMood = dayData?.mood
                  const hasNotes = dayData?.notes?.trim()
                  
                  return (
                    <button
                      key={day.toISOString()}
                      className={`day-cell ${isToday(day) ? 'today' : ''} ${hasNotes ? 'has-notes' : ''}`}
                      onClick={() => onDateSelect(day)}
                      style={hasMood ? { backgroundColor: MOOD_COLORS[dayData.mood], color: 'white' } : {}}
                      title={format(day, 'MMM d')}
                    >
                      <span className="day-number">{format(day, 'd')}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default YearAtGlance
