'use client'

import { useState, useEffect } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  restTime: number; // in seconds
  setTime: number; // seconds per set
}

export default function RepCounter() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentRep, setCurrentRep] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(0)
  const [setTimeLeft, setSetTimeLeft] = useState(0)
  const [exerciseName, setExerciseName] = useState('')
  const [reps, setReps] = useState('')
  const [sets, setSets] = useState('')
  const [restTime, setRestTime] = useState('')
  const [setTime, setSetTime] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && !isPaused) {
      if (isResting && restTimeLeft > 0) {
        // Rest timer
        timer = setInterval(() => {
          setRestTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (isResting && restTimeLeft === 0) {
        // Rest completed
        setIsResting(false);
        if (currentSet < (currentExercise?.sets || 0)) {
          setCurrentSet((prev) => prev + 1);
          setCurrentRep(0);
          setSetTimeLeft(currentExercise?.setTime || 0);
        } else {
          // Exercise completed
          setIsActive(false);
          setCurrentExercise(null);
          setCurrentSet(1);
          setCurrentRep(0);
        }
      } else if (!isResting && currentExercise) {
        // Set timer
        timer = setInterval(() => {
          if (setTimeLeft > 0) {
            setSetTimeLeft((prev) => prev - 1);
          } else {
            // Set completed
            if (currentSet < currentExercise.sets) {
              setIsResting(true);
              setRestTimeLeft(currentExercise.restTime);
            } else {
              setIsActive(false);
              setCurrentExercise(null);
              setCurrentSet(1);
              setCurrentRep(0);
            }
          }
        }, 1000);
      }
    }

    return () => clearInterval(timer);
  }, [isActive, isPaused, isResting, restTimeLeft, setTimeLeft, currentSet, currentExercise]);

  const addExercise = () => {
    if (!exerciseName.trim()) {
      setFormError('Please enter an exercise name.')
      return;
    }
    
    if (!reps || !sets || !restTime || !setTime) {
      setFormError('Please fill in reps, sets, seconds per set, and rest time.')
      return;
    }
    
    const repsNum = parseInt(reps, 10)
    const setsNum = parseInt(sets, 10)
    const restNum = parseInt(restTime, 10)
    const setTimeNum = parseInt(setTime, 10)

    if (
      Number.isNaN(repsNum) ||
      Number.isNaN(setsNum) ||
      Number.isNaN(restNum) ||
      Number.isNaN(setTimeNum) ||
      repsNum <= 0 ||
      setsNum <= 0 ||
      setTimeNum <= 0 ||
      restNum < 0
    ) {
      setFormError('Please enter valid numbers (reps/sets/seconds must be positive, rest can be 0 or more).')
      return;
    }

    setFormError(null)

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName.trim(),
      reps: repsNum,
      sets: setsNum,
      restTime: restNum,
      setTime: setTimeNum,
    };
    
    setExercises(prevExercises => [...prevExercises, newExercise]);
    
    // Clear form
    setExerciseName('');
    setReps('');
    setSets('');
    setRestTime('');
    setSetTime('');
  };

  const deleteExercise = (id: string) => {
    setExercises((prevExercises) => prevExercises.filter(exercise => exercise.id !== id));
  };

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentSet(1);
    setCurrentRep(0);
    setIsResting(false);
    setSetTimeLeft(exercise.setTime);
    setIsActive(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const stopExercise = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentExercise(null);
    setCurrentSet(1);
    setCurrentRep(0);
  };

  const relatedTools = [
    { name: 'Calorie Calculator', href: '/health-fitness/calorie-calculator' },
    { name: 'Heart Rate Zone Calculator', href: '/health-fitness/heart-rate' },
    { name: 'Water Intake Calculator', href: '/health-fitness/water-intake' },
    { name: 'Sleep Time Calculator', href: '/health-fitness/sleep-calculator' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Exercise Rep Counter"
        description="Free exercise rep counter - Track your exercise repetitions with built-in timer. Set custom rest periods between sets. Perfect for workouts. No signup required."
        category="Health & Fitness"
        url="/health-fitness/rep-counter"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Health & Fitness', href: '/health-fitness' },
            { label: 'Exercise Rep Counter' },
          ]} />
          <h1 className="text-3xl font-bold mb-6">Exercise Rep Counter</h1>
        <p className="text-gray-600 mb-2">
          Create a simple workout, then track sets, reps, and rest with built-in timers.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Add one or more exercises below, then start an exercise to follow along with the countdown timer and
          track how many reps you complete each set.
        </p>
        
        {/* Add Exercise Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Exercise</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Name
              </label>
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Push-ups"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sets
                </label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seconds/Set
                </label>
                <input
                  type="number"
                  value={setTime}
                  onChange={(e) => setSetTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rest (sec)
                </label>
                <input
                  type="number"
                  value={restTime}
                  onChange={(e) => setRestTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>
            <button
              onClick={addExercise}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Exercise
            </button>
            {formError && (
              <p className="text-sm text-red-600">
                {formError}
              </p>
            )}
          </div>
        </div>

        {/* Exercise List */}
        {exercises.length > 0 && !currentExercise && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Exercises</h2>
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps
                      ({exercise.setTime}s/set, {exercise.restTime}s rest)
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startExercise(exercise)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => deleteExercise(exercise.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Exercise */}
        {currentExercise && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{currentExercise.name}</h2>
              <div className="space-x-2">
                <button
                  onClick={togglePause}
                  className={`px-4 py-2 rounded-md ${
                    isPaused
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white transition-colors`}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={stopExercise}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
            
            {isResting ? (
              <div className="text-center py-8">
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  Rest Time
                </p>
                <p className="text-4xl font-bold">{restTimeLeft}s</p>
                <p className="mt-2 text-gray-600">
                  Next: Set {currentSet + 1} of {currentExercise.sets}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-6">
                  <p className="text-xl text-gray-600">
                    Set {currentSet} of {currentExercise.sets}
                  </p>
                  <p className="text-lg text-gray-600 mt-2">
                    Target: {currentExercise.reps} reps
                  </p>
                </div>
                <div className="text-6xl font-bold text-blue-600">
                  {setTimeLeft}
                </div>
                <p className="mt-2 text-gray-600">seconds remaining in set</p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-600">
                    Track your completed reps for this set:
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentRep((prev) => Math.max(0, prev - 1))}
                      className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-3xl font-semibold text-blue-600 min-w-[3rem] inline-block">
                      {currentRep}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentRep((prev) =>
                          currentExercise ? Math.min(currentExercise.reps, prev + 1) : prev + 1
                        )
                      }
                      className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <RelatedTools tools={relatedTools} currentTool="/health-fitness/rep-counter" />
      </div>
    </div>
    </>
  )
} 