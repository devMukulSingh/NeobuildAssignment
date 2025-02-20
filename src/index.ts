import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import authApp from "./routes/authApp.js"
import applicantApp from './routes/applicantApp.js'

const app = new Hono().basePath("/api/v1")

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/auth",authApp)
app.route("/applicant",applicantApp)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://${info.address}:${info.port}`)
})
