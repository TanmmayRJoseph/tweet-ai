CREATE TABLE "tweets" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"mood" varchar(20) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;