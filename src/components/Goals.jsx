import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Circle, Target, Briefcase, Heart, Sparkles, BookOpen, Dumbbell } from 'lucide-react'
import { fetchGoals, addGoal as addGoalToDb, updateGoal, deleteGoal as deleteGoalFromDb } from '../lib/journalService'
import './Goals.css'

const GOAL_CATEGORIES = [
  { id: 'personal', label: 'Personal', icon: Sparkles, color: '#9d4edd' },
  { id: 'career', label: 'Career', icon: Briefcase, color: '#00acc1' },
  { id: 'health', label: 'Health', icon: Dumbbell, color: '#4caf50' },
  { id: 'relationships', label: 'Relationships', icon: Heart, color: '#e91e63' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: '#6b5ce7' },
  { id: 'other', label: 'Other', icon: Target, color: '#8d6e63' },
]

function Goals({ selectedDate, setSelectedDate }) {
  const currentYear = selectedDate.getFullYear()
  
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newGoal, setNewGoal] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('personal')
  const [showAddForm, setShowAddForm] = useState(false)

  // Load goals from Supabase
  useEffect(() => {
    const loadGoals = async () => {
      setIsLoading(true)
      try {
        const data = await fetchGoals(currentYear)
        setGoals(data)
      } catch (error) {
        console.error('Error loading goals:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadGoals()
  }, [currentYear])

  const changeYear = (delta) => {
    const newDate = new Date(selectedDate)
    newDate.setFullYear(currentYear + delta)
    setSelectedDate(newDate)
  }

  const addGoal = async () => {
    if (!newGoal.trim()) return
    const goal = {
      id: Date.now(),
      text: newGoal,
      category: selectedCategory,
      completed: false
    }
    // Update local state immediately
    setGoals(prev => [...prev, goal])
    setNewGoal('')
    setShowAddForm(false)
    // Save to Supabase
    try {
      await addGoalToDb(currentYear, goal)
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const toggleGoal = async (id) => {
    const goal = goals.find(g => g.id === id)
    const newCompleted = !goal.completed
    // Update local state immediately
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, completed: newCompleted } : g
    ))
    // Save to Supabase
    try {
      await updateGoal(currentYear, id, { completed: newCompleted })
    } catch (error) {
      console.error('Error toggling goal:', error)
    }
  }

  const deleteGoal = async (id) => {
    // Update local state immediately
    setGoals(prev => prev.filter(g => g.id !== id))
    // Delete from Supabase
    try {
      await deleteGoalFromDb(currentYear, id)
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const completedCount = goals.filter(g => g.completed).length

  const goalsByCategory = GOAL_CATEGORIES.map(cat => ({
    ...cat,
    goals: goals.filter(g => g.category === cat.id)
  })).filter(cat => cat.goals.length > 0)

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div className="tape tape-left"></div>
        <div className="header-content">
          <div className="year-nav">
            <button onClick={() => changeYear(-1)} className="year-btn">
              <ChevronLeft size={18} />
            </button>
            <span className="year-number">{currentYear}</span>
            <button onClick={() => changeYear(1)} className="year-btn">
              <ChevronRight size={18} />
            </button>
          </div>
          <h2>goals</h2>
        </div>
        <div className="tape tape-right"></div>
      </div>

      {goals.length > 0 && (
        <div className="progress-indicator">
          <span>{completedCount} of {goals.length} goals achieved</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(completedCount / goals.length) * 100}%` }} />
          </div>
        </div>
      )}

      <button className="add-goal-btn" onClick={() => setShowAddForm(!showAddForm)}>
        <Plus size={20} />
        <span>Add New Goal</span>
      </button>

      {showAddForm && (
        <div className="add-goal-form">
          <div className="form-row">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="What do you want to achieve?"
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              autoFocus
            />
            <button onClick={addGoal} className="submit-btn">Add</button>
          </div>
          <div className="category-selector">
            {GOAL_CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ '--cat-color': cat.color }}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="empty-state">
          <Target size={48} />
          <h3>Loading goals...</h3>
        </div>
      ) : goals.length === 0 ? (
        <div className="empty-state">
          <Target size={48} />
          <h3>No goals yet</h3>
          <p>Start by adding your first goal for {currentYear}!</p>
        </div>
      ) : (
        <div className="goals-list">
          {goalsByCategory.map(category => {
            const Icon = category.icon
            return (
              <div key={category.id} className="category-section">
                <div className="category-header" style={{ '--cat-color': category.color }}>
                  <Icon size={20} />
                  <h3>{category.label}</h3>
                  <span className="category-count">
                    {category.goals.filter(g => g.completed).length}/{category.goals.length}
                  </span>
                </div>
                <div className="category-goals">
                  {category.goals.map(goal => (
                    <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                      <button 
                        className="check-btn"
                        onClick={() => toggleGoal(goal.id)}
                        style={{ '--cat-color': category.color }}
                      >
                        {goal.completed ? <Check size={16} /> : <Circle size={16} />}
                      </button>
                      <span className="goal-text">{goal.text}</span>
                      <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Goals
