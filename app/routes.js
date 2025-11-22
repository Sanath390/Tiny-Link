import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("/dashboard", "main/dashboard.jsx"),
  route("/healthz", "routes/healthz.jsx"),
  route("/code/:code", "routes/code.$code.jsx"),
  route("/api/links", "routes/api.links.jsx"),
  route("/api/links/:code", "routes/api.links.$code.jsx"),
  route("/:code", "routes/$code.jsx")
];
