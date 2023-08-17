// Imports
// ========================================================
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import nodemailer from "nodemailer";
import { Client, Receiver } from "@upstash/qstash";

// Config
// ========================================================
const prisma = new PrismaClient();
const mailer = nodemailer.createTransport({
  host: `${process.env.EMAIL_HOST}`,
  port: parseInt(`${process.env.EMAIL_PORT}`),
  secure: true,
  auth: {
    user: `${process.env.EMAIL_AUTH_USER}`,
    pass: `${process.env.EMAIL_AUTH_PASSWORD}`,
  },
});
const client = new Client({
  token: `${process.env.QSTASH_TOKEN}`,
});
const receiver = new Receiver({
  currentSigningKey: `${process.env.QSTASH_CURRENT_SIGNING_KEY}`,
  nextSigningKey: `${process.env.QSTASH_NEXT_SIGNING_KEY}`,
});

// Functions
// ========================================================
/**
 * Request
 * @param request
 * @returns
 */
// export const GET = async (
export const POST = async (
  request: NextRequest,
  { params }: { params: { jobId: string } }
) => {
  const { jobId } = params;
  // Debug
  console.log({ jobId });

  try {
    // Verify request signature to prevent random triggering requests and verify coming from qstash
    const isVerified = await receiver.verify({
      body: JSON.stringify(await request.json()),
      signature: request.headers.get("upstash-signature") as string,
      url: `${process.env.DOMAIN_URL}/api/cron/${jobId}`,
    });
    // Debug
    console.log({ isVerified });

    // Validate if job exits
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // If disabled or complete don't continute
    if (["DISABLED", "COMPLETE"].includes(job?.status as string)) {
      return NextResponse.json(
        {
          data: job,
        },
        {
          status: 200,
        }
      );
    }

    // Handle EVM chain
    const { network } = job;
    let evalResult = false;
    let status = "RUNNING";
    let readTxValue: any = null;
    if (["mumbai"].includes(network)) {
      // RPC Request
      const provider = new ethers.JsonRpcProvider(`${process.env.EVM_RPC_URL}`);
      const contract = new ethers.Contract(
        job.contractAddress,
        JSON.parse(job.contractABICode)?.abi,
        provider
      );
      readTxValue = await contract?.[`${job.functionName}`]();

      if (Array.isArray(readTxValue)) {
        // @TODO
      } else {
        let evalString = "";
        switch (job.functionValueType) {
          case "number":
            evalString = `${readTxValue} ${job.operator} ${job.conditionValue}`;
            break;
          case "string":
          default:
            evalString = `"${readTxValue}" ${job.operator} "${job.conditionValue}"`;
        }
        // Debug
        console.log({ evalString });
        evalResult = eval(evalString);
      }

      // Debug
      console.log({ evalResult });
      console.log({ readTxValue });
    }
    // @TODO arweave

    // Contact Notification if eval result successful
    if (evalResult) {
      // 1 - send email
      mailer.sendMail({
        from: `${process.env.EMAIL_FROM}`,
        to: `${job.email}`,
        subject: `Notification Triggered - ${job.id}`,
        text: `Notification triggered for ${job.id} with '${readTxValue} ${job.operator} ${job.conditionValue}'`,
      });
      // 2 - update status
      status = "COMPLETE";

      // 3 - Cleanup cronjob
      await client.schedules.delete({
        id: job.jobId as string,
      });
    }

    // Update attemps
    const totalAttempts = (job?.attempts ?? 0) + 1;

    // Attempts limit exceeded
    if (totalAttempts >= 10) {
      status = "DISABLED";

      // Remove cronjob
      await client.schedules.delete({
        id: job.jobId as string,
      });
    }

    // Update database
    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        attempts: totalAttempts,
        status,
      },
    });

    // Success
    return NextResponse.json(
      {
        data: job,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    // Debug purposes
    console.log({ error });

    // Failure
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }
};
