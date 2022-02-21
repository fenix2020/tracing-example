const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3006;

const serviceName = process.env.SERVICE_NAME || "serviceUnknown";
const { trace } = require("@opentelemetry/api");

const tracer = trace.getTracer(serviceName);

const model = new mongoose.Schema({
  response1: {
    type: String,
  },
  response2: {
    type: String,
  },
});

const Model = mongoose.model("Model", model);

app.post("/send", async (req, res) => {
  const req1 = await axios.post(
    "https://webhook.site/3744684f-11d6-4b2a-ab64-141182bc8dc5"
  );
  const req2 = await axios.post(
    "https://webhook.site/3744684f-11d6-4b2a-ab64-141182bc8dc5"
  );
  const span = tracer.startSpan("Business logic in service2");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  span.end();
  const model = new Model({
    response1: req1.data.response,
    response2: req2.data.response,
  });
  await model.save();
  res.send(model);
});

app.listen(port, () => {
  console.log(`service2 start on http://0.0.0.0:${port}!`);
  mongoose.connect(
    "mongodb://127.0.0.1:27017/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("DB connect!");
    }
  );
});
