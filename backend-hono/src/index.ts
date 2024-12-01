import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import workoutRoutes from './endpoints/workout.js'
import authRoutes from './endpoints/auth.js'
import exerciseRoutes from './endpoints/exercise.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Mount routes
app.route('/api/workouts', workoutRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/exercises', exerciseRoutes)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
