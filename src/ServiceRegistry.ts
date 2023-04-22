import semver from "semver";

class ServiceRegistry {
  services: any;
  timeout: number;

  constructor() {
    this.services = {};
    this.timeout = 40;
  }

  async register(name: string, version: string, ip: string, port: number) {
    const key = name + version + ip + port;

    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key] = {
        ...this.services[key],
        timestamp: Math.floor(new Date().valueOf() / 1000),
        name: name,
        version: version,
        ip: ip,
        port: port,
      };
      console.log(`service added: ${key}`);
      return key;
    }
    this.services[key].timestamp = Math.floor(new Date().valueOf() / 1000);
    console.log(`service updated: ${key}`);
    return key;
  }

  async find(name: string, version: string) {
    const candidates = Object.values(this.services).filter(
      (service: any) =>
        service.name === name && semver.satisfies(service.version, version)
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  async remove(name: string, version: string, ip: string, port: number) {
    const key = name + version + ip + port;
    delete this.services[key];
    return key;
  }
}

export default ServiceRegistry;
