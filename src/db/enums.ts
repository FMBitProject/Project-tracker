import { pgEnum } from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'review', 'done']);
