-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT DEFAULT 'PENDING',
    "jobId" TEXT,
    "network" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "contractABICode" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "functionValue" TEXT NOT NULL,
    "functionValueType" TEXT NOT NULL,
    "functionValueIndex" INTEGER DEFAULT 0,
    "operator" TEXT NOT NULL,
    "conditionValue" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "attempts" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
