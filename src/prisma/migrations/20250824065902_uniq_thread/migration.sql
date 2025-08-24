/*
  Warnings:

  - A unique constraint covering the columns `[thread_id]` on the table `message_threads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `message_threads_thread_id_key` ON `message_threads`(`thread_id`);
