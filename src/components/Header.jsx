import { Calendar, CalendarDays, Smile, FileText, Sparkles, Target, ChevronLeft, ChevronRight } from 'lucide-react'
import './Header.css'

const TAB_COLORS = {
  year: { bg: '#ffd6d6', border: '#e8a0a0' },
  month: { bg: '#ffecd6', border: '#e8c8a0' },
  goals: { bg: '#fffbd6', border: '#e8dea0' },
  reflections: { bg: '#e0ffd6', border: '#a8d890' },
  mood: { bg: '#d6f0ff', border: '#a0c8e0' },
  day: { bg: '#e8d6ff', border: '#c0a0d8' },
}

function Header({ currentView, setCurrentView, selectedDate, setSelectedDate }) {
  const currentYear = selectedDate.getFullYear()

  const changeYear = (delta) => {
    const newDate = new Date(selectedDate)
    newDate.setFullYear(currentYear + delta)
    setSelectedDate(newDate)
  }

  const tabs = [
    { id: 'year', label: 'Year', icon: Calendar },
    { id: 'month', label: 'Month', icon: CalendarDays },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'reflections', label: 'Reflect', icon: Sparkles },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'day', label: 'Daily', icon: FileText },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="journal-title">My Journal</h1>
        <div className="year-selector">
          <button onClick={() => changeYear(-1)} className="year-btn" aria-label="Previous year">
            <ChevronLeft size={16} />
          </button>
          <span className="year-display">{currentYear}</span>
          <button onClick={() => changeYear(1)} className="year-btn" aria-label="Next year">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <nav className="planner-tabs">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = currentView === tab.id
          const colors = TAB_COLORS[tab.id]
          
          return (
            <button
              key={tab.id}
              className={`planner-tab ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(tab.id)}
              style={{
                '--tab-bg': colors.bg,
                '--tab-border': colors.border,
                '--tab-offset': `${index * 8}px`,
              }}
            >
              <div className="tab-notch" />
              <div className="tab-content">
                <Icon size={18} strokeWidth={2} />
                <span className="tab-label">{tab.label}</span>
              </div>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-decoration">
        <div className="binder-ring" />
        <div className="binder-ring" />
        <div className="binder-ring" />
      </div>
    </aside>
  )
}

export default Header
