const { node, resources, tracing } = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const serviceName = process.env.SERVICE_NAME || "serviceUnknown";
const {
  MongooseInstrumentation,
} = require("opentelemetry-instrumentation-mongoose");

// const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

// const jaegerConfig = {
//   host: "localhost",
//   port: 6832,
// };
// const exporter = new JaegerExporter(jaegerConfig);

const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");

const zipkinConfig = {
  host: "localhost",
  port: 9411,
};
const exporter = new ZipkinExporter(zipkinConfig);

const provider = new node.NodeTracerProvider({
  resource: new resources.Resource({
    "service.name": serviceName,
  }),
});

provider.addSpanProcessor(new tracing.BatchSpanProcessor(exporter));

provider.register();

console.log("tracing initialized");

registerInstrumentations({
  instrumentations: [
    getNodeAutoInstrumentations(),
    new MongooseInstrumentation(),
  ],
});
