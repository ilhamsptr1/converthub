import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const redisConnection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const conversionQueue = new Queue("conversion-jobs", {
  connection: redisConnection,
});

export const conversionQueueEvents = new QueueEvents("conversion-jobs", {
  connection: redisConnection,
});

// Helper function to add a job to the queue
export async function addConversionJob(
  conversionId: string, 
  tool: string, 
  sourceStorageKey: string,
  isPriority: boolean = false
) {
  return await conversionQueue.add(
    "convert",
    { conversionId, tool, sourceStorageKey },
    {
      priority: isPriority ? 1 : 2, // 1 is higher priority in BullMQ than 2 (lower number = higher priority)
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );
}

// In a real production environment, you might run the worker in a separate Node.js process 
// rather than within the Next.js API server to prevent blocking the web thread.
// But for local development/MVP, we can define it here.
export function startWorker() {
  const worker = new Worker(
    "conversion-jobs",
    async (job: Job) => {
      const { conversionId, tool, sourceStorageKey } = job.data;
      console.log(`[Worker] Started processing job ${job.id} for conversion ${conversionId} using tool: ${tool}`);

      try {
        // 1. Mark conversion as processing in DB
        await prisma.conversion.update({
          where: { id: conversionId },
          data: { status: "processing" }
        });

        // 2. Here we would download the file from R2
        // await downloadFromR2(sourceStorageKey);

        // 3. Perform the actual conversion logic (FFmpeg, LibreOffice, Sharp, etc.)
        // const resultBuffer = await performConversion(tool, sourceBuffer);

        // 4. Upload result back to R2
        // const resultStorageKey = await uploadToR2(resultBuffer);

        // Simulated processing time
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const dummyResultKey = `results/dummy-${conversionId}.ext`;

        // 5. Create result file record and mark conversion as completed
        const resultFile = await prisma.file.create({
          data: {
            original_filename: `converted-${tool}.ext`,
            storage_key: dummyResultKey,
            file_type: "application/octet-stream",
            size_bytes: BigInt(1024),
            status: "ready",
            expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          }
        });

        await prisma.conversion.update({
          where: { id: conversionId },
          data: {
            status: "completed",
            result_file_id: resultFile.id,
            completed_at: new Date()
          }
        });

        console.log(`[Worker] Finished processing job ${job.id}`);
        return { success: true, resultFileId: resultFile.id };

      } catch (error: any) {
        console.error(`[Worker] Error in job ${job.id}:`, error);
        
        await prisma.conversion.update({
          where: { id: conversionId },
          data: {
            status: "failed",
            error_message: error.message || "Unknown error occurred"
          }
        });

        throw error;
      }
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
  });

  return worker;
}
