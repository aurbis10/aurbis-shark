#!/usr/bin/env node
import { createServer } from "http"
import { parse } from "url"
import next from "next"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🚀 Aurbis Arbitrage Bot ready on http://${hostname}:${port}`)
      console.log(`📊 Dashboard: http://${hostname}:${port}`)
      console.log(`🔧 Setup: http://${hostname}:${port}/setup`)
      console.log(`📈 Demo Trading: http://${hostname}:${port}/continuous-demo`)
      console.log(`📋 Diagnostics: http://${hostname}:${port}/diagnostics`)
    })
})
