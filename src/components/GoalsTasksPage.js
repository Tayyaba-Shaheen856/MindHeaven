import React, { useState } from 'react';
import './style/GoalsTasksPage.css';
import Confetti from 'react-confetti';

const GoalsTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [goalTasksInput, setGoalTasksInput] = useState('');
  const [confetti, setConfetti] = useState(false);

  // Add single task
  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { text: taskInput, completed: false }]);
    setTaskInput('');
  };

  // Add goal with tasks
  const addGoal = () => {
    if (!goalInput.trim()) return;
    const tasksArray = goalTasksInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => ({ text: t, completed: false }));
    setGoals([...goals, { title: goalInput, tasks: tasksArray }]);
    setGoalInput('');
    setGoalTasksInput('');
  };

  // Toggle task completion
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // Toggle goal task completion
  const toggleGoalTask = (goalIndex, taskIndex) => {
    const newGoals = [...goals];
    const task = newGoals[goalIndex].tasks[taskIndex];
    task.completed = !task.completed;
    setGoals(newGoals);

    // Check if all tasks in goal are completed
    if (newGoals[goalIndex].tasks.every(t => t.completed)) {
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
          placeholder="Enter a task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
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
              {task.text}
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
          onChange={(e) => setGoalInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tasks (comma separated)"
          value={goalTasksInput}
          onChange={(e) => setGoalTasksInput(e.target.value)}
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
                  <li
                    key={tIdx}
                    className={task.completed ? 'completed' : ''}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleGoalTask(gIdx, tIdx)}
                    />
                    {task.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsTasksPage;
