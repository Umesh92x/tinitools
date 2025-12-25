'use client'

import { useState } from 'react'

type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
type Goal = 'maintain' | 'lose' | 'gain'

interface DietPlan {
  day: string;
  breakfast: string;
  snack1: string;
  lunch: string;
  snack2: string;
  dinner: string;
  calories: {
    breakfast: number;
    snack1: number;
    lunch: number;
    snack2: number;
    dinner: number;
  };
}

const activityLevels = {
  sedentary: { label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  light: { label: 'Lightly active (light exercise/sports 1-3 days/week)', multiplier: 1.375 },
  moderate: { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', multiplier: 1.55 },
  active: { label: 'Very active (hard exercise/sports 6-7 days/week)', multiplier: 1.725 },
  'very-active': { label: 'Extra active (very hard exercise/sports & physical job)', multiplier: 1.9 },
}

const goals = {
  maintain: { label: 'Maintain weight', modifier: 0 },
  lose: { label: 'Lose weight', modifier: -500 },
  gain: { label: 'Gain weight', modifier: 500 },
}

const generateDietPlan = (totalCalories: number, goal: Goal): DietPlan[] => {
  const plans: Record<Goal, DietPlan[]> = {
    lose: [
      {
        day: 'Monday',
        breakfast: 'Oatmeal with berries and nuts',
        snack1: 'Apple with almond butter',
        lunch: 'Grilled chicken salad with olive oil dressing',
        snack2: 'Greek yogurt with honey',
        dinner: 'Baked salmon with quinoa and steamed vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Tuesday',
        breakfast: 'Smoothie bowl with protein powder',
        snack1: 'Handful of mixed nuts',
        lunch: 'Turkey and avocado wrap with vegetables',
        snack2: 'Carrot sticks with hummus',
        dinner: 'Lean beef stir-fry with brown rice',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Wednesday',
        breakfast: 'Egg white omelet with vegetables',
        snack1: 'Protein smoothie',
        lunch: 'Tuna salad with whole grain crackers',
        snack2: 'Rice cake with peanut butter',
        dinner: 'Grilled chicken breast with sweet potato',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Thursday',
        breakfast: 'Greek yogurt parfait with granola',
        snack1: 'Celery with almond butter',
        lunch: 'Quinoa bowl with grilled tofu',
        snack2: 'Hard-boiled egg',
        dinner: 'White fish with roasted vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Friday',
        breakfast: 'Protein pancakes with berries',
        snack1: 'Orange and almonds',
        lunch: 'Chickpea and vegetable curry',
        snack2: 'Protein bar',
        dinner: 'Lean pork with brown rice',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Saturday',
        breakfast: 'Cottage cheese with fruit',
        snack1: 'Turkey and cheese roll-ups',
        lunch: 'Lentil soup with whole grain bread',
        snack2: 'Apple with protein shake',
        dinner: 'Grilled cod with quinoa',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Sunday',
        breakfast: 'Scrambled eggs with spinach',
        snack1: 'Banana with nut butter',
        lunch: 'Greek salad with grilled chicken',
        snack2: 'Mixed berries with yogurt',
        dinner: 'Turkey meatballs with zucchini noodles',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.1),
          lunch: Math.round(totalCalories * 0.3),
          snack2: Math.round(totalCalories * 0.1),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
    ],
    gain: [
      {
        day: 'Monday',
        breakfast: 'Protein pancakes with banana and maple syrup',
        snack1: 'Trail mix with dried fruits and nuts',
        lunch: 'Chicken rice bowl with avocado',
        snack2: 'Protein shake with oats',
        dinner: 'Steak with potato and roasted vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
      {
        day: 'Tuesday',
        breakfast: 'Eggs, whole grain toast, and avocado',
        snack1: 'Peanut butter banana smoothie',
        lunch: 'Turkey and cheese sandwich with nuts',
        snack2: 'Greek yogurt with granola',
        dinner: 'Salmon with quinoa and vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
      {
        day: 'Wednesday',
        breakfast: 'Whole grain waffles with peanut butter and banana',
        snack1: 'Mass gainer shake',
        lunch: 'Beef and rice bowl with avocado',
        snack2: 'Mixed nuts and dried fruit',
        dinner: 'Chicken pasta with olive oil',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
      {
        day: 'Thursday',
        breakfast: 'Bagel with cream cheese and smoked salmon',
        snack1: 'Protein bars and banana',
        lunch: 'Tuna melt sandwich with cheese',
        snack2: 'Cottage cheese with honey',
        dinner: 'Beef stir-fry with noodles',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
      {
        day: 'Friday',
        breakfast: 'Oatmeal with protein powder and nuts',
        snack1: 'Greek yogurt with granola',
        lunch: 'Chicken burrito with guacamole',
        snack2: 'Protein smoothie with oats',
        dinner: 'Salmon with sweet potato',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
      {
        day: 'Saturday',
        breakfast: 'French toast with fruit and maple syrup',
        snack1: 'Protein shake with almond butter',
        lunch: 'Turkey club sandwich with avocado',
        snack2: 'Trail mix with dark chocolate',
        dinner: 'Pork chops with mashed potatoes',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
      {
        day: 'Sunday',
        breakfast: 'Breakfast burrito with eggs and cheese',
        snack1: 'Protein balls',
        lunch: 'Grilled cheese with tomato soup',
        snack2: 'Mass gainer shake',
        dinner: 'Beef lasagna with garlic bread',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.15),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.15),
          dinner: Math.round(totalCalories * 0.2),
        },
      },
    ],
    maintain: [
      {
        day: 'Monday',
        breakfast: 'Whole grain toast with eggs and fruit',
        snack1: 'Apple with cheese',
        lunch: 'Quinoa bowl with chickpeas',
        snack2: 'Mixed nuts and dried fruit',
        dinner: 'Grilled fish with vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Tuesday',
        breakfast: 'Yogurt parfait with granola',
        snack1: 'Hummus with vegetables',
        lunch: 'Mediterranean salad with olive oil',
        snack2: 'Handful of almonds',
        dinner: 'Chicken with brown rice and vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Wednesday',
        breakfast: 'Overnight oats with chia seeds',
        snack1: 'Greek yogurt with berries',
        lunch: 'Turkey and avocado sandwich',
        snack2: 'Carrot sticks with hummus',
        dinner: 'Baked chicken with vegetables',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Thursday',
        breakfast: 'Smoothie bowl with granola',
        snack1: 'Hard-boiled egg with toast',
        lunch: 'Tuna nicoise salad',
        snack2: 'Apple with cheese',
        dinner: 'Tofu stir-fry with brown rice',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Friday',
        breakfast: 'Whole grain toast with avocado',
        snack1: 'Mixed nuts',
        lunch: 'Chickpea Buddha bowl',
        snack2: 'Protein smoothie',
        dinner: 'Grilled fish tacos',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Saturday',
        breakfast: 'Protein pancakes with fruit',
        snack1: 'Rice cake with almond butter',
        lunch: 'Quinoa and black bean bowl',
        snack2: 'Vegetable sticks with dip',
        dinner: 'Grilled shrimp with pasta',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
      {
        day: 'Sunday',
        breakfast: 'Egg and vegetable frittata',
        snack1: 'Fruit salad',
        lunch: 'Lentil and vegetable soup',
        snack2: 'Trail mix',
        dinner: 'Grilled lean steak with sweet potato',
        calories: {
          breakfast: Math.round(totalCalories * 0.25),
          snack1: Math.round(totalCalories * 0.125),
          lunch: Math.round(totalCalories * 0.25),
          snack2: Math.round(totalCalories * 0.125),
          dinner: Math.round(totalCalories * 0.25),
        },
      },
    ],
  };

  return plans[goal];
};

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [result, setResult] = useState<number | null>(null)
  const [bmrValue, setBmrValue] = useState<number | null>(null)
  const [tdeeValue, setTdeeValue] = useState<number | null>(null)
  const [dietPlan, setDietPlan] = useState<DietPlan[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateBMR = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseInt(age, 10)

    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) {
      return null
    }

    // Mifflin-St Jeor Equation
    let bmr = 10 * w + 6.25 * h - 5 * a
    bmr = gender === 'male' ? bmr + 5 : bmr - 161

    return bmr
  }

  const calculateCalories = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const bmr = calculateBMR()

    if (bmr === null) {
      setError('Please enter a valid age (years), weight (kg), and height (cm).')
      setResult(null)
      setDietPlan(null)
      setBmrValue(null)
      setTdeeValue(null)
      return
    }

    setError(null)

    const activityMultiplier = activityLevels[activityLevel].multiplier
    const tdee = bmr * activityMultiplier
    const goalModifier = goals[goal].modifier
    const totalCalories = Math.round(tdee + goalModifier)
    
    setBmrValue(Math.round(bmr))
    setTdeeValue(Math.round(tdee))
    setResult(totalCalories)
    setDietPlan(generateDietPlan(totalCalories, goal))
  }

  const handleReset = () => {
    setGender('male')
    setAge('')
    setWeight('')
    setHeight('')
    setActivityLevel('sedentary')
    setGoal('maintain')
    setResult(null)
    setDietPlan(null)
    setError(null)
    setBmrValue(null)
    setTdeeValue(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Calorie Calculator</h1>
        <p className="text-gray-600 mb-4">
          Calculate your daily calorie needs based on your personal characteristics and goals.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          This calculator uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR) and
          then multiplies it by an activity factor to estimate your Total Daily Energy Expenditure (TDEE).
        </p>

        <form
          onSubmit={calculateCalories}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Age Input */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age (years)
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="10"
                max="120"
                required
              />
            </div>

            {/* Weight Input */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="20"
                max="300"
                step="0.1"
                required
              />
            </div>

            {/* Height Input */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="100"
                max="250"
                required
              />
            </div>

            {/* Activity Level Selection */}
            <div>
              <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                id="activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.entries(activityLevels).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Choose the option that best matches your typical week.
              </p>
            </div>

            {/* Goal Selection */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                Goal
              </label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.entries(goals).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
            <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Calories
            </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Results */}
            {result !== null && (
              <div className="mt-6 space-y-6">
                <div className="p-4 bg-blue-50 rounded-md space-y-2">
                  <h2 className="text-lg font-semibold mb-1">Your Daily Calorie Summary</h2>
                  {bmrValue !== null && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">BMR:</span> {bmrValue} kcal/day (calories burned at rest)
                    </p>
                  )}
                  {tdeeValue !== null && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">TDEE:</span> {tdeeValue} kcal/day (estimated calories burned per day with your activity level)
                    </p>
                  )}
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {result} kcal / day
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    This is an estimate based on your inputs and selected goal ({goals[goal].label.toLowerCase()}).
                    Monitor your progress and adjust if needed.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    This tool is for informational purposes only and does not replace professional medical or dietary advice.
                  </p>
                </div>

                {dietPlan && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Your 7-Day Diet Plan</h2>
                    <div className="space-y-6">
                      {dietPlan.map((plan) => (
                        <div key={plan.day} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <h3 className="text-lg font-semibold text-blue-600 mb-3">{plan.day}</h3>
                          <div className="grid gap-4">
                            <div>
                              <p className="font-medium">
                                Breakfast ({plan.calories.breakfast} kcal)
                              </p>
                              <p className="text-gray-600">{plan.breakfast}</p>
                            </div>
                            <div>
                              <p className="font-medium">
                                Morning Snack ({plan.calories.snack1} kcal)
                              </p>
                              <p className="text-gray-600">{plan.snack1}</p>
                            </div>
                            <div>
                              <p className="font-medium">
                                Lunch ({plan.calories.lunch} kcal)
                              </p>
                              <p className="text-gray-600">{plan.lunch}</p>
                            </div>
                            <div>
                              <p className="font-medium">
                                Afternoon Snack ({plan.calories.snack2} kcal)
                              </p>
                              <p className="text-gray-600">{plan.snack2}</p>
                            </div>
                            <div>
                              <p className="font-medium">
                                Dinner ({plan.calories.dinner} kcal)
                              </p>
                              <p className="text-gray-600">{plan.dinner}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 