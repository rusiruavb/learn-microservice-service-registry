import semver from "semver";

class ServiceRegistry {
  services: any;
  timeout: number;

  constructor() {
    this.services = {};
    this.timeout = 40;
  }

   register(name: string, version: string, ip: string, port: number) {
     this.cleanup();
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

   find(name: string, version: string) {
     this.cleanup()
    const candidates = Object.values(this.services).filter(
      (service: any) =>
        service.name === name && semver.satisfies(service.version, version)
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

   remove(name: string, version: string, ip: string, port: number) {
    const key = name + version + ip + port;
    delete this.services[key];
    return key;
  }
  
  cleanup() {
    const now = Math.floor(new Date().valueOf() / 1000)
    Object.keys(this.services).forEach(servicekey => {
      if (this.services[servicekey].timestamp + this.timeout < now) {
        delete this.services[servicekey];
        console.log(`service cleaned ${servicekey}`)
      }
    })
  }
}

export default ServiceRegistry;
