import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import Header from './components/Header'
import YearAtGlance from './components/YearAtGlance'
import MonthlyPlanner from './components/MonthlyPlanner'
import MoodTracker from './components/MoodTracker'
import DayView from './components/DayView'
import Reflections from './components/Reflections'
import Goals from './components/Goals'
import './App.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentView, setCurrentView] = useState('year')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [journalData, setJournalData] = useState(() => {
    const saved = localStorage.getItem('journal-data')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('journal-data', JSON.stringify(journalData))
  }, [journalData])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setCurrentView('day')
  }

  const handleSaveDay = (dateKey, data) => {
    setJournalData(prev => ({
      ...prev,
      [dateKey]: data
    }))
  }

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="app">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <main className="main-content">
        {currentView === 'year' && (
          <YearAtGlance 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            journalData={journalData}
          />
        )}

        {currentView === 'month' && (
          <MonthlyPlanner 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            journalData={journalData}
            onSaveDay={handleSaveDay}
            getDateKey={getDateKey}
          />
        )}

        {currentView === 'goals' && (
          <Goals 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {currentView === 'reflections' && (
          <Reflections 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
        
        {currentView === 'mood' && (
          <MoodTracker 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            journalData={journalData}
            onSaveDay={handleSaveDay}
            getDateKey={getDateKey}
          />
        )}
        
        {currentView === 'day' && (
          <DayView 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            journalData={journalData}
            onSaveDay={handleSaveDay}
            getDateKey={getDateKey}
          />
        )}
      </main>
    </div>
  )
}

export default App
