// Imports
// ========================================================
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

// Config
// ========================================================
const prisma = new PrismaClient();

// Functions
// ========================================================
/**
 * List
 * @param request
 * @returns
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") as string;
  const limit = parseInt(searchParams.get("limit") as string, 0) || 10;
  const offset = parseInt(searchParams.get("offset") as string, 0) || 0;
  const order = ["id", "status", "jobId", "network", "contractAddress", "constractABICode", "functonName", "functionValue", "functionValueType", "functionValueIndex", "operator", "conditionValue", "email", "attempts", "createdAt"].includes(
    searchParams.get("order") as string
  )
    ? (searchParams.get("order") as string)
    : "id";
  const sort = ["asc", "desc"].includes(searchParams.get("sort") as string)
    ? (searchParams.get("sort") as string)
    : "asc";

  // Query
  let jobFindMany: Prisma.JobFindManyArgs = {};

  // Find
  if (search) {
    jobFindMany.where = {
      functionName: {
        contains: search,
      },
    }
  }

  // Limit
  jobFindMany.take = limit;

  // Offset
  jobFindMany.skip = offset;

  // Sort
  jobFindMany.orderBy = {
    [order]: sort,
  };

  // Return
  return NextResponse.json(
    {
      data: await prisma.job.findMany(jobFindMany),
    },
    {
      status: 200,
    }
  );
};

/**
 * Create
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  // Validate Content Type
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return NextResponse.json(
      {
        message: `Invalid 'Content-Type' header, expected 'application/json'.`,
      },
      {
        status: 400,
      }
    );
  }

  // Get Payload
  const payload = await request.json();

  // Validation
  // @TODO add zod validation

  // Query
  try {
    const jobCreate: Prisma.JobCreateArgs = {
      data: payload
    };

    // Success
    return NextResponse.json(
      {
        data: await prisma.job.create(jobCreate),
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    // Failure
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
};