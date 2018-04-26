
export class Config {

  private m: Map<string, any>;

  constructor(configObj: {[key: string]: any}) {
    this.m = new Map<string, any>(Object.entries(configObj));

  }

  get(key: string, fallback?: any): any {
    const value = this.m.get(key);
    return (value !== undefined) ? value : fallback;
  }

  getBoolean(key: string, fallback = false): boolean {
    const val = this.m.get(key);
    if (val === undefined) {
      return fallback;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  getNumber(key: string, fallback?: number): number {
    const val = parseFloat(this.m.get(key));
    return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  set(key: string, value: any) {
    this.m.set(key, value);
  }
}
