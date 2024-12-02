import Cors from "cors";

const corsMiddleware = Cors({
  methods: ["GET", "HEAD", "POST", "PUT"],
  origin: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsHandler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
}
