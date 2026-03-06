


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."need_status" AS ENUM (
    'active',
    'completed',
    'urgent'
);


ALTER TYPE "public"."need_status" OWNER TO "postgres";


CREATE TYPE "public"."transaction_status" AS ENUM (
    'PENDING_VALIDATION',
    'CONFIRMED',
    'DELIVERED',
    'REJECTED'
);


ALTER TYPE "public"."transaction_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (new.id, LOWER(COALESCE((new.raw_user_meta_data->>'role')::text, 'donor')), new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_need_funding"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF (NEW.status = 'CONFIRMED' AND (OLD.status IS NULL OR OLD.status != 'CONFIRMED')) THEN
    UPDATE public.needs
    SET 
      total_donated = total_donated + NEW.amount,
      donors_count = donors_count + 1,
      funding_percentage = LEAST(((total_donated + NEW.amount) / amount_required) * 100, 100)
    WHERE id = NEW.need_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_need_funding"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."donations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "donor_id" "uuid",
    "need_id" "uuid",
    "amount" numeric NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "hash" "text",
    "previous_hash" "text",
    "donor_bank_number" "text",
    "validator_bank_number" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."donations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."needs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" NOT NULL,
    "city" "text" NOT NULL,
    "district" "text",
    "validator_id" "uuid",
    "amount_required" numeric NOT NULL,
    "total_donated" numeric DEFAULT 0,
    "funding_percentage" numeric DEFAULT 0,
    "donors_count" integer DEFAULT 0,
    "beneficiaries" integer DEFAULT 0,
    "lat" numeric,
    "lng" numeric,
    "status" "public"."need_status" DEFAULT 'active'::"public"."need_status",
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "partner_id" "uuid"
);


ALTER TABLE "public"."needs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "role" "text",
    "full_name" "text",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['donor'::"text", 'validator'::"text", 'partner'::"text", 'admin'::"text", 'super_admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "need_id" "uuid",
    "donor_id" "uuid",
    "donor_name" "text",
    "donor_bank_number" "text",
    "validator_bank_number" "text",
    "amount" numeric NOT NULL,
    "status" "public"."transaction_status" DEFAULT 'PENDING_VALIDATION'::"public"."transaction_status",
    "hash" "text",
    "previous_hash" "text",
    "proof_image_url" "text",
    "timestamp" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."donations"
    ADD CONSTRAINT "donations_hash_key" UNIQUE ("hash");



ALTER TABLE ONLY "public"."donations"
    ADD CONSTRAINT "donations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."needs"
    ADD CONSTRAINT "needs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_hash_key" UNIQUE ("hash");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "on_transaction_confirmed" AFTER UPDATE OF "status" ON "public"."transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_need_funding"();



ALTER TABLE ONLY "public"."donations"
    ADD CONSTRAINT "donations_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."donations"
    ADD CONSTRAINT "donations_need_id_fkey" FOREIGN KEY ("need_id") REFERENCES "public"."needs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."needs"
    ADD CONSTRAINT "needs_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."needs"
    ADD CONSTRAINT "needs_validator_id_fkey" FOREIGN KEY ("validator_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_need_id_fkey" FOREIGN KEY ("need_id") REFERENCES "public"."needs"("id") ON DELETE CASCADE;



CREATE POLICY "Authenticated users can insert donations" ON "public"."donations" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));

CREATE POLICY "Authenticated users can insert transactions" ON "public"."transactions" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Donors can view own donations" ON "public"."donations" FOR SELECT USING (("auth"."uid"() = "donor_id"));



CREATE POLICY "Donors can view own transactions" ON "public"."transactions" FOR SELECT USING (("auth"."uid"() = "donor_id"));



CREATE POLICY "Public read access to confirmed transactions" ON "public"."transactions" FOR SELECT USING (("status" = ANY (ARRAY['CONFIRMED'::"public"."transaction_status", 'DELIVERED'::"public"."transaction_status"])));



CREATE POLICY "Public read access to needs" ON "public"."needs" FOR SELECT USING (true);



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Validators and Admins can update transactions" ON "public"."transactions" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['validator'::"text", 'admin'::"text", 'super_admin'::"text"]))))));



CREATE POLICY "Validators can manage needs" ON "public"."needs" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'validator'::"text")))));



CREATE POLICY "Validators can view all donations" ON "public"."donations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'validator'::"text")))));



ALTER TABLE "public"."donations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."needs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_need_funding"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_need_funding"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_need_funding"() TO "service_role";


















GRANT ALL ON TABLE "public"."donations" TO "anon";
GRANT ALL ON TABLE "public"."donations" TO "authenticated";
GRANT ALL ON TABLE "public"."donations" TO "service_role";



GRANT ALL ON TABLE "public"."needs" TO "anon";
GRANT ALL ON TABLE "public"."needs" TO "authenticated";
GRANT ALL ON TABLE "public"."needs" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

CREATE TABLE IF NOT EXISTS "public"."confirmations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "need_id" "uuid" NOT NULL,
    "validator_id" "uuid" NOT NULL,
    "message" "text",
    "proof_image" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "confirmations_pkey" PRIMARY KEY ("id")
);

ALTER TABLE ONLY "public"."confirmations"
    ADD CONSTRAINT "confirmations_need_id_fkey" FOREIGN KEY ("need_id") REFERENCES "public"."needs"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."confirmations"
    ADD CONSTRAINT "confirmations_validator_id_fkey" FOREIGN KEY ("validator_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE "public"."confirmations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to confirmations" ON "public"."confirmations" FOR SELECT USING (true);

CREATE POLICY "Validators can insert confirmations" ON "public"."confirmations" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'validator'::"text")))));

GRANT ALL ON TABLE "public"."confirmations" TO "anon";
GRANT ALL ON TABLE "public"."confirmations" TO "authenticated";
GRANT ALL ON TABLE "public"."confirmations" TO "service_role";

-- Storage for proof images
INSERT INTO storage.buckets (id, name, public) VALUES ('proof_images', 'proof_images', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Access proof_images" ON storage.objects FOR SELECT USING (bucket_id = 'proof_images');
CREATE POLICY "Authenticated users can upload proof_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proof_images' AND auth.role() = 'authenticated');


