import { supabase } from './supabase'

// ============================================
// JOURNAL ENTRIES (daily notes, gratitude, goals, mood)
// ============================================

export async function fetchJournalEntries() {
  if (!supabase) {
    // Fallback to localStorage if Supabase is not configured
    const saved = localStorage.getItem('journal-data')
    return saved ? JSON.parse(saved) : {}
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')

  if (error) {
    console.error('Error fetching journal entries:', error)
    // Fallback to localStorage on error
    const saved = localStorage.getItem('journal-data')
    return saved ? JSON.parse(saved) : {}
  }

  // Convert array to object keyed by date
  const journalData = {}
  data.forEach(entry => {
    journalData[entry.date_key] = {
      notes: entry.notes,
      gratitude: entry.gratitude,
      goals: entry.goals,
      mood: entry.mood
    }
  })
  return journalData
}

export async function saveJournalEntry(dateKey, entryData) {
  if (!supabase) {
    // Fallback to localStorage if Supabase is not configured
    const existing = JSON.parse(localStorage.getItem('journal-data') || '{}')
    existing[dateKey] = entryData
    localStorage.setItem('journal-data', JSON.stringify(existing))
    return { success: true }
  }

  const { error } = await supabase
    .from('journal_entries')
    .upsert({
      date_key: dateKey,
      notes: entryData.notes || null,
      gratitude: entryData.gratitude || null,
      goals: entryData.goals || null,
      mood: entryData.mood || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'date_key'
    })

  if (error) {
    console.error('Error saving journal entry:', error)
    // Fallback to localStorage on error
    const existing = JSON.parse(localStorage.getItem('journal-data') || '{}')
    existing[dateKey] = entryData
    localStorage.setItem('journal-data', JSON.stringify(existing))
    return { success: false, error }
  }

  return { success: true }
}

// ============================================
// GOALS (yearly goals)
// ============================================

export async function fetchGoals(year) {
  if (!supabase) {
    const saved = localStorage.getItem(`journal-goals-${year}`)
    return saved ? JSON.parse(saved) : []
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('year', year)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching goals:', error)
    const saved = localStorage.getItem(`journal-goals-${year}`)
    return saved ? JSON.parse(saved) : []
  }

  return data.map(goal => ({
    id: goal.id,
    text: goal.text,
    category: goal.category,
    completed: goal.completed
  }))
}

export async function addGoal(year, goal) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(`journal-goals-${year}`) || '[]')
    existing.push(goal)
    localStorage.setItem(`journal-goals-${year}`, JSON.stringify(existing))
    return { success: true, data: goal }
  }

  const { data, error } = await supabase
    .from('goals')
    .insert({
      id: goal.id,
      year: year,
      text: goal.text,
      category: goal.category,
      completed: goal.completed
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding goal:', error)
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem(`journal-goals-${year}`) || '[]')
    existing.push(goal)
    localStorage.setItem(`journal-goals-${year}`, JSON.stringify(existing))
    return { success: false, error, data: goal }
  }

  return { success: true, data }
}

export async function updateGoal(year, goalId, updates) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(`journal-goals-${year}`) || '[]')
    const updated = existing.map(g => g.id === goalId ? { ...g, ...updates } : g)
    localStorage.setItem(`journal-goals-${year}`, JSON.stringify(updated))
    return { success: true }
  }

  const { error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)

  if (error) {
    console.error('Error updating goal:', error)
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem(`journal-goals-${year}`) || '[]')
    const updated = existing.map(g => g.id === goalId ? { ...g, ...updates } : g)
    localStorage.setItem(`journal-goals-${year}`, JSON.stringify(updated))
    return { success: false, error }
  }

  return { success: true }
}

export async function deleteGoal(year, goalId) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(`journal-goals-${year}`) || '[]')
    const filtered = existing.filter(g => g.id !== goalId)
    localStorage.setItem(`journal-goals-${year}`, JSON.stringify(filtered))
    return { success: true }
  }

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)

  if (error) {
    console.error('Error deleting goal:', error)
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem(`journal-goals-${year}`) || '[]')
    const filtered = existing.filter(g => g.id !== goalId)
    localStorage.setItem(`journal-goals-${year}`, JSON.stringify(filtered))
    return { success: false, error }
  }

  return { success: true }
}

// ============================================
// REFLECTIONS (yearly reflections)
// ============================================

export async function fetchReflections(year) {
  if (!supabase) {
    const saved = localStorage.getItem(`journal-reflections-${year}`)
    return saved ? JSON.parse(saved) : {}
  }

  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('year', year)

  if (error) {
    console.error('Error fetching reflections:', error)
    const saved = localStorage.getItem(`journal-reflections-${year}`)
    return saved ? JSON.parse(saved) : {}
  }

  // Convert array to object keyed by prompt_id
  const reflections = {}
  data.forEach(reflection => {
    reflections[reflection.prompt_id] = reflection.content
  })
  return reflections
}

export async function saveReflection(year, promptId, content) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(`journal-reflections-${year}`) || '{}')
    existing[promptId] = content
    localStorage.setItem(`journal-reflections-${year}`, JSON.stringify(existing))
    return { success: true }
  }

  const { error } = await supabase
    .from('reflections')
    .upsert({
      year: year,
      prompt_id: promptId,
      content: content,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'year,prompt_id'
    })

  if (error) {
    console.error('Error saving reflection:', error)
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem(`journal-reflections-${year}`) || '{}')
    existing[promptId] = content
    localStorage.setItem(`journal-reflections-${year}`, JSON.stringify(existing))
    return { success: false, error }
  }

  return { success: true }
}

export async function saveAllReflections(year, reflections) {
  if (!supabase) {
    localStorage.setItem(`journal-reflections-${year}`, JSON.stringify(reflections))
    return { success: true }
  }

  const entries = Object.entries(reflections).map(([promptId, content]) => ({
    year: year,
    prompt_id: promptId,
    content: content,
    updated_at: new Date().toISOString()
  }))

  if (entries.length === 0) return { success: true }

  const { error } = await supabase
    .from('reflections')
    .upsert(entries, {
      onConflict: 'year,prompt_id'
    })

  if (error) {
    console.error('Error saving reflections:', error)
    localStorage.setItem(`journal-reflections-${year}`, JSON.stringify(reflections))
    return { success: false, error }
  }

  return { success: true }
}
