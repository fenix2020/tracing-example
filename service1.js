const express = require("express");
const axios = require("axios");
const app = express();
const port = 3005;

const serviceName = process.env.SERVICE_NAME || "serviceUnknown";
const { trace } = require("@opentelemetry/api");

const tracer = trace.getTracer(serviceName);

app.get("/send", async (req, res) => {
  const request = await axios.post("http://0.0.0.0:3006/send");

  const span = tracer.startSpan("Business logic in service1");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  span.end();
  res.send(request.data);
});

app.listen(port, () => {
  console.log(`service1 start on http://0.0.0.0:${port} !`);
});
