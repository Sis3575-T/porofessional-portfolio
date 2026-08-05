import { FingerprintJS } from "@fingerprintjs/fingerprintjs-pro-server-api";
import axios from "axios";
import crypto from "crypto";

const API_URL = process.env.FINGERPRINT_API_URL;
const API_KEY = process.env.FINGERPRINT_API_KEY;

export class FingerprintService {
  static instance;
  fpPromise;

  constructor() {
    this.fpPromise = this.initFingerprintJS();
  }

  static getInstance() {
    if (!FingerprintService.instance) {
      FingerprintService.instance = new FingerprintService();
    }
    return FingerprintService.instance;
  }

  async initFingerprintJS() {
    try {
      const fp = FingerprintJS.load();
      return fp;
    } catch (error) {
      console.error("Failed to load FingerprintJS:", error);
      throw error;
    }
  }

  async getVisitorId() {
    try {
      const fp = await this.fpPromise;
      const result = await fp.get({ extendedResult: true });
      return result.visitorId;
    } catch (error) {
      console.error("Failed to get visitor ID:", error);
      throw error;
    }
  }

  async getVisitorData() {
    try {
      const fp = await this.fpPromise;
      const result = await fp.get({ extendedResult: true });
      return {
        visitorId: result.visitorId,
        browser: {
          name: result.components.browser?.name,
          version: result.components.browser?.version,
          engine: result.components.browser?.engine,
        },
        os: {
          name: result.components.os?.name,
          version: result.components.os?.version,
        },
        device: {
          type: result.components.device?.type,
          vendor: result.components.device?.vendor,
          model: result.components.device?.model,
        },
        screen: result.components.screen,
        timezone: result.components.timezone,
        language: result.components.language,
        platform: result.components.platform,
        userAgent: result.components.userAgent,
        ip: result.ip,
      };
    } catch (error) {
      console.error("Failed to get visitor data:", error);
      throw error;
    }
  }
}

export const fingerprintService = FingerprintService.getInstance();
