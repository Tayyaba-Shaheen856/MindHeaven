import React, { useState, useEffect } from 'react';
import './style/GoalsTasksPage.css';
import Confetti from 'react-confetti';

const GoalsTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [goalTasksInput, setGoalTasksInput] = useState('');
  const [confetti, setConfetti] = useState(false);

  // Load saved tasks/goals on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    setTasks(savedTasks);
    setGoals(savedGoals);
  }, []);

  // Save tasks immediately whenever they change
  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  // Save goals immediately whenever they change
  const updateGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  // Add single task
  const addTask = () => {
    if (!taskInput.trim()) return;
    const newTasks = [...tasks, { text: taskInput, completed: false }];
    updateTasks(newTasks);
    setTaskInput('');
  };

  // Delete single task
  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasks(newTasks);
  };

  // Toggle task completion
  const toggleTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    updateTasks(newTasks);
  };

  // Add goal with tasks
  const addGoal = () => {
    if (!goalInput.trim()) return;
    const tasksArray = goalTasksInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => ({ text: t, completed: false }));
    const newGoals = [...goals, { title: goalInput, tasks: tasksArray }];
    updateGoals(newGoals);
    setGoalInput('');
    setGoalTasksInput('');
  };

  // Delete goal
  const deleteGoal = (goalIndex) => {
    const newGoals = goals.filter((_, i) => i !== goalIndex);
    updateGoals(newGoals);
  };

  // Toggle goal task completion
  const toggleGoalTask = (goalIndex, taskIndex) => {
    const newGoals = goals.map((goal, gIdx) => {
      if (gIdx !== goalIndex) return goal;
      const updatedTasks = goal.tasks.map((task, tIdx) =>
        tIdx === taskIndex ? { ...task, completed: !task.completed } : task
      );
      return { ...goal, tasks: updatedTasks };
    });
    updateGoals(newGoals);

    // Confetti if all tasks in goal completed
    const allDone = newGoals[goalIndex].tasks.every(t => t.completed);
    if (allDone) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
      alert(`🎉 Congrats! You completed the goal: "${newGoals[goalIndex].title}"`);
    }
  };

  return (
    <div className="goals-page">
      {confetti && <Confetti />}
      <h1>Goals & Tasks</h1>

      {/* Single Tasks */}
      <div className="tasks-section">
        <h2>Tasks</h2>
        <input
          type="text"
          placeholder="New task"
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>

        <ul>
          {tasks.map((task, idx) => (
            <li key={idx} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(idx)}
              />
              <span>{task.text}</span>
              <button onClick={() => deleteTask(idx)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Goals */}
      <div className="goals-section">
        <h2>Goals</h2>
        <input
          type="text"
          placeholder="Goal title"
          value={goalInput}
          onChange={e => setGoalInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tasks (comma separated)"
          value={goalTasksInput}
          onChange={e => setGoalTasksInput(e.target.value)}
        />
        <button onClick={addGoal}>Add Goal</button>

        {goals.map((goal, gIdx) => {
          const completedCount = goal.tasks.filter(t => t.completed).length;
          const totalTasks = goal.tasks.length;
          const progress = totalTasks ? (completedCount / totalTasks) * 100 : 0;

          return (
            <div key={gIdx} className="goal-card">
              <h3>{goal.title}</h3>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }} />
              </div>
              <ul>
                {goal.tasks.map((task, tIdx) => (
                  <li key={tIdx} className={task.completed ? 'completed' : ''}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleGoalTask(gIdx, tIdx)}
                    />
                    <span>{task.text}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => deleteGoal(gIdx)}>Delete Goal</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsTasksPage;
