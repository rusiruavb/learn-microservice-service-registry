import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import ServiceRegistry from "./ServiceRegistry";

const server: Express = express();
const registry = new ServiceRegistry();

server.use(cors());
server.use(express.json());

server.get("/", (_req: Request, res: Response, next: NextFunction) => {
  res.json({ port: 8080, name: "service_registry", version: "1.0.0" });
  next();
});

server.get(
  "/find/:servicename/:serviceversion",
  (req: Request, res: Response, next: NextFunction) => {
    const { servicename, serviceversion } = req.params;
    const service = registry.find(servicename, serviceversion);

    if (!service)
      return res
        .status(404)
        .json({ action: "service_find", message: "service_not_found" });

    res.json(service);
    next();
  }
);

server.put(
  "/register/:servicename/:serviceversion/:serviceport",
  (req: Request, res: Response, next: NextFunction) => {
    const { servicename, serviceversion, serviceport } = req.params;
    const serviceip = req.connection.remoteAddress.includes("::")
      ? [`${req.connection.remoteAddress}`]
      : req.connection.remoteAddress;
    const servicekey = registry.register(
      servicename,
      serviceversion,
      serviceip,
      serviceport
    );

    res.json({ event: "service_add", servicekey: servicekey });
    next();
  }
);

server.delete(
  "/delete/:servicename/:serviceversion",
  (req: Request, res: Response, next: NextFunction) => {
    const { servicename, serviceversion, serviceport } = req.params;
    const serviceip = req.connection.remoteAddress.includes("::")
      ? [`${req.connection.remoteAddress}`]
      : req.connection.remoteAddress;
    const servicekey = registry.remove(
      servicename,
      serviceversion,
      serviceip,
      serviceport
    );
    res.json({ event: "service_remove", servicekey: servicekey });
    next();
  }
);

server.listen(8080, () => {
  console.log("server is running on port 8080");
});
