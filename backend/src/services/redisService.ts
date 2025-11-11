import { createClient, RedisClientType } from 'redis';

/**
 * Singleton service for Redis operations
 * Handles caching, pub/sub, and real-time data distribution
 */
export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;
  private subscriber: RedisClientType | null = null;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * Connect to Redis server
   */
  public async connect(): Promise<void> {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

      this.client = createClient({ url: redisUrl });
      this.subscriber = createClient({ url: redisUrl });

      await this.client.connect();
      await this.subscriber.connect();

      this.connected = true;
      console.log('📦 Redis connected successfully');
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      this.connected = false;
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    if (this.client) await this.client.quit();
    if (this.subscriber) await this.subscriber.quit();
    this.connected = false;
    console.log('📦 Redis disconnected');
  }

  /**
   * Check if Redis is connected
   */
  public isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get sensor data from Redis cache
   */
  public async getSensorData(): Promise<any> {
    if (!this.client) throw new Error('Redis client not initialized');

    const data = await this.client.get('sensor:current');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Set sensor data in Redis cache
   */
  public async setSensorData(data: any): Promise<void> {
    if (!this.client) throw new Error('Redis client not initialized');

    await this.client.set('sensor:current', JSON.stringify(data), {
      EX: 300 // Expire after 5 minutes
    });
  }

  /**
   * Publish message to a channel
   */
  public async publish(channel: string, message: string): Promise<void> {
    if (!this.client) throw new Error('Redis client not initialized');

    await this.client.publish(channel, message);
  }

  /**
   * Subscribe to a Redis channel
   */
  public async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    if (!this.subscriber) throw new Error('Redis subscriber not initialized');

    await this.subscriber.subscribe(channel, callback);
    console.log(`📡 Subscribed to channel: ${channel}`);
  }
}
