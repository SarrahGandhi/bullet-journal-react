import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, Heart, Lightbulb, Target, Sparkles, Smile } from 'lucide-react'
import { fetchReflections, saveReflection } from '../lib/journalService'
import './Reflections.css'

const REFLECTION_PROMPTS = [
  { id: 'proudest', icon: Star, label: 'Proudest Moment', placeholder: 'What was your proudest achievement this year?' },
  { id: 'learned', icon: Lightbulb, label: 'Lessons Learned', placeholder: 'What important lessons did you learn?' },
  { id: 'grateful', icon: Heart, label: 'Gratitude', placeholder: 'What are you most grateful for from this year?' },
  { id: 'challenges', icon: Target, label: 'Challenges Overcome', placeholder: 'What challenges did you face and overcome?' },
  { id: 'growth', icon: Sparkles, label: 'Personal Growth', placeholder: 'How did you grow as a person?' },
  { id: 'joy', icon: Smile, label: 'Moments of Joy', placeholder: 'What moments brought you the most joy?' },
]

function Reflections({ selectedDate, setSelectedDate }) {
  const currentYear = selectedDate.getFullYear()
  const reflectionYear = currentYear - 1
  
  const [reflections, setReflections] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef({})

  // Load reflections from Supabase
  useEffect(() => {
    const loadReflections = async () => {
      setIsLoading(true)
      try {
        const data = await fetchReflections(reflectionYear)
        setReflections(data)
      } catch (error) {
        console.error('Error loading reflections:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadReflections()
  }, [reflectionYear])

  const handleChange = (id, value) => {
    // Update local state immediately
    setReflections(prev => ({ ...prev, [id]: value }))
    
    // Debounce save to Supabase (save 500ms after user stops typing)
    if (saveTimeoutRef.current[id]) {
      clearTimeout(saveTimeoutRef.current[id])
    }
    saveTimeoutRef.current[id] = setTimeout(async () => {
      try {
        await saveReflection(reflectionYear, id, value)
      } catch (error) {
        console.error('Error saving reflection:', error)
      }
    }, 500)
  }

  const changeYear = (delta) => {
    const newDate = new Date(selectedDate)
    newDate.setFullYear(currentYear + delta)
    setSelectedDate(newDate)
  }

  const filledCount = Object.values(reflections).filter(v => v?.trim()).length

  return (
    <div className="reflections-page">
      <div className="reflections-header">
        <div className="tape tape-left"></div>
        <div className="header-content">
          <div className="year-nav">
            <button onClick={() => changeYear(-1)} className="year-btn">
              <ChevronLeft size={18} />
            </button>
            <span className="year-number">{reflectionYear}</span>
            <button onClick={() => changeYear(1)} className="year-btn">
              <ChevronRight size={18} />
            </button>
          </div>
          <h2>reflections</h2>
        </div>
        <div className="tape tape-right"></div>
      </div>

      <div className="progress-indicator">
        <span>{filledCount} of {REFLECTION_PROMPTS.length} reflections</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(filledCount / REFLECTION_PROMPTS.length) * 100}%` }} />
        </div>
      </div>

      <div className="reflections-grid">
        {REFLECTION_PROMPTS.map(prompt => {
          const Icon = prompt.icon
          return (
            <div key={prompt.id} className="reflection-card">
              <div className="card-header">
                <Icon size={20} className="card-icon" />
                <h3>{prompt.label}</h3>
              </div>
              <textarea
                value={reflections[prompt.id] || ''}
                onChange={(e) => handleChange(prompt.id, e.target.value)}
                placeholder={prompt.placeholder}
                rows={5}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reflections
