-- CreateTable
CREATE TABLE "Marker" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Marker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Marker_userId_idx" ON "Marker"("userId");

-- CreateIndex
CREATE INDEX "Marker_createdAt_idx" ON "Marker"("createdAt");

-- AddForeignKey
ALTER TABLE "Marker" ADD CONSTRAINT "Marker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
