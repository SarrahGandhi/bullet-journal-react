import { useState, useEffect, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import YearAtGlance from "./components/YearAtGlance";
import MonthlyPlanner from "./components/MonthlyPlanner";
import MoodTracker from "./components/MoodTracker";
import DayView from "./components/DayView";
import Reflections from "./components/Reflections";
import Goals from "./components/Goals";
import { fetchJournalEntries, saveJournalEntry } from "./lib/journalService";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState("year");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalData, setJournalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load journal data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchJournalEntries();
        setJournalData(data);
      } catch (error) {
        console.error("Error loading journal data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentView("day");
  };

  const handleSaveDay = useCallback(async (dateKey, data) => {
    // Update local state immediately for responsiveness
    setJournalData((prev) => ({
      ...prev,
      [dateKey]: data,
    }));

    // Save to Supabase in background
    try {
      await saveJournalEntry(dateKey, data);
    } catch (error) {
      console.error("Error saving to Supabase:", error);
    }
  }, []);

  const getDateKey = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
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
        {currentView === "year" && (
          <YearAtGlance
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            journalData={journalData}
          />
        )}

        {currentView === "month" && (
          <MonthlyPlanner
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            journalData={journalData}
            onSaveDay={handleSaveDay}
            getDateKey={getDateKey}
          />
        )}

        {currentView === "goals" && (
          <Goals
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {currentView === "reflections" && (
          <Reflections
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {currentView === "mood" && (
          <MoodTracker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            journalData={journalData}
            onSaveDay={handleSaveDay}
            getDateKey={getDateKey}
          />
        )}

        {currentView === "day" && (
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
  );
}

export default App;
