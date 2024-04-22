import path from "node:path";
export const root = path.resolve(process.cwd()); // project root directory (./)

const environment = process.env.NODE_ENV; // development or production
export const config = {
  /* Server */
  port: process.env.PORT,
  domain: "http://127.0.0.1:" + process.env.PORT, // remove process.env.PORT in production

  /* Environment */
  isProd: environment === "production",
  isDev: environment === "development",

  /* Helmet */
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*"],
        fontSrc: ["'self'", "*"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "*"],
        frameSrc: ["'self'", "https://www.youtube.com"],
        childSrc: ["'self'"],
        connectSrc: ["'self'", "*"],
        workerSrc: ["'self'", "blob:"],
        manifestSrc: ["'self'"],
      },
    },
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: false,
    originAgentCluster: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: true },
    xDownloadOptions: true,
    xFrameOptions: { action: "sameorigin" },
    xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
    xXssProtection: false,
  },

  /* Body Parser */
  bodyParser: {
    extended: true,
    limit: "50kb", // body limit
  },

  /* Compression */
  compression: {
    level: 6,
    threshold: 1000,
    memLevel: 8,
  },

  /* Paths */
  paths: {
    root: root,
    logs: path.join(root, "src", "logs"),
    views: path.join(root, "src", "views"),
    public: path.join(root, "src", "public"),
    static: path.join(root, "src", "public", "static"),
    favicon: path.join(root, "src", "public", "favicon.ico"),
    json: path.join(root, "src", "data", "json"),
  },
};
