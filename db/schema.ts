/** @format */

import {
  boolean,
  integer,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `project1_${name}`);

export const User = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
});

export const Home = pgTable("homes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => User.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  guests: text("guests").notNull(),
  bedrooms: text("bedrooms").notNull(),
  bathrooms: text("bathrooms").notNull(),
  country: text("country").notNull(),
  photo: text("photo").notNull(),
  price: integer("price").notNull(),
  categoryName: text("categoryName").notNull(),

  addedCategory: boolean("addedCategory").notNull().default(false),
  addedDescription: boolean("addedDescription").notNull().default(false),
  addedLocation: boolean("addedLocation").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Favorite = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).references(() => User.id),
  homeId: uuid("home_id").references(() => Home.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Reservation = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  userId: varchar("user_id", { length: 255 }).references(() => User.id),
  homeId: uuid("home_id").references(() => Home.id),
});

export const schema = { User, Home, Favorite, Reservation };

// export const Reservation = pgTable("reservation", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   startDate: timestamp("start_date").notNull(),
//   endDate: timestamp("end_date").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   userId: uuid("user_id").references(() => User.id),
//   homeId: uuid("home_id").references(() => Home.id),
// });
