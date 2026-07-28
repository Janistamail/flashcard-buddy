-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "thai" TEXT NOT NULL,
    "englishMeaning" TEXT NOT NULL,
    "examples" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);
