// animeUpdatesCron.js
import cron from "node-cron";
import { checkForNewEpisodesAndNotify } from "./checkForNewEpisodesAndNotify";

// Her gün gece yarısı çalışacak cron job
cron.schedule("0 0 * * *", checkForNewEpisodesAndNotify);
