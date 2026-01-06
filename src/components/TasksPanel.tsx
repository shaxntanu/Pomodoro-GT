'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check, Trash2, Undo2 } from 'lucide-react'
import { useStore } from '@/store/useStore'

const panelVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 200 },
  },
  exit: { opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } },
}

const taskVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -100, scale: 0.95 },
}

export function TasksPanel() {
  const { tasksPanelOpen, tasks, addTask, toggleTask, deleteTask, toggleTasksPanel } = useStore()
  const [newTask, setNewTask] = useState('')

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask.trim())
      setNewTask('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <AnimatePresence>
      {tasksPanelOpen && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full lg:w-auto lg:min-w-[320px] xl:min-w-[380px] overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl text-white">Focus Tasks</h3>
            <motion.button
              onClick={toggleTasksPanel}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close tasks"
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="flex gap-2 mb-4 sm:mb-6">
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What are you focusing on?"
              maxLength={100}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors text-sm sm:text-base"
            />
            <motion.button
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-500 text-gray-400 rounded-lg hover:border-white hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: newTask.trim() ? 1.05 : 1 }}
              whileTap={{ scale: newTask.trim() ? 0.95 : 1 }}
              aria-label="Add task"
            >
              <Plus size={18} />
            </motion.button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {activeTasks.length > 0 && (
              <div>
                <h4 className="text-gray-500 text-xs sm:text-sm mb-2">Active ({activeTasks.length})</h4>
                <div className="space-y-1.5 sm:space-y-2">
                  <AnimatePresence mode="popLayout">
                    {activeTasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        onToggle={() => toggleTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h4 className="text-gray-500 text-xs sm:text-sm mb-2">Completed ({completedTasks.length})</h4>
                <div className="space-y-1.5 sm:space-y-2">
                  <AnimatePresence mode="popLayout">
                    {completedTasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        onToggle={() => toggleTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base"
              >
                No tasks yet. Add one to get started!
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface TaskItemProps {
  task: { id: string; text: string; completed: boolean; completedPomodoros: number }
  index: number
  onToggle: () => void
  onDelete: () => void
}

function TaskItem({ task, index, onToggle, onDelete }: TaskItemProps) {
  return (
    <motion.div
      variants={taskVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.03 }}
      layout
      className="bg-white/5 border border-white/15 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 group"
    >
      <motion.button
        onClick={onToggle}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          task.completed
            ? 'bg-white border-white text-black'
            : 'border-gray-500 hover:border-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check size={12} />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <p className={`text-xs sm:text-sm md:text-base truncate ${
          task.completed ? 'text-gray-500 line-through' : 'text-gray-300'
        }`}>
          {task.text}
        </p>
        {task.completedPomodoros > 0 && (
          <p className="text-[10px] sm:text-xs text-gray-500">
            🍅 {task.completedPomodoros}
          </p>
        )}
      </div>

      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {task.completed && (
          <motion.button
            onClick={onToggle}
            className="p-1 sm:p-1.5 text-gray-500 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Undo completion"
          >
            <Undo2 size={14} />
          </motion.button>
        )}
        <motion.button
          onClick={onDelete}
          className="p-1 sm:p-1.5 text-gray-500 hover:text-red-400 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  )
}
