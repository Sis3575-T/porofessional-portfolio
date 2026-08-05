import crypto from "crypto";
import axios from "axios";
import { config } from "shared/config.js";

const GEOLOCATION_API_URL = "https://ipinfo.io";
const GEOLOCATION_TOKEN = config.services.ipinfo.token;

export class GeolocationService {
  static cache = new Map();
  static CACHE_SIZE_LIMIT = 1000;
  static CACHE_TTL = 24 * 60 * 60 * 1000;

  static async getLocationByIp(ip) {
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") {
      return {
        country: null,
        region: null,
        city: null,
        latitude: null,
        longitude: null,
        timezone: null,
        ipHash: this.hashIp(ip),
      };
    }

    if (this.cache.has(ip)) {
      const cached = this.cache.get(ip);
      const age = Date.now() - cached.timestamp;
      if (age < this.CACHE_TTL) {
        return cached;
      }
    }

    try {
      const url = GEOLOCATION_TOKEN
        ? `${GEOLOCATION_API_URL}/${ip}/json?token=${GEOLOCATION_TOKEN}`
        : `${GEOLOCATION_API_URL}/${ip}/json`;

      const response = await axios.get(url, { timeout: 2000 });
      const data = response.data;

      const location = {
        country: data.country || null,
        region: data.region || data.region_code || null,
        city: data.city || null,
        latitude: data.loc?.split(",")?.[0] || null,
        longitude: data.loc?.split(",")?.[1] || null,
        timezone: data.timezone || null,
        ipHash: this.hashIp(ip),
        timestamp: Date.now(),
      };

      this.cache.set(ip, location);

      if (this.cache.size > this.CACHE_SIZE_LIMIT) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }

      return location;
    } catch (error) {
      console.error(`Failed to get location for IP ${ip}:`, error);
      return {
        country: null,
        region: null,
        city: null,
        latitude: null,
        longitude: null,
        timezone: null,
        ipHash: this.hashIp(ip),
        timestamp: Date.now(),
      };
    }
  }

  static hashIp(ip) {
    return crypto.createHash("sha256").update(ip).digest("hex");
  }
}

export const geolocationService = new GeolocationService();
