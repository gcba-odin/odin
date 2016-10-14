--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: increment_rate_limits(uuid, text, text, timestamp with time zone, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION increment_rate_limits(a_id uuid, i text, p text, p_date timestamp with time zone, v integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
      BEGIN
        LOOP
          UPDATE ratelimiting_metrics SET value = value + v WHERE api_id = a_id AND identifier = i AND period = p AND period_date = p_date;
          IF found then
            RETURN;
          END IF;

          BEGIN
            INSERT INTO ratelimiting_metrics(api_id, period, period_date, identifier, value) VALUES(a_id, p, p_date, i, v);
            RETURN;
          EXCEPTION WHEN unique_violation THEN

          END;
        END LOOP;
      END;
      $$;



--
-- Name: increment_response_rate_limits(uuid, text, text, timestamp with time zone, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION increment_response_rate_limits(a_id uuid, i text, p text, p_date timestamp with time zone, v integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
      BEGIN
        LOOP
          UPDATE response_ratelimiting_metrics SET value = value + v WHERE api_id = a_id AND identifier = i AND period = p AND period_date = p_date;
          IF found then
            RETURN;
          END IF;

          BEGIN
            INSERT INTO response_ratelimiting_metrics(api_id, period, period_date, identifier, value) VALUES(a_id, p, p_date, i, v);
            RETURN;
          EXCEPTION WHEN unique_violation THEN

          END;
        END LOOP;
      END;
      $$;



--
-- Name: upsert_schema_migrations(text, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION upsert_schema_migrations(identifier text, migration_name character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
      DECLARE
      BEGIN
          UPDATE schema_migrations SET migrations = array_append(migrations, migration_name) WHERE id = identifier;
          IF NOT FOUND THEN
          INSERT INTO schema_migrations(id, migrations) VALUES(identifier, ARRAY[migration_name]);
          END IF;
      END;
      $$;



--
-- Name: upsert_ttl(text, uuid, text, text, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION upsert_ttl(v_primary_key_value text, v_primary_uuid_value uuid, v_primary_key_name text, v_table_name text, v_expire_at timestamp without time zone) RETURNS void
    LANGUAGE plpgsql
    AS $$
      BEGIN
        LOOP
          UPDATE ttls SET expire_at = v_expire_at WHERE primary_key_value = v_primary_key_value AND table_name = v_table_name;
          IF found then
            RETURN;
          END IF;
          BEGIN
            INSERT INTO ttls(primary_key_value, primary_uuid_value, primary_key_name, table_name, expire_at) VALUES(v_primary_key_value, v_primary_uuid_value, v_primary_key_name, v_table_name, v_expire_at);
            RETURN;
          EXCEPTION WHEN unique_violation THEN
            -- Do nothing, and loop to try the UPDATE again.
          END;
        END LOOP;
      END;
      $$;



SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: acls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE acls (
    id uuid NOT NULL,
    consumer_id uuid,
    "group" text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: apis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE apis (
    id uuid NOT NULL,
    name text,
    request_host text,
    request_path text,
    strip_request_path boolean NOT NULL,
    upstream_url text,
    preserve_host boolean NOT NULL,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: basicauth_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE basicauth_credentials (
    id uuid NOT NULL,
    consumer_id uuid,
    username text,
    password text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: consumers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE consumers (
    id uuid NOT NULL,
    custom_id text,
    username text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: hmacauth_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE hmacauth_credentials (
    id uuid NOT NULL,
    consumer_id uuid,
    username text,
    secret text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: jwt_secrets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE jwt_secrets (
    id uuid NOT NULL,
    consumer_id uuid,
    key text,
    secret text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone),
    algorithm text,
    rsa_public_key text
);



--
-- Name: keyauth_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE keyauth_credentials (
    id uuid NOT NULL,
    consumer_id uuid,
    key text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE nodes (
    name text NOT NULL,
    cluster_listening_address text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: oauth2_authorization_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE oauth2_authorization_codes (
    id uuid NOT NULL,
    code text,
    authenticated_userid text,
    scope text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: oauth2_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE oauth2_credentials (
    id uuid NOT NULL,
    name text,
    consumer_id uuid,
    client_id text,
    client_secret text,
    redirect_uri text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: oauth2_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE oauth2_tokens (
    id uuid NOT NULL,
    credential_id uuid,
    access_token text,
    token_type text,
    refresh_token text,
    expires_in integer,
    authenticated_userid text,
    scope text,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: plugins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE plugins (
    id uuid NOT NULL,
    name text NOT NULL,
    api_id uuid,
    consumer_id uuid,
    config json NOT NULL,
    enabled boolean NOT NULL,
    created_at timestamp(6) without time zone DEFAULT timezone('utc'::text, ('now'::text)::timestamp(0) with time zone)
);



--
-- Name: ratelimiting_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ratelimiting_metrics (
    api_id uuid NOT NULL,
    identifier text NOT NULL,
    period text NOT NULL,
    period_date timestamp(6) without time zone NOT NULL,
    value integer
);



--
-- Name: response_ratelimiting_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE response_ratelimiting_metrics (
    api_id uuid NOT NULL,
    identifier text NOT NULL,
    period text NOT NULL,
    period_date timestamp(6) without time zone NOT NULL,
    value integer
);



--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE schema_migrations (
    id text NOT NULL,
    migrations character varying(100)[]
);



--
-- Name: ttls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ttls (
    primary_key_value text NOT NULL,
    primary_uuid_value uuid,
    table_name text NOT NULL,
    primary_key_name text NOT NULL,
    expire_at timestamp(6) without time zone NOT NULL
);



--
-- Data for Name: acls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY acls (id, consumer_id, "group", created_at) FROM stdin;
bdd4095d-3b7e-4331-94d9-c4f791787316	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	external_users	2016-07-20 18:44:16
\.


--
-- Data for Name: apis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY apis (id, name, request_host, request_path, strip_request_path, upstream_url, preserve_host, created_at) FROM stdin;
6b6e07fb-7040-417f-90e1-353cf3a70d1d	ODIN		/api	t	http://localhost:3000	t	2016-07-20 18:28:41
\.


--
-- Data for Name: basicauth_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY basicauth_credentials (id, consumer_id, username, password, created_at) FROM stdin;
\.


--
-- Data for Name: consumers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY consumers (id, custom_id, username, created_at) FROM stdin;
7fb5addf-5263-4a28-91dd-8f9bbc44ab16	external_users	frontend	2016-07-20 18:35:50
\.


--
-- Data for Name: hmacauth_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY hmacauth_credentials (id, consumer_id, username, secret, created_at) FROM stdin;
\.


--
-- Data for Name: jwt_secrets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY jwt_secrets (id, consumer_id, key, secret, created_at, algorithm, rsa_public_key) FROM stdin;
633cc788-2568-4254-84d8-2871cad8efff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	99afc57fdbc04c6cb2dd4ba5690e4346	dcc01414b70e4f45aa2371b9b82ef95e	2016-07-20 18:43:55	HS256	\N
9053c8be-2443-41a8-afc1-aad799f2a459	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a83719be767a4c31b42668ae2409ed24	bd347c57f8ef4db889e8758227e117b1	2016-08-11 13:24:39	HS256	\N
520a3fd6-d478-4f08-b4bb-10e34e93b100	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	18d9f2e615da4e47a1ec5ff5d2ed8cd2	c12ea54a5d334e9ea79c819d943a690c	2016-08-11 13:45:16	HS256	\N
cde67660-7706-46f7-b08b-13772642bf7b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f96fedc6b1794debbaa90a64e273fcc7	c777ceafa9c2464b83b0a9f91c87aab9	2016-08-11 14:12:11	HS256	\N
29418c68-2639-47c1-a2fa-5e38fa25629b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b51354d5ff9d4fb5a9ce7aee302ea223	fc22cd42faa04363ba5fe01fc411cfeb	2016-08-11 14:12:29	HS256	\N
517ff1a4-c42f-4ea2-9790-12a95cf61564	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3d157006810d4a83a6c012b29af24b44	7b3b91e59bcd4d5484cf46880eca5b29	2016-08-11 14:19:15	HS256	\N
9c252601-d824-450f-9001-19c3846d9b41	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9fef51cb101a453e9cdcdaba5c5d1622	26758dfa18d941209a961abc7b21061f	2016-08-11 14:26:42	HS256	\N
a8b90b08-081b-49a1-8ad2-b008b183aadf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d9b8d15dcded433188e9eea1a1bb6d55	a6ccdf1774a54115a1e4eb32a8929586	2016-08-11 14:35:26	HS256	\N
7b6bf921-3f3a-4119-bffe-f614153f0f6e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	354fdb6d5007468182643cd22653eccb	6738fd8e4ad0452f9e2c70b63a84fb9d	2016-08-11 14:38:25	HS256	\N
e4a8519a-7869-44c3-b817-39db61f6d166	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e3ec607d5bba43e69601d06b26288f00	dfed4bd31fef41789602caab9cf9a903	2016-08-11 14:49:54	HS256	\N
cdeab10b-d82a-4e90-b6c7-6f1bb57a411e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ef3976415cc04c19a59e55f36e66ac5e	bddde63842ff4b2a812809afc733d878	2016-08-11 15:00:22	HS256	\N
69d02958-6346-4f7a-8883-8056ec8d56f0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eba805b82eed4dcca9c815d68411da76	6b806635f0c640c8aabb7688e2bdfcd3	2016-08-11 15:01:36	HS256	\N
2dc97aa8-84eb-4db4-b2f9-03b434394ae4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f02db5df1984451c90c17d541310c508	ce89d6c9199a474d9adbb55974197517	2016-08-11 15:16:56	HS256	\N
ee885277-14e9-430a-8e37-8a58adde461a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b8837ffa29874fa7b9967a4d8ac2d50a	685af0c2324343b185524efd38ea57f5	2016-08-11 15:25:48	HS256	\N
33829a29-d839-4958-81d3-45bba22be652	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	735d0a3f43094bb0824f980f816e2900	6a957ecb48f84ddf929ad96fbf125cb3	2016-08-11 15:27:27	HS256	\N
a8412a7e-9b77-4b32-9d5e-391bf7f31797	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2577a62e7d8f4b7e8cb1a1b6d0eb1b7d	52623e4e750e4e89bf4d8ca72ceaecb5	2016-08-11 15:28:34	HS256	\N
673e3370-addf-4da5-bb2a-5c48273ecb6a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c4c3d8caaa694eac88704158aa561828	63024482a03c4558845bc0600cee453e	2016-08-11 15:52:35	HS256	\N
f6b89087-8e0f-421e-9d84-8464b7cbd0b1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0f93796f9c874dcda2e126d7b240dbee	092f0fdc7c50457c8d52d5b8f2c2f81d	2016-08-11 15:58:23	HS256	\N
70256ccd-6592-47c0-9e38-0de980ec3c8a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3344dbe7bcbb4544b8784ac9dd9f15db	8b2866d6711d44409b3e0a9a265d4316	2016-08-11 15:58:38	HS256	\N
edf0b135-f53a-481e-97f5-80f3da8eac17	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4213eb23c25143c9bafc71eab52c6a76	30496ebee60346458211dd0c4f617fa6	2016-08-11 15:58:40	HS256	\N
2d74d847-2f1d-440f-a2bf-6397e3c56d15	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	82c8aedf3a9d4755a2fa4096e4f34af5	8e8ad0e5b4e348358d459d82d7996c5c	2016-08-11 16:05:23	HS256	\N
96b4e9a8-41d9-41d2-ab11-d2615c969d7a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d0cc4d408e3041e8bceb2bbd2d57e69b	b18013e79ce948618c3e8865ea636b7c	2016-08-11 16:07:53	HS256	\N
1930edca-4039-4104-8f96-57a4efcce401	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a7b5f0b969c64987b81a80d03f8047f1	0c96c19899674863aca8eb29c6c7e0be	2016-08-11 16:08:14	HS256	\N
4dc79b13-2c70-48d7-9f43-67ea8e8f1585	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c5f59adf13d44bd9ae42749dffc78514	4a8163c2d08345c0a2b0f18aadf66799	2016-08-11 16:09:23	HS256	\N
3526f0e6-4b4f-4b28-9f87-d2e658d5b057	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2585f47f01674441883bb0370f58d078	199872ed8731419787ac695ceac1645f	2016-08-12 17:29:42	HS256	\N
4eff1ccb-77c5-4b06-90d5-9a6a8b383313	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3e6c92e4b08c4df48438b59ea1ffac14	5c915329acd3439b87b51c1b6ccd9d13	2016-08-12 17:29:53	HS256	\N
4337d273-1e89-4b15-b7ff-d1275566a928	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3e1cf366804640f09369593b1e4e6145	df59ad7409df45a3878675e5ed814b30	2016-08-12 17:34:48	HS256	\N
b8325619-109c-4a13-8889-557bd8ce4767	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20b20a39ae78447da2e4a76e2780a977	8749ab99969b4bc5895a1f68651b08c8	2016-08-12 18:08:12	HS256	\N
391d68dc-8c18-4a5b-9128-8b5c6e00d5a1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	de684fdf19594b368c8307ac550175a6	19c0e4ba37e4439a9dfa7317b9f9353d	2016-08-12 18:22:37	HS256	\N
5e4d3d82-1330-432b-9a0b-aad5cace01e7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3b3310ecdd4546d2a0f242381c408e25	19fb0195a3284d5db8c99e40a1a66078	2016-08-12 18:23:35	HS256	\N
9285c400-c10b-416a-851c-8369961f1169	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2bc08e39b5f74eb5b61e6b941177b9a4	0a47e3ca56594a0c9691b68e7f8af50a	2016-08-12 19:00:28	HS256	\N
408f590c-cb1e-4a18-b600-6267e9dfa64e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8515d9963a1c445c8a36b223cc622a78	fbd8c019cd614c219e6d086dd55ce3a7	2016-08-12 19:02:33	HS256	\N
b236e9fd-fd8b-43fe-af2f-e5c676ab0ec9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5cf61398a2fe4e24a51518070e9d5218	beba61ea3e4546f489e33fb7c527a5bc	2016-08-12 19:04:21	HS256	\N
cac8f48e-9516-4f51-a004-dde0beed7930	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5329276518c7424286f34d13013c7550	773cd27f58624df4a448112b7e4f6ebf	2016-08-12 19:04:28	HS256	\N
264ae6a0-e5b3-484d-ac4e-97ccb628dca0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a6e67fada8b14064b369a737948b6d39	190c71a59f5a4a749e9d811f57160eda	2016-08-12 19:05:58	HS256	\N
28a90df9-4f5d-4fa3-8c06-91d32d6e1dce	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9e522194c70d4439ae2f51c9e444bddc	41e921c83efd4b93af41d8c51b1de2d8	2016-08-12 19:15:44	HS256	\N
1f8b7bac-116c-4f7f-a9ea-6968bccf3e14	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cd87280084b84897a83f86ea6c5aa078	c23d9124649e4d96af96e134f46ae9e5	2016-08-12 19:16:16	HS256	\N
4d863fd3-77f1-45a7-be97-e3e03a4be126	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8c2da89d91ed4f6eb4b0b5c4847c4551	cd9d8d04317047609f099b7b85a2d2dd	2016-08-12 19:16:17	HS256	\N
df7d997d-9428-4ac8-b0f1-1ded1bdb7133	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8620f5be5a474061b04cdc5ab8e76cb7	62789acfc43b41bf9765bfb259b2fcee	2016-08-12 19:16:48	HS256	\N
67cd369d-19f5-4189-801d-8248f4517253	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6a454b338d094f2aad8201d59418d558	a4d7f5b8e1544637840cee9e48472290	2016-08-12 19:22:43	HS256	\N
a6f11946-1b9d-4154-bcf5-812b58a32f09	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0f3419fb21f248baa80afbb3fdb81117	1262b85c83e14898bbdbf4b1b8b2e447	2016-08-12 19:34:54	HS256	\N
e527c4df-880e-4c8c-b423-0efc36e2792b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	27a30097b87246249735557636245702	c265d669b98d4d708b4ae58720694089	2016-08-12 19:34:57	HS256	\N
e6461905-f2ce-4c35-b0b6-33f0fb87fb37	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2c814542171a4223823014a6cc313f5d	f018553aae47484eb6b687b1ec759f82	2016-08-12 19:34:58	HS256	\N
4cf56a12-5bbe-49ff-bfa4-ad69d77cfd6a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b4f7a1a66f7043ac85377397fe727765	6883eb08de464e3f9af570cd54744e37	2016-08-12 19:34:58	HS256	\N
cc755bc6-2d84-4951-8f65-fd0ae59ace84	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fe660ed35f29448282c26908b4e070ed	7146c17779d04a7184dc08596a75aef0	2016-08-12 19:34:59	HS256	\N
984eef78-4ab4-4b64-96bc-3ac7b456a27f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	62577df91b8e4fa19fce0ab6bb0bb9e9	c5eb37157a6f471aa0e3466ac3b46d88	2016-08-12 19:35:00	HS256	\N
a2530ebd-1e42-4335-b8d7-7976baabe47c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4b011eee077345c1abeff65c38117cf5	f7da1e192a0e4df78fd39b2b9d7622f7	2016-08-12 19:57:15	HS256	\N
ca2bc50b-fc98-458d-94ea-589c0a55176c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a9bc354583d04d9ab2ef98843f98d80d	7cb7d436f9cc4a29a9074f9b8c1a40a5	2016-08-12 19:57:18	HS256	\N
37d619bc-3b18-4a47-aeb5-898688b1307c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eb039854c9df43698ea0155a520cd563	3bb63c58f0434746ab61c93b823cab37	2016-08-12 20:03:10	HS256	\N
a074aed7-fb77-4024-9037-49df7132ff10	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e4055416bd194af898a531ec84952ebd	b68ef4fa5d0a43f89e783a425ae3e313	2016-08-12 20:03:51	HS256	\N
5d962735-7d5e-4c50-a736-1c5f3e73bded	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d98ff6fbb24e47f7ba50efee1017a511	28251d141ea14954864b9cb7f649c235	2016-08-12 20:05:06	HS256	\N
b2746b01-9b95-491e-94fd-58bd01cbfeb3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	159f87f98d734ed497e48f9089286a04	c7204e3b58f14dc280384c96cbf4689b	2016-08-12 20:05:13	HS256	\N
ee8c3230-46a8-45a5-b4a4-8b9621084186	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	60387621957e445aa4afa053b610be54	17ef32cef88e48aa895d6e5c36b63f43	2016-08-12 20:07:25	HS256	\N
ad109d4b-e10c-4b38-82cb-732c617d652b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1528575dbf4049b7aa50f4b364a6c9ea	f50de12191504f07833d52366be99cac	2016-08-12 20:18:11	HS256	\N
7471cec0-ab48-405a-8f43-54af80b89949	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	298dc96643984f7a97d859bb79abb98d	cfcee8ce366b4dc4b7eafff2415f1dfa	2016-08-12 20:30:21	HS256	\N
84f6e481-6d7c-4280-a50f-0c78f443d3b0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3a64044e813145d6ae7e097eab9d850d	9b4158f344074fd8b15d0dfad927008b	2016-08-12 20:32:57	HS256	\N
75d429ee-7c44-4f7d-a3af-8ca6a4f382a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7a9c74a365694fe887987bb992d3c9fb	ab0fe21b4bbb4f9cb60bb672856596a8	2016-08-12 20:33:20	HS256	\N
5d752179-42ac-4766-a499-2b441490eeed	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20d9f10097e14f069011006edc90b822	b4a083b2546a4d04969ce043c5392b78	2016-08-12 20:34:58	HS256	\N
262b245e-6af3-4478-b7df-e717eefb00f2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a2c361200b88413ea52ded77159bd703	e369f450916b4cc6aa7fadafbef45b94	2016-08-12 21:08:00	HS256	\N
3b9ae455-5f14-470f-9426-a95e0a6ef765	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7157ce3f5a5e43fdb9ce8ce7f7c85a84	3ae1058e588b44a1a90a9973698739c4	2016-08-13 16:13:15	HS256	\N
cd8b88b6-4bc9-4d60-b53a-1f8ce3186791	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ed23be63b2f4446f8805ec3c11f2fb69	ad8c155d49f344d5a5de49a82708902b	2016-08-13 20:51:10	HS256	\N
87d21904-b818-43d8-8190-7c2e3f4bec62	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	887278154e5e42f1abe2fdd94d5e5a6f	7fa671323ab44066a9013cb2ad1112f8	2016-08-15 22:51:35	HS256	\N
7836588f-987d-422e-a582-26b693c9eeb0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f55bc0ded48e4fcb8f508c43bc14dde2	375319be48434dad9f1dbed47c1e2816	2016-08-16 12:08:35	HS256	\N
63e332f1-c96c-472b-a5f5-c5628ef5268f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	95b159793e1f435eb172bf36eb599360	c0ec709b0c6e420ba3696ea0a2063367	2016-08-16 12:30:43	HS256	\N
f72686cb-338e-46f7-bc3f-a072114683ba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e2d72442755c480793932c98ce1ab861	08e19307a35d440286d23ac10188b0b6	2016-08-16 13:08:43	HS256	\N
191394e7-ed20-490b-90fa-5a43ad68a693	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	93edb14375c540a1be4fffe729d0f634	d9f642ca907a4cb8b7c6faa70d4f2aec	2016-08-16 13:09:01	HS256	\N
28c61f47-3449-4d04-96ac-3d4efdd590ea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a1445c5fc9134fab8fb33523d8e9120f	420f148831c74cf3a75b50624e151029	2016-08-16 13:09:41	HS256	\N
9f9b0152-7fda-4a9b-856f-fe0b0611ba01	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e621623a061a474ca5ee89938d6f637b	4bf770f11d3f49b5b2af12f12fbe066d	2016-08-16 13:13:09	HS256	\N
b0b56638-16d0-4402-884a-adb25cc935b8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	303c008649c3433ba5445a720d8ec498	25d239fc7bce42a8ae7f996ab4a28aeb	2016-08-16 13:14:04	HS256	\N
9b6e2bab-235d-414c-ae1f-200ab3a0f560	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c57e368625b34bf7bca6379a0ea657b4	2756d61b3aad497a94fd7447b01ca5ba	2016-08-16 13:14:59	HS256	\N
9d883593-2616-4eda-8128-313ce379f9fe	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b22ea689071f43aab86edef749a6c8b6	0a938a9ed56046689ed12dcfff06d61b	2016-08-16 13:28:46	HS256	\N
488fd72a-14a4-4f6a-bb0e-07e0a3d25b32	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce63912616124417bc7a4728cdf22986	2dfce3f2acd74af09a076b85e526cc51	2016-08-16 13:28:46	HS256	\N
30d124df-f7c7-439a-9005-0ff761afdeba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dd147fc3d27348228fd5ba96463f2f68	1777fd50dd6f43fe812458237c34cce7	2016-08-16 13:29:14	HS256	\N
206d1984-9322-4597-9a5a-83135f69088a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b1e1c6973e9b49f2856e7895498a5a68	cfe643343b77463a90b13e1bc6feb09d	2016-08-16 13:39:44	HS256	\N
a0ee1600-c2b7-4a94-bc22-bedead686917	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c9f3bc47ecf64f3a999d57d46499ac92	27d2e654be6f48b9be9e478b171cd79a	2016-08-16 13:42:08	HS256	\N
75d91c0e-16de-4f7e-9a45-2a0c50ce0388	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	62250d2bba2a481eafa3293e15256381	f89ac3d15a2143cc80066d7d5898327e	2016-08-16 13:42:12	HS256	\N
438d3c03-5a19-470f-aee3-34d8ba424fa9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	43701fa6739d4b689c06a65152ad8f69	c01861e8c3a846cba04de48c421dede0	2016-08-16 13:45:20	HS256	\N
c2b705ae-62fa-46af-971d-9eb04c8fb93a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a08c6d25357145caba1004dbda665ea9	afc12d90049f4a089e18708c2d9b4b9a	2016-08-16 13:49:04	HS256	\N
078977a6-907e-424a-a41b-3b26c75582eb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0a3da0d8c55740b4b522ac0b17111ce6	61d6cd4921614c49bbefd417387d4450	2016-08-16 13:59:44	HS256	\N
528f0fee-58f0-4c63-8ec2-5f165badafc9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e2004c6d71fe4eb9b4c2c03b21ccce1e	8fdd541a472944cca3223598785bd76e	2016-08-16 14:10:25	HS256	\N
d5fe9840-9943-40dd-9850-b8a2bdafe303	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	552b0199bee248cba3834476e9836e94	935154fe4a8a4bb4a525989d0717cc6c	2016-08-16 14:19:21	HS256	\N
4722641b-dcf9-456b-964f-791ecbfca3fe	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	180e5e5c903a428fbf21b6303da46c72	e58e5f6cbd394e5e9a000504378bbd26	2016-08-16 14:19:21	HS256	\N
9f4fa4ea-f0a4-45eb-ab1a-3a97377435c0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	166bf1f3347c4fc0af584e48cf72424b	81c9e2a196034b979474f3bd5b555574	2016-08-16 14:19:58	HS256	\N
71df5fec-5a7b-49d4-8e92-0b098521e4a8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f4f4fbc52cf34e8b9252d15d86c18650	44634f3d33ba4f80aaba90ab7f544ad1	2016-08-16 14:20:30	HS256	\N
88d40edb-90dd-404f-8969-158fad3518cd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5d8cbbf7494f49c8a30c8a060f7f2f1b	d732d5e9aff54a7aa04b4cc4e074290e	2016-08-16 14:21:02	HS256	\N
3a2b8493-2479-42e0-b5c9-f5de7ca91c0a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b0b79018a29e4fa2a6e80cea45be33a5	92b42b98b1fa43c9909d863f1e621edc	2016-08-16 14:21:02	HS256	\N
b408357e-96b0-4372-878d-a83b52b45352	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	218d0fc26bd94803820fdd26a052b1a6	7076e535fd8c4985bfb3065b866fef16	2016-08-16 14:21:55	HS256	\N
198d22d6-cc82-461a-a9a5-f6b7df6ae831	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a914b8a92c33499a98e58ca129e3315d	755c73a6613a4dc784bd28e545417233	2016-08-16 14:22:46	HS256	\N
9132f107-f944-43db-bc57-6cd9aba38422	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dd532c7a2c994632876ac8101f0da302	9e48e29641c2414fba2efd4c03266596	2016-08-16 14:22:46	HS256	\N
4bbd437e-5649-4bb9-abe1-9caaa791032d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5ef72702cdae4ce287cbf57472b984bd	b277ccdbe1f344378f3879b7f7ce5222	2016-08-16 14:24:28	HS256	\N
28926740-27f3-4526-8965-76dbe0f88561	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	57a8489427094ed68716b4bcea323865	61b3e1a61ffb49f7823f067ee0dd2d3c	2016-08-16 14:24:28	HS256	\N
5b788b07-b10b-4ebe-8e8f-5faa5713cd0d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ed323648201741dab1d6bd9f4a7f428c	bbad03fd04a745e9bc1d15399fc75945	2016-08-16 14:34:19	HS256	\N
cde6a495-e5a2-4df6-9b4e-806afa7801f5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	af9f5eba4e7d4974b8e027d132e81ec1	75e872f9ed3d490d8047228bda79eb91	2016-08-16 14:35:55	HS256	\N
f36287df-85ac-4467-90de-e5bfa825e5a3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	edbea160fd444b1a8b121f6587b5fe23	b95dda1c40b34cfa8866413ed1ad3739	2016-08-16 14:36:13	HS256	\N
1ac8cd0d-20ef-4271-bd63-f8f7dad8d822	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	54cad19acc3545dc8fe111677f0691f3	4604f5afafa8440b9ba43352d222681b	2016-08-16 14:41:27	HS256	\N
f2f70023-c003-4b70-b1fd-e9ddd8925a84	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d0e555949ef649a69cacc52f968be02a	850d8143595d4b7c98a830df52e4f49b	2016-08-16 14:44:29	HS256	\N
d1801906-8b28-4165-bc07-e916c1d7a0ee	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4fe3c055903f4aa18ad92580da659809	f0efab094d4d412181c967e11e97eafd	2016-08-16 14:46:45	HS256	\N
c08cfcc4-d4e4-4957-86e7-1acc651ce6bb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	91d533374f6f44e6aa3f712bfd261957	0cd13c5d36ee4213b016c5b23ef643a0	2016-08-16 14:50:21	HS256	\N
0daa2e65-0541-4b62-be4c-48583721ab81	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ebdf30cfedfb4c8b8184d4cf20b1f602	4112afcb9fad442ab39f2361e8840a4e	2016-08-16 14:50:29	HS256	\N
40341e2a-dcb2-493e-8994-8ed6d50b2feb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e4337bb6e065488792bb393903b9cded	c67080f84a5043fba923dc24cabec609	2016-08-16 14:50:29	HS256	\N
f7f10925-14a6-4bec-adf5-0bdecd5ce5a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	146c72629cf541ebb0179d2877173c41	e361ca581b124bf48b515a85280c9696	2016-08-16 14:50:36	HS256	\N
59d5f39b-d69c-464f-a07e-2fdc61014ec4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ffc36d4c15034c9094abf2937f263b44	426858b7b8c849b98542d2f95cd185aa	2016-08-16 14:50:45	HS256	\N
c2c6b71a-dbcd-4127-8136-8073353fff95	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ad8636422cf9494aae60adb0284756c2	1a7c1add40da400cbb25862622ed7855	2016-08-16 14:50:53	HS256	\N
ada4eb54-a631-4c50-9e36-590058146cbe	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	40353b6a70004fd6bea30466caa45de8	ff4b0630cc924c979838456eb291fb04	2016-08-16 14:50:58	HS256	\N
33849507-67de-4ebe-88dd-8879f28d0d54	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1e1d7aaf07f4425ab834399292aa74eb	a6d0e8fb21f7465895db5b3e9d2bd14f	2016-08-16 14:53:10	HS256	\N
438ff76c-844c-4c48-a2ec-9b3f6b1a57cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9ae7ad02a55f4b038cb9bba3b345936c	4ae85a00756540ca8756ef874dae6327	2016-08-16 14:57:29	HS256	\N
10146bac-e1ed-4c5b-80aa-b58705c49ca4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	00ced79bfc0444a69e892f80244eeb48	677a6576011d4fe6889630d2ae459205	2016-08-16 14:57:47	HS256	\N
0617d719-0833-4993-b8ab-a064ab99bb57	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f21f7846e31742958541a647bd79c3fb	c3763f0c83b24ab0af3cfcbc78aaf402	2016-08-16 14:57:47	HS256	\N
42f9cc21-4081-493b-8781-387692a12735	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f995985a6c6e4e5f935a22f4282e6b50	7d5cd8f10c0046c683b7870b0970cfab	2016-08-16 15:32:16	HS256	\N
ee939403-7c45-4004-90d9-cd503a220381	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e797cd607b1647d799c9d20f000fea59	ca6f0e54e0684cd289c4debd5b2fca94	2016-08-16 15:32:31	HS256	\N
9bb267a4-07e9-4e18-bfa5-3fe92a8f4195	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	11757770e73c4615b0d0935ed8af13db	dd853d75f396440c95bb840746914a9c	2016-08-16 15:35:28	HS256	\N
89880c34-1588-4b79-8bfe-674a4a8c62fa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5e6d7f5bca0a460caae99c2708549acd	9779b4460ede46e088134d185020c026	2016-08-16 15:36:50	HS256	\N
31baa5f7-bc69-4105-825d-4a6ba76625b3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b412b426476e4dbcab50b1a151dc9297	821e747655484f39b1dab7e31726afcc	2016-08-16 15:39:34	HS256	\N
89984af9-2574-4c61-9223-cec05597821e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d96cb1f092ce40f586025321a3082c9a	e56f15e886164899a1f154924d85ef80	2016-08-16 15:39:40	HS256	\N
0751c0d0-dc54-4fde-85f5-c3699a9aa882	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	35654d2358b84cdd944fef18f385a792	610446922b77493d8e01794140288407	2016-08-16 15:40:08	HS256	\N
452aef10-8987-4776-b933-50001ae7d762	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	73719cc5a3d94c82a05c4921e1c52f73	a37208b5504544319b0ed2ca8e7bc95d	2016-08-16 15:50:59	HS256	\N
2043c8f2-aec4-4e31-ac1d-4f7426841ad6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4df96a3a027b4c1eadcd9d438b07376e	601fb87ea9184cf189a30c0894d6c8b1	2016-08-16 15:50:59	HS256	\N
656e7d3e-ee66-4993-822f-27c23d54e6b1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a82d3a8913ed4cac976c3540aee07706	40dbfe366e064021bc9f4dfc2c07aa6b	2016-08-16 16:17:49	HS256	\N
d04895ac-98be-47a6-9d16-ef2a3ff5b800	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4f49d326a8e74f9cb19e26f08f297b05	1cdd55e761f7455185a0505ee0679a99	2016-08-16 16:39:18	HS256	\N
4e310fe5-7a87-4f38-8641-7ea6946101da	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3ceabac148514739a2c9ee931d28d018	7a6a727624e94fdfa1d77f971000c0b4	2016-08-16 16:41:46	HS256	\N
41fd3b64-24b5-48a0-9403-56728ac067e5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a269135d6bc34c1089ff583e96ca0345	50315578c66a4f2aad02ef3fca2762dd	2016-08-16 16:42:07	HS256	\N
e7d618d6-3d84-4715-9757-57e873c16001	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2658cba4cbc342b6ae2fb4302a141581	86c78cbbdf85422baeac74014a476b0e	2016-08-16 16:42:07	HS256	\N
1aff1feb-dc09-463f-acfd-19dce2d0fba3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5c72a2d25edf45b4bbe019da8ea456d0	591812dbe9274ffa803da5f992c4a398	2016-08-16 16:44:11	HS256	\N
dac8c9bb-a69b-4ce1-9483-2cc4d742518f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	da3ba4f4a990470ea362ef16008846aa	630a8133a9874cc0949550ef02028078	2016-08-16 16:50:47	HS256	\N
79d66abd-3e98-404d-aaeb-b25b50d5fd94	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	60d31669602d466eb798cf16dcb19117	234332aa4a244c8fb9238c63d8f7000c	2016-08-16 16:51:57	HS256	\N
74ac437e-65b6-4225-9739-f1f331aad753	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dd24db1a8da543d7a7bb4472a7ec95d5	ece5e2b9a773484381842d21154dee77	2016-08-16 16:55:18	HS256	\N
d06df1f4-f82c-4bc0-9a02-bf31b4d7c996	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	88b4d895caf6452c9defb284f8f4f78c	039f4ee123c943cfb6b54e77d11048f3	2016-08-16 16:56:34	HS256	\N
b566b8aa-031c-452d-8c2f-d39c328f7158	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9ad50e098bb04fb39e44c4a790daa711	228c4aa9510a457e86541271f4cb9c4e	2016-08-16 16:59:39	HS256	\N
a0d8f4f0-a58c-416d-9bf8-854b263925c4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fc6bce06f02940ddbc8647fe25895f3a	c3c89935b36d444ebd14d7dfecf96ec7	2016-08-16 17:02:31	HS256	\N
6b1ac776-e646-49ca-b217-4b62df760866	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2f8def9f747743fa90dbcca5e4711f1d	e1aa4f2bf23648aab920532be5e315cf	2016-08-16 17:08:38	HS256	\N
679362c2-8255-407f-9639-76d60885a207	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d55be3a8793c406c9d4c59ac7b289ad2	c42c0aded4df419bb8ea7b70a72df917	2016-08-16 17:13:04	HS256	\N
b47bc1ef-d704-402b-b857-9547cd49d9ab	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4a7f9fb6cc174cc982ac98acf2a2b9b7	7edb43c72834491c88bac33485de42a7	2016-08-16 17:13:41	HS256	\N
498991b7-7f67-44d7-9922-693bb2e8bd11	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	09c0b30b0559483f82565c191c416953	e75210f255fd4fc7a557b8384cfc169c	2016-08-16 17:14:38	HS256	\N
1379593d-fd3a-4ee2-b823-aba4ca3a0a28	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4c25815637f44baeb2e26bf55dd5d203	346953719ca541ad940bee93d8ce5edb	2016-08-16 17:16:29	HS256	\N
9b09bc2d-99c8-469e-ae34-43767cdac2cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9e77bdbb3f514595b12cbf54c2b91ea3	7235dd4b025141a2a343caf34de2186b	2016-08-16 17:21:33	HS256	\N
03724e28-5c47-43a6-964a-05ec6b730001	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f203375a381c480090716add5202f2f4	3bdf029e7c514d31bac55dcc794f9c01	2016-08-16 17:39:17	HS256	\N
d531166b-3b25-4128-befd-261dc1eacafb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0a29797a86854478b8018999def2ed31	45d7e2eab30645dc93e00a75fbe97b14	2016-08-16 17:39:17	HS256	\N
34c2edeb-ca26-4713-9566-f0be4d9942d4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7268e2b8dbd642b99c43e8036a3fa658	3596a92d495546d3b29ddff95e52b297	2016-08-16 17:41:06	HS256	\N
c5bcb92b-ae93-41fb-990f-e24f32c8170b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	855ff5e2056d4dd18f46c0898064b601	80a499d96f2f4aeea846ba61e79da96f	2016-08-16 17:41:36	HS256	\N
0ddd58dc-4f83-4da8-ac68-b44192f3c5a7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bfe885fa12e8453d9b1c6ca5ff97ea16	cd9b470206134d45b1d355c14acd73a0	2016-08-16 17:46:48	HS256	\N
56969ab9-d171-4e65-a152-9dce10b549bf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	959d556c2b6d4384a09c2a540d877393	a5d21ba5db2240f8ab27f2237fe3a3e8	2016-08-16 18:01:21	HS256	\N
d56053e7-5b2e-4dcd-b0d5-6df99ff92218	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9d3d1bad184a4cd78e031868117f81db	6ad844d8771b446ebb8ca6e9f9475b8c	2016-08-16 18:02:12	HS256	\N
c7c9b23e-cc07-42fa-bb35-0f6b67e5ca18	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9444cb3cfcd945f7a10b8dd5ac40308d	14aaadaefa414d16817c795c35ab211c	2016-08-16 18:27:49	HS256	\N
44d75589-3635-4356-905a-a8fac659f60a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e099781402204372aaad672ddedffbde	f4c85f40cb4f4bccba216602051e7828	2016-08-16 19:14:52	HS256	\N
01dbbbd8-f8be-49ba-93f4-6fdd4b267e4d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4f6f531b1d0e44e0b8e91b27223406ae	c7e0b6931a5746ba90f3069a3edadc1f	2016-08-16 19:15:00	HS256	\N
13bea09b-53a4-4a34-9eb0-5e5a2484dfe5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	04794b5bdc5a4e108f70c8e40aef4cd1	f4245ee1a6eb4529b4ee633554a21d7d	2016-08-17 12:16:18	HS256	\N
8617755b-f014-48e8-855a-3c9d2d236a6d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d020510f7fd54e0181de8f41639c014b	2203cb4d87b44dc6929e93ef088a47e4	2016-08-17 12:16:56	HS256	\N
54b0a395-c157-4369-a76c-abc94ff37a04	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	068faf211b3141518c3adfd8738fa7e2	08dc8f84da3e4ba4a1df29266f08ddac	2016-08-17 12:17:30	HS256	\N
5a475266-b431-4cf0-80b9-e7d06b31c895	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	57bd5ffe72ac4f2f8d8942ee18fb9831	7a3f7def4a744addbd6e4b1c84e567dc	2016-08-17 12:28:51	HS256	\N
2eacd35c-b3c9-4c7c-8348-2478c7e4ab6b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ab9d02d08d8b4536b42397f23a3ba9fb	4f332f1e9cc949d4af9d6cec40ee5394	2016-08-17 12:39:36	HS256	\N
dc9751e8-c69e-46ef-9105-e104062a1844	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b28007908e7a4e77a3595fb53255e228	12a12104087e4d76a5196ba373d6d28b	2016-08-17 12:41:52	HS256	\N
53a44259-be3f-4fb3-8fac-18167432baee	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ec30dd2ba624421e8700a50d4a08ec2c	288db70aac7546a9b873266e544d2626	2016-08-17 12:41:52	HS256	\N
5ce94edf-04ed-4b9c-b645-bc7d47224123	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1f1f9b2f742745e0b63399ba01b0efb2	997b3ae27636453c92d5f6cddb725abe	2016-08-17 12:54:39	HS256	\N
c8320ff4-873f-48c8-9e78-399302136189	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2035d5fb61624b8e82fe6c550a64386e	05709af32bf14b6bb121abe3b1800f2d	2016-08-17 13:24:28	HS256	\N
491ebdf1-5113-4a87-85b1-8d7db38ef43c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ad01f9173b6b4b1b9d00f3f8cbadf5da	ed261568117e43fe9a65f093c6857a6b	2016-08-17 14:05:53	HS256	\N
ebf9f4d2-70bf-4619-ad1d-40de99051ca8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d6f17125d6564246a696d64c5c0ecea6	38a280af10074076975eccab87b5106c	2016-08-17 14:06:18	HS256	\N
e9b737ba-9a7c-4e81-8663-3982eab9b64b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a07325725e244b64bc68681f3206e39d	9f5e9b2951364db195ceeebddc526bd7	2016-08-17 18:57:12	HS256	\N
d9319b1a-8865-4ff0-922e-fce7b6f90a16	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c89b9b8fb16c4f7186dce8470e5c3221	63a2c62760f144b48bcf65cd4f898c0c	2016-08-18 11:24:47	HS256	\N
ed7c2f4d-4bf6-4183-97cc-35869a8bd02e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2abc8e2b32dd44e4b826a0b3c67a9b90	b32efa7f6f2d42ddb07e16aa17e4b7cb	2016-08-18 11:24:47	HS256	\N
73bc8b26-5385-44b2-a6fd-3bcecfb85ad2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2b9014794ac54eee9206a7c03f59317a	e32d035533444fbf9db2059b1db37ff5	2016-08-18 11:24:53	HS256	\N
a5ebcc26-2402-437e-9398-d4fb8491051a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3d7a0aae7c3d4f9594ed9cf8dc42a97c	a5de3a225afa437cbffd67f7dde1ca8e	2016-08-18 11:31:13	HS256	\N
7562ced1-c766-4ae3-9c32-6fc720ad729a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4202ff3f566542258b18d0c1631b053f	3b77d3b50ffb4119b697cd0af08d8e7b	2016-08-18 11:31:26	HS256	\N
103cc3d8-9a8c-4338-a7d4-980015aa35bc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6b264ce9d643469883c0380df4f6ae14	7ef625fd5b2642208e03d2f67f19fe2d	2016-08-18 11:35:54	HS256	\N
4f654839-c6b5-4d4b-901b-e64d5a6324ce	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2fc69778db4247a8bc3875f7e75c082f	f5b3c55ff0f447ed89448ba9a84a8cb0	2016-08-18 11:35:54	HS256	\N
2178c8e8-9580-42a1-a1bb-9342b13ffdef	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6aca4f7274444924a0c4ae561a1a0b2e	28081e1d8bbd44b787085efeabd55e4d	2016-08-18 11:37:55	HS256	\N
1e5e787e-450c-4e07-9cd9-adabef36df93	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d99b1c4ddc6e4122b0dc8acfba34887c	d684be1180b7489cb8e0d5afd7aefe3e	2016-08-18 11:37:55	HS256	\N
f83b7f41-560c-4808-9c92-b17e771715b1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	67ea300044fd44039f5cd02c730b43e6	8c478685bf2d49908f125f78e46f4a58	2016-08-18 11:38:00	HS256	\N
75be854e-8d4d-4652-98df-a7981d0c21fb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8cb36ae20a444274a22c1d9eb7f4ca62	614f06b9df884b4c8d6f5b414e14427f	2016-08-18 11:41:25	HS256	\N
b319c0a4-11d8-44a1-a002-ed9948a4b8ba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f308caea5d8343418c4cd462fa938f4e	ffb39e21b3234363af01b141fe6a24d1	2016-08-18 11:41:25	HS256	\N
ed4443a3-9f1a-4c9e-acc8-111d341aa2a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7bda326599e844b0a1393faaef377e46	9e1a14da73b34f60b75c85c38ee65889	2016-08-18 11:41:35	HS256	\N
62ded43c-84c8-487c-a62d-c2c64feb4e15	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fac03a499c9b44a59d3af0301b77cc63	435aa0a795844e0ca3bd4a606c24a7de	2016-08-18 12:01:58	HS256	\N
cbbc93b7-9007-4ff1-b7f2-4cd50ce12d15	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3e31553d24154d8b873889a7dd9b3022	63528626fc264246b933e01b9924e0b2	2016-08-18 12:01:58	HS256	\N
9173daa9-6fb1-4edb-934d-05ed3ce543f9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c727bad32dc457585a19b1c83f4d074	24cfe4b4a26b4347bbaa3b00dd17bf5b	2016-08-18 12:02:12	HS256	\N
64a57cdc-28af-436a-8220-6c77df3da13d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b1fadae1f7c242f0bee741b8ffde1fb9	19746d78db8b425589e82ada8cd0a5a7	2016-08-18 12:19:26	HS256	\N
51f22d78-f721-46e9-b405-a5b77153a67f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3fc0187d78e44ddc9abda47c53ad8cba	6ae2318f1d5e4a8b89829de1f10e7abc	2016-08-18 12:19:56	HS256	\N
2fe1b906-473b-4ac0-bf12-cbfbc6d19e4d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e3106809dad2494586783f6b9bb0b6bf	0a4e83eecbee4bbca80ad6320831fc61	2016-08-18 12:20:21	HS256	\N
522323c4-604d-4df5-b9bb-f0335e49991f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6b10d246abf74abb8de6f5d7865ca287	de81919ecc594cc79b218938ab177167	2016-08-18 12:21:27	HS256	\N
d3256fc3-60a9-410b-9b3d-64be06543ec0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f580e5b8aa194e4da81c81fdfa567d0d	dbf81a157f814233903f815a9ebe2527	2016-08-18 12:21:54	HS256	\N
165c0f53-24e2-4bfd-8372-9ba9eda76737	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	691dbd835a1142ad876d89e1e7fb1454	49c5316fc4444e2899c74595c48f1fb1	2016-08-18 12:21:56	HS256	\N
5fa68fd0-d07a-48a4-9ed5-d67be3a94928	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dea0701b60cf4965b08031f3875dcbd6	61dea72122444bdfb30c2a3bd1e2e6c2	2016-08-18 12:22:18	HS256	\N
b394c22e-1d79-42c1-839d-f1435eed4a6a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a2744b6a16374d4182ac696beadb4d3d	335f96bcdbc54825b6e6067dff2c6470	2016-08-18 12:22:23	HS256	\N
388fec72-a1f2-4428-b9a5-a89438ea294b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fd7a0c46d39d42f49b43db4380121389	d326a14930144bdf8ef51a9e9593a231	2016-08-18 12:35:25	HS256	\N
e4558567-d925-49b2-945d-23c417ee80af	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	85b68215594940b1b21d9682e1c4f51b	64bd6a2d211b4b6680794f9d72a26258	2016-08-18 12:35:25	HS256	\N
d6984326-4c84-4468-833a-00a3dea7a3b4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f68616636c334ff7bd567fd74ca622a1	74e0aea49fe142b0b6347bc74cdea4c5	2016-08-18 12:35:28	HS256	\N
4b528ccc-a87e-4ff6-802d-122082f9683b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d63bc798474e44fea37e963e92c8dbaf	3f6562e910204320ba0f56a04dcb3101	2016-08-18 12:36:09	HS256	\N
b7505bb6-a2e1-4db6-a087-f01a6f26ebec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	248e1104c37949e28ac9eda3943907c1	c685346712b2415a9cc223bd399f812e	2016-08-18 12:36:09	HS256	\N
bec58a7f-d42a-4476-a7f6-df7cf961a993	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e1d18b0364884cf8979ee536054eddd7	ee5e74dab0d94ef5a8658307ca250c99	2016-08-18 12:37:40	HS256	\N
8c91fd7b-5089-4220-8006-6911b8cb80d1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e272b895455e4cacbfa8858c8c9285f2	54ca94a987d949b7aec12651f92b7dfb	2016-08-18 12:42:51	HS256	\N
1d2b2ff1-8020-4786-ac35-9e8889cc3f5f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f44db3553cec47d988a92122b9702339	efa1ecdac3cd454aa49bc77093da4747	2016-08-18 12:42:51	HS256	\N
143d3317-ac66-4f0d-92ea-522085df8283	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cd2223afa37e49cd9108c2d811367893	23094a8d669e41dbbb74e74882355186	2016-08-18 12:43:45	HS256	\N
98706852-c4dc-4228-89c8-b57802eeb628	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	96eb33a74d974fd9ac8de4467db1ee26	4a6e6584a83b4ef196da0a1a6022e79d	2016-08-18 12:53:38	HS256	\N
f73f40de-e7b0-4da7-a236-f23422ed6e57	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2e65cbc649564440a75c5209d62c826e	e2726288449b4c50acb6c5cd6c5f3a70	2016-08-18 12:53:38	HS256	\N
830e8773-eace-4581-8f0b-6fdea51b5b59	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e37a25b979bc4d7e8700f5a0f2f33119	1d207212306a4fcea5574438b3ee1edc	2016-08-18 12:53:41	HS256	\N
887b7d79-6fcd-4209-9603-19b814eaeadc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	63ffc923cd0b45b984e705ddfadf9fe7	9d9ac32d85b1474a8f41b178a277b9ad	2016-08-18 14:59:24	HS256	\N
55a2819b-790d-4f93-a3b0-d2d92e12a401	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	062f3fb9571c41738571dabffd03fa22	7869073d46ef44e0bd8a8cab1da01f08	2016-08-18 17:02:59	HS256	\N
6b3e34ef-ed2f-41dd-ba12-76a36d2d4ae6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	670a7bb343bc47bc921c4abae2705e62	7575e75e0c7245cbaaad92422993efe9	2016-08-18 17:05:58	HS256	\N
9a0f9382-a1fa-4acb-9ec5-2dd324f2ed99	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6c73248f955c4fe0bbac715e7c172bbb	28e1c7dabf2d4a94b30f8f4a59233ad5	2016-08-18 17:06:28	HS256	\N
113ea658-bc66-48ea-b7d6-99d94542f97e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	92ba1d6bfe4b4799a6d17aab21d72037	30490c64d04f4305b665e0ae1ae8b93d	2016-08-18 17:06:28	HS256	\N
747e9fdc-dcee-43c3-80bc-02ca62b30ef5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	71ae7b2db1ae47cf86d34f63b4425316	0cb577d7dccd45d0912e56f7649c1a09	2016-08-18 17:06:57	HS256	\N
c2f1a410-188e-4fd3-8d49-0e9aac3c89e4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8623d78e634e445aa0172302cb570801	8c265ef312f54f13b5eda3a00b7bc3e6	2016-08-18 18:03:43	HS256	\N
38d7044b-5295-4b2e-aec3-1fb939500ae1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1a8e184d0c024b73a3b13d11af2ef448	d70c51db0c5148f78068b7c19b4d6ee2	2016-08-18 18:03:43	HS256	\N
36490c0a-0632-4ae7-9c60-8630e84dc720	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	36a600c177094bdab4a3fa2264850a96	0f1abdf1461241828844275f09247980	2016-08-18 18:09:42	HS256	\N
537f28d2-3225-406a-918c-53053cd438cb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1a00bc92f0e94399b839f6dc78c32c43	fb910d23a85c428c9f0a3f6a80b6a503	2016-08-18 18:10:04	HS256	\N
47239280-a3a2-4f8a-b80e-ea53bd781bf0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	914caa86ca4d4562a8dc2f12d26c8a4b	97eb743ba04e468290d47081b7d75e04	2016-08-18 18:10:09	HS256	\N
ff4b6f32-a0ac-4ccd-be69-cd9ae74ba1eb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f77a3acb86c345348bd9881f8422b731	9f345c7c8aa24742b76049b7d5d0548a	2016-08-18 18:25:22	HS256	\N
fadae91b-f15c-42bf-ad4c-512eca7e04d0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d6c048e5732a4af58397c24935822bfc	4d9218a190d9400bb7e948045ff6762d	2016-08-18 18:25:22	HS256	\N
e13e2595-2b63-4292-9a17-ea25367dd82d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	82d08449b45f4723ba4837c61639fc43	75c58978fbd148f99bdf5f124e8c96e1	2016-08-18 18:55:38	HS256	\N
17c98b8a-d580-430a-b8e8-993cd20b6351	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b1f5271225c44e4c9d2fe29e29e57f07	742c01cf1d804b8b9c34ad60aa80e7c6	2016-08-18 18:55:38	HS256	\N
08376730-ed17-4b7c-a932-b4d80e7a1613	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	616d15f716a1423e96e2c5d428ece838	48176f2a16ba47acbf58c1bdfad21565	2016-08-18 18:58:10	HS256	\N
2dbc28b1-1f75-4500-9c0d-6c5d26a46a61	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	28159b241b52404da9cc5e55f9aa00e0	4e2e655174c245aa98f2b50ee1bc841e	2016-08-18 19:30:46	HS256	\N
dd861d6b-5eb6-4832-b626-c6a93b246bc6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	34a52d3d664648aba023f962d5f6be75	3c99882ec7d84c07a904e9aa02dc5ed1	2016-08-18 19:30:46	HS256	\N
3b46ead9-90a9-4c82-89a8-5f4dfb5a7b3b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	85d86fd13f6049b899e0bc44ebe92bc4	e1150570dc104a7dac31a765047c3806	2016-08-18 19:30:58	HS256	\N
b869eec9-28a1-422b-a3d8-c0f6c1ad177a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	67b611f7f8464fd3baf8cea357fe40e7	05f268aaae7b478b8df37719c7286e1e	2016-08-18 19:31:49	HS256	\N
893fee91-889b-4fb2-be88-6b475c1da3d6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	28506d35ff924e0899557c30fdc6e24e	48caa07ae2ef4f28a45c63688501bddb	2016-08-18 19:31:49	HS256	\N
f8ff36af-e054-4e7a-a316-9ee234e1be4a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	17d84ae951fc430cb84ff6284fd9b600	dbfa708b6e1842ac9d56cd0f99f7944f	2016-08-18 19:31:53	HS256	\N
e41ccee7-0b62-4efe-a80c-a8eb73eb3a28	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7a8c7945bff74fa5a9300aaf2e3054af	f01bf6c229ac47e9bde774d0d1e66633	2016-08-18 19:35:42	HS256	\N
a66c04f0-cdfb-4461-8b12-ed1339e8fcb4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	14ca5f21d9274940931eabff8656da72	34e03488cbcf4821936426640bf70dd8	2016-08-18 19:35:43	HS256	\N
933e6b15-40eb-4ac9-8053-57b8f80797cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f550085d20ed418e9bcc2c8695adf08a	a050fa2a9e2149f6a61151cd73b16d71	2016-08-18 19:40:09	HS256	\N
a0da631b-3f8c-47de-90d0-a29a540221c3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fbb409dabc34437586132acd861b0a8d	95151ddd3e164d8bb94f1bebccf2599c	2016-08-18 19:40:09	HS256	\N
9265fcc3-3b9a-4a3d-b36d-0cfc552c0463	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c6a8f84c845420c8743b6f0c3d90159	7620f3fb41ed4939b490cf9c1fd1e567	2016-08-18 19:40:17	HS256	\N
8a4d0bbc-85a8-4e0e-9b5a-21f80d122dba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	270dda50f5e04aacb681c38f3ca6744a	a5a3da8cd0ed459ca067109c859dcf04	2016-08-18 20:15:01	HS256	\N
e7c30f28-8cf4-4214-b81c-01e4c861cb9c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d3d3c4cff5774d7a8be8d6d66258a4ee	9e39d53b41c84f428dfe0dbff0b897a9	2016-08-18 20:39:25	HS256	\N
8b5fda7e-775c-4eae-94cf-17e8707670b5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	901c14b937cd4a3d880672debb67817e	1eb87554eb634d30ad57f2dcd4e1ec33	2016-08-18 20:39:46	HS256	\N
104b5d08-fafb-4fd4-8606-5110b3bbae59	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3eeba8afa3334aed8f10f49a850aed9e	a65a7922012a4b759d6c8934a7972343	2016-08-18 23:24:12	HS256	\N
0208cae9-a6f4-41c3-8826-08dccc2a2ef3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	63776e26fda44743a62e8c7634f0f6d9	1fedf861ad354906b9a97c8b6d179677	2016-08-18 23:24:12	HS256	\N
d2a6d035-df66-443f-9b88-6307405f4549	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f1f90212221a448f9e568867ccf80c42	e6b8a6d1b690411faf44fe5e125438b7	2016-08-18 23:24:57	HS256	\N
55a7b139-214c-406a-970a-707e692bb037	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	87c2214feb244970bb032f42cf3999c5	6498ea6ea7754971a3792640f8774483	2016-08-19 01:07:55	HS256	\N
a89dc93c-5b8c-459e-84e7-4d5bf051ac0c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ffbcca3f0fea4e96bb240fc9adf680e0	38fffb92f46a4eedb08a235e5fe7a527	2016-08-19 01:08:08	HS256	\N
c0f31455-29be-4696-b259-5233da7181d0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1980feb7d6a34eabab1f9537769ec1d2	9a234a170e39416ba5ed0eadafd64495	2016-08-19 01:19:17	HS256	\N
184b892c-bf59-4230-993b-45caae80330a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e64428883f724a3e8598bd7d6d395042	6b8b79897a264d7083945a580569c5b1	2016-08-19 01:19:21	HS256	\N
7c36d956-0fbe-4185-8a94-e2e1b0c64e44	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9b218a5518b84d12bada45c3e181862e	1ce40e77e3d14b4eb844a187ed4bceb8	2016-08-19 11:21:59	HS256	\N
635d7ff7-7199-4797-9b93-6205c1d9a6ad	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5de02bff787241319c2d3ea29a134c37	52726f73acf145c1aa73ae569f72d459	2016-08-19 11:35:24	HS256	\N
e7047061-25a5-41c0-9d46-913a6d8f90e8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	286d52b9162149f897a71231a490d96c	53aa6b58ad0448a5818a40ceb1f1291f	2016-08-19 11:35:24	HS256	\N
aadbfcb8-8062-4a6c-b8d9-d270bb910463	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a345ecaa89194729bc8a3cedc37be52d	67322af16d034b06a6b5b8f8fb26f2fa	2016-08-19 11:35:54	HS256	\N
c7a693a1-350e-413a-b4f9-c74ba2b4cdcb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ecef82e39858471aa4c29ddfb473b166	42462af2dfdd4340a6857c47ace866b2	2016-08-19 11:36:10	HS256	\N
0f6642cc-977a-488a-8f48-37fe80f15281	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a3cb72d2d0a34b39a0b85959d36f54c7	f9274bd1664d40eda7f3e185749355ac	2016-08-19 11:36:14	HS256	\N
0eb7c255-cfce-463e-8a63-9134ab534b5f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f82d4e43f6be42908e0e8aec0175942a	f0c1aa788b674fc7ac1469e2cef97287	2016-08-19 11:37:12	HS256	\N
62ef9037-9038-4edd-96af-d22c8a4c12b9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cca5e3831b8545cd9e1af0ae1c0c983c	21894193eece4c06a4c8326891f6869e	2016-08-19 11:50:15	HS256	\N
98a06612-8323-4715-9870-a5d265120ebc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	43936f493fa14e04a256a4a515fa56ab	1976cf6c8f694321bb254cb34ba1b5df	2016-08-19 11:50:15	HS256	\N
a1199589-a49b-4716-9d62-cc00245dbda0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	add7cd823f9647b082377662b2292d1d	9af967e8e6f84b4e80a08c36d3dad00c	2016-08-19 11:50:23	HS256	\N
8c1cbb81-b6b3-4f3e-9e26-52eec86d1172	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ec732eef8d844412946c697cb10b4449	5bcc837d314e401f91b0bf045863f3e4	2016-08-19 12:30:03	HS256	\N
5555c9ca-0537-4346-8660-4d40aeca2fb5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7374c7e355634da3a10bb052f1788c87	a286568399b14f29bb2abdc73cb954dd	2016-08-19 12:30:06	HS256	\N
753249c1-0729-45c2-b440-7106970fd852	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	38ee70409956431eb962a62c0764c205	0e49a8769bc74cae8746bda6207a63e1	2016-08-19 12:31:24	HS256	\N
8e783e73-18d6-4e8c-a919-8f77a208257f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aa98f4f228374d3a81ea86d366bfd6fd	182506951dc6421f8e75b54b094723e9	2016-08-19 12:31:26	HS256	\N
dd641bf3-3823-4abd-a66a-6ec785dc9069	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	000e591507134fe3a53df0910fab95d1	0621f2a86789451b819d039559252d1a	2016-08-19 12:32:08	HS256	\N
86302770-d4a4-49eb-afaf-64ad65b1f5b9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1713e01f9fb348f4883d24304718fe59	93374a5ff4674a5bafbcc4388b951c32	2016-08-19 12:32:12	HS256	\N
c2c4a732-70b3-47d5-88fd-2d2b0e470c6f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	73cae60ab0854d728b6911d47e184c9f	2d16019005584d32aab13771f4de4ecb	2016-08-19 12:44:46	HS256	\N
1fee0d9f-9a52-42ce-9603-10210bc09def	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2738bc069fa14739b5ebd599c866154f	b08d657f40d346b9b827ad778acf1123	2016-08-19 12:45:27	HS256	\N
bd0b3b43-39ec-4322-bc5f-7e28f9301ccf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	078478c5817649d890ea906d56f348b4	2464ad5d826642d79a8ff46fe5d941d3	2016-08-19 12:45:52	HS256	\N
4013093b-6e6f-4575-8fbe-9fad5262ae0b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	83b1f4f99b2346b7be394fa1b5b6cb60	261ae2080c504fd1a08ec62083cf3f5f	2016-08-19 12:52:05	HS256	\N
b40266f1-2510-4de1-b345-93bf9ecd28ae	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bc5a1c2f58884d9f8b906e5142dba489	fc3beb59c59a4c1fb5be247695f3cc8e	2016-08-19 12:52:08	HS256	\N
58fa8f12-6396-4629-bc71-b35b9f97bb32	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a74243924c384756a8aa7a189fbab343	130b20f46c44494a91c5dfdc97c057b8	2016-08-19 12:54:58	HS256	\N
689028d7-526f-47a4-bd0d-cdcd64b57feb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0ef84b8231a64facb7618fd6615322c6	1143737374bc4654a31c4b192d6a1179	2016-08-19 12:55:00	HS256	\N
727411c1-e7a1-4549-a9eb-d5efe8f873f9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	95536c6691a141e69a4e5d9568e79890	f8e305ff3a124d10a4485f9c3673f79e	2016-08-19 12:55:38	HS256	\N
3cc20685-d432-4b78-804c-4d00ff2dac46	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9d306fd3caf748168ef9738539be93f8	9e52cc9653314cef8dd736c61074d34d	2016-08-19 12:55:45	HS256	\N
a4a38741-4cce-439d-a755-1bda227c5402	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	376ab71b7d444c6284e71ada8ef693ba	948e4cf68b264a6e8ae9668a45c22b61	2016-08-19 12:55:51	HS256	\N
79723134-f858-4708-b42a-1ebd38e14f6d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f63aebc443424be6982e7de0524f14d8	e01aacec2efe466597d475a83b5088a3	2016-08-19 12:55:55	HS256	\N
e3fdca42-5f2e-49cd-8dbd-7d142726ade2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	06f462abec4a4826a8a09c53579ea9b7	00e6223ce6024d83a8c33d459973c252	2016-08-19 12:55:57	HS256	\N
f47e9f23-9c7e-4477-81af-1694e5497455	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cdd549f13d5040469007f0b066c008ae	cfa1d985a78f45009781f53b6508a003	2016-08-19 12:58:17	HS256	\N
4fb7b7ef-c26d-418b-850e-217419e478bb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce8762f028de4c469f29d4efc5df6899	4e1f5bed0e14437c86d25070a57b7341	2016-08-19 12:58:26	HS256	\N
031ceb26-c97d-499b-9613-2d9a939c789f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1b3712c148ff4cb589e9f0a103340afb	81d884e47e3b480587cc953f428178bf	2016-08-19 13:15:32	HS256	\N
90cf57a2-67a4-4cba-87a6-22ca75cda67a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	727ee16b979e444dab9a6000fafc551d	fd100504d7c245a6b216e98b915c88f2	2016-08-19 13:15:49	HS256	\N
11110d7d-0b14-46b8-843c-5cde9c85fa01	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c1545175759e487ab7b440c83e70c85c	23cba9148368439f81a1ba5547829e28	2016-08-20 14:34:45	HS256	\N
5deccf15-8530-421e-86a7-c8d18370ffc3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	742c509e58ca4804ab119c840fed1237	d5b8997ba9864eefbc58a437f2aed682	2016-08-20 14:36:22	HS256	\N
4c7daa1a-ab27-47df-9920-d579d6680c4e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fac285682b5040388fef2207f885084a	0603d1749add4c4998625328eea94af2	2016-08-20 16:15:26	HS256	\N
68d4fb2f-7c91-4a7d-b42c-54e68044f293	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	89bedc6fb01542f5b8b815c01e3e6140	20a10c28139c4837b7a6cb525dc192c6	2016-08-22 11:48:25	HS256	\N
d5fd6bd9-ad87-4fac-8699-8fae941c12e6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d208e55a4aaa4eeeb45b43d0c785abfb	cdb23c02c328452fa2a590333e8b30da	2016-08-22 11:48:43	HS256	\N
824c051a-fd17-4e59-8d5c-ac67e8fb377c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e2079983a7894b55a1a213ca0c0c6b31	9359181062d144109d7e96051398a163	2016-08-22 12:08:16	HS256	\N
3aeb54cc-642f-40a6-b41c-2e8c5c14acf1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7e2b509de27243bdafb0f1f47b154818	a2d191b1ce884648b331fdb942268d1c	2016-08-22 12:08:33	HS256	\N
8d56dba7-d3d4-4c6e-9713-5953e358287c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d972c00d59834ed7bc6f60f86d521ea1	945e5de3e10849dd9255371b907518bb	2016-08-22 12:08:42	HS256	\N
f8afec23-4b14-41b6-9963-33c7a923ef5d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9ecaf4b6b9714f6491d71a7542791803	9b5b04e965e54643898e7d10efae5234	2016-08-22 12:08:44	HS256	\N
40ca5d99-ece0-40f8-8f28-43c619b43d62	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4c2c471d4e9c406abd3d6ae58c57d6f0	76420a90109c408398f8ea4c218b4429	2016-08-22 12:33:27	HS256	\N
c895c60a-b31a-47d9-87d9-5976f7095455	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	46852a064dc74e85872e47d8c5a1f371	e341c75a4bf144c4be617e395096ea45	2016-08-22 12:33:30	HS256	\N
230c8696-6cce-4c43-8406-5b58b2947f2b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	797f488eac9442ba863f47815f847ea5	c7febbc1000e4b0d8e2cfb0ae72ef669	2016-08-22 13:07:19	HS256	\N
9c2f5ad5-c591-4de6-af13-51bd1d2611df	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3424a2d16718429794952a6d2da1a2f0	220e2fb8e70b48f2a1b47ad00815067e	2016-08-22 13:07:36	HS256	\N
204c5f8b-7686-4182-9b3d-4fe8063af55c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dcd0d942b369488e9bf8aaa3e12870fe	37306333544646a4b0c3a0a8d29882c8	2016-08-22 13:25:08	HS256	\N
3cf1dc4a-d74c-4bda-bbec-460a57d5fa42	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f9ec7bbc058045e1a83517ba12e8ca59	5bf062f478ef47b4831569cdf700a9b1	2016-08-22 14:07:09	HS256	\N
5920964b-93e4-421a-9c39-f40770313db3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	272c8f033cb34cc1bbb4e7157323c345	373fa8652a24400fa5e1d6d3825178e5	2016-08-22 14:26:45	HS256	\N
d6228417-062c-4950-9142-e960989d2e13	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	98a1bbe6d7854a0e91cdbb551fdf83ef	6c5086eb89aa4f6aac681a32667b9243	2016-08-22 14:26:51	HS256	\N
1043bcd1-f122-4a3c-bd34-3ed22aef1193	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5c5521b89e57415dad044c75717026f2	02dda2bb3ddd4057895a7f7bd3ce8e74	2016-08-22 15:08:29	HS256	\N
2d96feff-9301-4f44-abb9-49afd5fec013	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	77e4872fe6f840fba33208940ddf6dbb	44ae6ad48bf74536968ff3366bb09418	2016-08-22 15:10:24	HS256	\N
fcac47cc-afd5-469e-abf1-ed08a93742f4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6f8a0e69fc3a4bdbb78fa6a0754e5272	149c19dffe894d48afde0b27cf215fb5	2016-08-22 15:41:09	HS256	\N
4f29ef71-eef8-436c-8f0d-d20e640e80d8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b0d4433772274606a8271fd2ef08cd46	756dd9428f384d5b9c2524a0d5fab638	2016-08-22 15:51:54	HS256	\N
441a2e18-52f7-4aa6-80fe-31959541081b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	151222b98b1a4d9e8e9f3d96096aeec9	4e7636a214a944aea9443ae576832abd	2016-08-22 15:51:54	HS256	\N
73861d70-1ebf-4888-a3a4-2832a9d666ec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7a2531b217af4b42bc4edc45089508fa	a12002ba1b9647a784686bee42938c1d	2016-08-22 15:52:08	HS256	\N
8cf86188-5bc4-4608-a7d4-a09534418316	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	09db3b173eb34c8696ce32215160ff91	6da901b5fccb4b72b3d3dec26e08f912	2016-08-22 16:36:06	HS256	\N
e15c3214-d29d-4a9b-ba39-389d60f0ba35	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	697639d653e84f32977bc82a1efc24fb	52bbffd29b014e8d9ba5941878d4feed	2016-08-22 16:36:06	HS256	\N
e0e308d1-746c-4add-94a4-7e55c65cdb76	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f430ef8f90d7464fb7a6d7904dabf477	1f02b9f58bb34d81ace8dac815fbdca2	2016-08-22 16:39:28	HS256	\N
68e19b5a-a341-4187-800e-9d0f00001ff8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7a9dc997b47346b7b854f6f007dbd4b4	4643db9dd81d47a5abace1af9a08c149	2016-08-22 16:39:28	HS256	\N
1db648a5-f000-4969-9aec-602241569258	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e9dd4a2e9bf14b7ba0ff657386f46ed9	4849a165d930440ea9d2fd22048dd7ae	2016-08-22 17:02:06	HS256	\N
871773ac-dae8-4f72-a3ae-354e9a085f8e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1d7ac7d4abba4408a8003ff3a0172833	6f9ef68a72ca49eea981c1f28f727ad1	2016-08-22 17:02:17	HS256	\N
5c02b44e-98a4-43d0-9e87-63dbe2afbcd5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3a1b1a153abb4f3fa40fc0fed261827e	594e1823a6ba4c41acdd5c139abf5f72	2016-08-22 17:04:27	HS256	\N
8dcd5595-a053-4bf6-88f2-9967868bf147	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c6683bf6a074c51abc0f3bb11058fcd	890dacad29f9472f9bbb2763d6180df0	2016-08-22 17:04:27	HS256	\N
83da83b5-8fe4-4573-bdd2-2426a1455d63	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bd2933e3052e430f8cfc9ce746f247c3	bb509657bc1b49a7bf9aacda3ec5669d	2016-08-22 17:04:31	HS256	\N
7ec53426-7ba0-45bf-908c-6e9e60968430	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	37f74dc051db449ab81d0e221a1f1e5b	17cd512299724ce8a29efdeb79f5cfda	2016-08-22 17:10:25	HS256	\N
0bbd4734-33cc-404f-bd94-e95344551cfe	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	593cf79040fa4721aa5d362fe349f7c9	84be6bd725754f4f81333304e05fae45	2016-08-22 17:27:54	HS256	\N
7b48baf8-ca8b-448b-beb6-4cf3fe7f6c23	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f4f40be671754c9c88164a4e76cfda40	a12786e8893640b4bfc8ca193dce7b6b	2016-08-22 17:27:54	HS256	\N
767e6389-1f91-41aa-8844-21a99ee004d7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	59ba5404e74d4cfba0fbbd6235e23038	79bfbb4bccd347118199a42b65f1158c	2016-08-22 17:28:07	HS256	\N
57c6f7f0-835f-491f-a4f0-da7e4117f1d6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	237a0f8317b34c1fb7a4c7795337a20a	26e0d81cdc6b4d3bbc76af752999a7e9	2016-08-22 17:30:55	HS256	\N
a4fd49a7-6b9a-4c46-8bdd-6bb7351b4b5c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	88a617c8b6c349b793035be2d86312eb	97957c0bddfe460dbde3bdf5855183dc	2016-08-22 17:42:33	HS256	\N
b9e13fc5-a7db-402f-ae13-43e658bd6c0f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	58234da1090a4038bdb09b3d594765a0	0a72327f5c604a218e6147d2d065a108	2016-08-22 17:59:07	HS256	\N
1dc8fc38-7e06-4f89-b761-631992108d88	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	91a489e87ad84caebc3764d5b2541ed8	a7b8be91b28f4186947285eb59247063	2016-08-22 17:59:07	HS256	\N
0102eb14-6b91-44d4-8bb9-1a1f6dfd3951	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	66d589b05f764b20bb3e15b82161a605	756e08954e5243bcb203e60b06cfd28c	2016-08-22 18:20:12	HS256	\N
c3398046-6ecb-484d-9b4e-eda665e87b17	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4306fc7228994712929169535300386c	dc28c32fdb474c2284a9c6d37e6b6321	2016-08-22 18:20:12	HS256	\N
5817260f-5a3e-4740-ac0c-0ee29c9a326b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	285f149d0f064324b520226bbd3785bd	11425bf01a9646faa398ecd1624f92fe	2016-08-22 18:21:16	HS256	\N
41532a82-8ec7-4c40-bc40-c3750a64d756	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	94a7453acb304419b613418a9e604bc4	6b9bcbbdb5374e1aacb64201d086f95e	2016-08-22 18:23:34	HS256	\N
e368b6ba-1853-4649-9fe0-f730d6f4a2d3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4f2680860fad41a894025f4ffcd41993	98746dfe15fe4e99836d2770d1796805	2016-08-22 18:23:34	HS256	\N
18b23a3e-d7e6-4550-828a-5033c0083ac7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	073624f769de41feba800ae64b2bc55f	884e9f1844e34283a8c841e0f6e45618	2016-08-22 18:23:38	HS256	\N
6c32454f-df43-4fdb-ab01-57ee6818d8ed	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3682770b7e124bf18505655b1aaf29a7	4ae3b06debfc4e5196f6fa8c989fd356	2016-08-22 18:55:39	HS256	\N
23e5a35d-28eb-4e56-a421-fca4890ecaaf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8e0783301e0b4abbb5ce8ae4d146568e	1e330451cbae445c873823adae729b2e	2016-08-22 18:55:39	HS256	\N
9a6bd76a-2f34-438d-aeaf-282884d6fd94	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	38a4c47ce8784a8497832119d664dc36	9dd5e09b12ff422492cf36d29a7a4d55	2016-08-22 19:02:33	HS256	\N
313f0d66-f390-40f0-8707-ce4d1ab3fd6c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a1263decb63445de8e7315db1c873b43	b04339d814d845fca798ae18137de107	2016-08-22 19:58:08	HS256	\N
7e8e3a6f-889b-4da7-a4ec-40ba4119ac53	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	15a4b6f387d94c33827a52e7cd5d57c9	c72c74a60d794bacbfa3336f1f97b219	2016-08-22 19:58:19	HS256	\N
fd6f71de-d0e3-4920-b99b-aa76e4cb4a0d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3de6b9db5acb48229d195b85feb54092	dddff0dfd93b4dc4abb0bfeceff9ce51	2016-08-22 19:59:38	HS256	\N
bc2adbc4-869b-498e-9def-20c8cc51e99c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	895972797a9e41239455a6d44bc1fb13	544ce5ad7d1c43f189e5f6c3c7656f68	2016-08-23 01:03:17	HS256	\N
c2b546c4-184b-48f2-ae43-6602bb330f81	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	45e93d3be008467ea07ade156db2482f	56a138a1960041ebaab6acd6bbcbf978	2016-08-23 01:03:17	HS256	\N
9966176d-3fe7-402d-92ae-ff0c3db34c4e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e1af5b66e77d415bb7b74e7fde90b589	f0d408e2a6b949fd8be66806dca04e8b	2016-08-23 01:08:41	HS256	\N
d73758da-3830-4e54-84d7-406398e50242	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5f45c92ee8b44a63bf2e691ea078e61c	ac51d3992119405dbd5f5a755fc5442d	2016-08-23 01:08:41	HS256	\N
f951a647-7d70-44db-9751-ebcae2a898dd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b32ef7af05b04f14976358071e71d411	b7fa0b88df964e20bd84485c71fd671f	2016-08-23 01:10:05	HS256	\N
1fa8f78d-8946-49f6-91c1-e1babbf4025c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	614ee18d00564605bdaa3c67caa1bd71	5b1630ebaa304a1d81f1161502ba8c8e	2016-08-23 11:53:09	HS256	\N
35ae3004-862e-4a8f-9a52-874b19494c10	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a755069ee8414d3d9603a1c7dcb7eada	70be87bca5ac45fbae77235ccfc4f5d8	2016-08-23 11:54:24	HS256	\N
f2e01918-58a6-4d5a-8ff5-846cead3503d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9e896e9db6e847388f4427df3238cb8f	2cdfbb9bbee4476e9d0f30240cae5583	2016-08-23 11:55:15	HS256	\N
bdc06c4e-8417-4661-bf12-dc6442b7c1b8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	695cb5c49da64d9ab25cd74331a0bfb0	aec621e56d8e4fdb81150ab6d43ba8b9	2016-08-23 11:56:00	HS256	\N
cdad3345-8fdb-4024-a4d8-d4632b306120	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eb5433a166d34682b4d73da37c4a624a	a4503414b3ea416dbf8361d9bfbe33bf	2016-08-23 11:56:08	HS256	\N
77deab4e-9c25-4f64-ad68-1e40c90cac2a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c8c630461d54950b0b5b2e045291bed	7e5002e746d140d9ad883c7dea9565be	2016-08-23 12:00:18	HS256	\N
a357b7d5-bb08-4ff3-973d-646ab9d32032	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	97436cffe2944794b9bdee6b3831a735	20860e8daf584afdabe8d58e55c3c633	2016-08-23 12:00:35	HS256	\N
c6bfa932-a60c-4755-b44c-5a96709018d8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	406c769c41e74bd8801afefe436254b6	77754a9265944ba4aaf4f492859f5fba	2016-08-23 12:11:05	HS256	\N
fa7dc02f-e46c-4f5f-8047-7c560130354e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9ea8f7bb76a1421da5bb22df0bb67693	7ac54f17a7f54b7da31aea93ad7d64f5	2016-08-23 12:11:05	HS256	\N
acc613e1-7cb3-407f-993c-4aea86928e9c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2b016451a7e44f7ea7ad5b0e8c7f6954	431505d05598490a8251bcdd2a3e1c86	2016-08-23 12:11:09	HS256	\N
5091090e-992a-454c-a779-72921b3c9467	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0ebc7002049b4a6ab3b3b0589aed4ae6	747dc1f8df4a4b4dbb81dd47da4a48a9	2016-08-23 12:14:48	HS256	\N
bcbe1d36-287e-4349-8a99-fb47b5d0f2c7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	29ff0cf5c590480a9d0932f078b57512	69d51b8efc9f434da3d42a2ef1597d5e	2016-08-23 12:16:52	HS256	\N
68153c5b-737f-437e-8e14-b2a3b36daca3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0204630a2f4d4dada55df9b0e8ea2c65	57e0475881654297bf75b60af4e27190	2016-08-23 12:16:52	HS256	\N
ddf1b030-4bc0-4f84-9fca-8aea3390d573	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	abeaf35e5ec94407bd3083e85fa7d8f5	0e997ccba4e74232afa85d9555a19a92	2016-08-23 12:16:57	HS256	\N
9bb8a329-8dc4-4d1f-bf11-37056edb4372	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	babc77d22af74e369eeb7d93d2225ef5	1770fe133b3c44c597a679092b51ea34	2016-08-23 12:17:41	HS256	\N
0fbe02eb-651c-46b3-b4a3-8d3c90c7e8af	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6dfa0d0a60f443a885a0d0a830c46a55	ea2f097c15664721a8e02045e8364cea	2016-08-23 12:17:41	HS256	\N
7d5fa187-b37a-4836-b469-3a29af275d22	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2f4832c610534ca1ade5423624f4d62d	5a219aa5f8144085b818d6fb37d20b53	2016-08-23 12:20:04	HS256	\N
58df4c00-262a-4d5f-b4ad-f0962eca4de6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e2c7ad7a149c43d4b7affd594088b944	4012681f2aaf4cfe83bdfb28849fbd98	2016-08-23 12:20:08	HS256	\N
ce8a237c-b262-4cd9-a900-75c948a1edf6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0081bc65f3924ea2ad7e06e37f2e32d8	aa5f4514dfce43e59195d37edd3198be	2016-08-23 12:23:29	HS256	\N
d229bb43-387b-4d35-813b-28d037ff73f4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c5891143a0b4636a8f6b4788c01bb33	9f2b4b039c0e4990bc84311f267f9691	2016-08-23 12:23:34	HS256	\N
4579fc4c-e60d-42a9-bbd9-35262a1eb376	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	21ba0384f15a485a97f4976f35ebd677	a5d612f10aae4ec7b9d3798dc4cb4c04	2016-08-23 12:27:29	HS256	\N
21d61bdf-0dff-488b-bcc5-19316dad1616	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	27cf718022074969881d6b8dfc98782d	154ee53194cb497e8d75b740aa459417	2016-08-23 12:30:21	HS256	\N
d2677af1-cb5a-4c48-86bc-d3921ea8db58	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dc1d4ab562d34ba1a0648c6dba8e31b0	75e627f98dc04f3ab56dc9a8436331d7	2016-08-23 12:30:22	HS256	\N
092f5b41-9cf3-4918-94b2-f1d925d9381b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4309c91791c4453b93b17a96c35931c2	9f9dbb1902f44912aaa87392e73d7bcf	2016-08-23 12:30:26	HS256	\N
b65cbcb5-8739-4537-a8be-5009a4718a07	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	427b8d1b820747968acc3dd788ae5de0	98a8f85ac68340e682213fdcd4bfdc17	2016-08-23 12:31:35	HS256	\N
08597146-e57a-438f-81ce-5f4210f92dac	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	63a48300aa5e4b88bf9b59f6d215bcfe	391db0a0d6f545109bc9cab6743294c8	2016-08-23 12:31:42	HS256	\N
7b7c375a-9723-465e-9fe1-969704fad405	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8486cd2965ae4c368b119d67f93d01d1	b4107b5dff0643809514fce8b92129f1	2016-08-23 12:47:01	HS256	\N
c1b7b52a-fc33-4f19-afac-5881586a2c13	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a623b8ba9e524a6780ca833596f98585	c34d5c57ce594b2b9f1976445c50e76d	2016-08-23 13:03:49	HS256	\N
fec6839d-ca1f-4223-9e8e-61b8afdff3cc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5ed36fe2f0874222ae11128a023d1715	9caa4cf5d9f94198af4b8599c626d70d	2016-08-23 13:04:25	HS256	\N
a6f5eaf5-237e-4c1b-b946-42f6ff6b7174	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b00caad9e4dd44a6988538fbc944fcec	7c42344700014588b9dffa5e08ac5ec5	2016-08-23 13:05:56	HS256	\N
55f8d6f6-914c-4512-903f-124915153983	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c6b7c8e019f3496b9a943610f04ea533	5d83cedcbe8e43d39b1fce811591d324	2016-08-23 13:06:42	HS256	\N
2719fd55-ef5f-4d73-86a3-97039820c4c3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	44bc8ac1c7804aab91923dd20dcf6ffe	7a2c91e7fff948f4b2d9d09924a41735	2016-08-23 13:21:43	HS256	\N
cafea680-20a1-4f00-ba6f-ed2dbf4c5115	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fae20527600141ce9e84d55302b09183	d84d1dd771ea4021b024b5b3b7882bd7	2016-08-23 13:43:42	HS256	\N
b3e572d0-0f67-40f8-a0e1-6a5d8465b37e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	72426933557a46f09c2b16af5f529c8a	4d01c38784cf4635bb21779abcff3351	2016-08-23 14:01:27	HS256	\N
c05cc12d-ba61-499a-8d47-a6eb5060eddc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c577128c62164d01943c573a4fba3b38	4e864bec10c14765a0b7490fb9b05715	2016-08-23 14:01:29	HS256	\N
8c91c057-fd60-42c0-9068-8e02c6cca63d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5a97569ee1f648eb848c260978840633	8d3f5ecdf0af46aba6ea279128edc599	2016-08-23 14:02:23	HS256	\N
63b0666c-bae7-4357-bb6c-2a1d1e0a3398	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bf621451c4c54b5d9c79747662fd1b70	1067b726977e43d9bca7f1767002ad35	2016-08-23 14:11:46	HS256	\N
d7cc7f59-16f4-46c7-8d0f-a5099297b284	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1dd98f431f724c0fac0666d6c3d593ac	075a6d2bc3af4c7da2e1a5dfbf5370e1	2016-08-23 14:11:46	HS256	\N
90a6c272-1871-4eba-bb24-1fac6e8dc885	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	05fb66f9e1fd477ba9920dda8b32fc6e	c9e938e5267b4e0a9d8983439a1b3400	2016-08-23 14:14:09	HS256	\N
96f46f49-1a6b-45a5-8489-f1280f251fec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f7a6fdf2bd24424893554c5f7802f545	29445c9e42724cf993955b9cd88cc4ac	2016-08-23 14:18:07	HS256	\N
5d6cb990-04de-457d-8405-5bce7ff83d7c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e47df441d0f94748a77c4c2d01aca9cb	bcc46306b3be420784113be62fb4c803	2016-08-23 14:18:40	HS256	\N
042f0d5b-91c0-4fe3-8c93-7d16adc9079e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e82f560cafd4486987cecdc234c308f8	f83f626c1fda435fb71743719d14d701	2016-08-23 14:19:06	HS256	\N
0417251d-9d54-48c7-ac9b-ec7ffb69a990	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7b9442af2bd9456d8dd1ecf2ecd34fa8	fe419d061aa44caabb28bb0c32fa4b76	2016-08-23 14:39:54	HS256	\N
4f7d4292-a3a6-4d3a-bc64-c3428b722afd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5dcd31dc985e4dcebffb404c1c881205	b92196d2d69f4781a37417c66728405a	2016-08-23 14:57:31	HS256	\N
7a22f213-cead-42e9-8488-9d0d28de2214	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5cc9286ca6b940b88ccbae5d137bbee5	72dcb3e6fe3741268835df9171bf5a79	2016-08-23 14:57:40	HS256	\N
c3896a14-50f3-48d3-b29d-4a44a4876565	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bd8132b1f9f14fbebde06239c1f2f2e4	31d07d8b79f04691a1ab8ba1eb30990b	2016-08-23 14:58:14	HS256	\N
203bf807-21c9-4c03-82c4-ae499ae5b7fa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9838a349169144aa8dc6104f3c82fec9	99ccb30635bf4acc8bf52ab4512fe631	2016-08-23 14:58:14	HS256	\N
df23cd03-ef50-4543-9912-028453069765	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4dbd777de14b46c3b023e1a3e03db0ca	5bc9dedee1dc4265aeb0beeeae237788	2016-08-23 14:58:41	HS256	\N
35273c14-7092-49c3-aefe-8e3428259e87	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d5b79b4184b24f538b1d3e8adb9ea1d2	df25a1a0987547308199535ae55eb753	2016-08-23 15:00:37	HS256	\N
a67d1538-ca5d-4179-8a44-e981c3128c3b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6c0fe38dd3c64c40886aad9d83f76075	9b72aae6b0c345e0a734753f3c5a82a3	2016-08-23 15:00:40	HS256	\N
969b9883-29b0-4968-b619-f409db15e0f4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dd9269f117184b7a974c3309ce125a39	02539b80afa74534810a377990459455	2016-08-23 15:03:20	HS256	\N
1c6d2115-ed30-48fe-a414-e9a51f5afeea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f19f059b858b4612a59a54e28a22b8fc	d8cdf058fd7a44b3a858980b2dd68b99	2016-08-23 15:21:01	HS256	\N
daa83d1a-396b-46c7-816b-03f1bd8d09e8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	31efe036584a4f86af5c144447fd625a	91e1543faa574d1e89915cf46afbbe64	2016-08-23 15:41:46	HS256	\N
af479564-0641-4106-bc59-c02bf7cd9674	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a8860adb269f405ca3a410db3f82001c	806e608694a94e85b7d8a03e73e6b113	2016-08-23 16:00:23	HS256	\N
75d63ce6-f1c1-46f6-ad1e-4acfbbfa79cd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	99c601eef2a24fd289d1ac2e959f0616	2da25f052d2845528c30ec7e0ca92384	2016-08-23 16:43:08	HS256	\N
d4fda672-c230-401e-85ba-0b8797707ac9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fb621daf4ed249dda714e789d8f67944	9d666911d71f4b508950c64f86e63046	2016-08-23 16:43:08	HS256	\N
550582ed-723f-4544-b528-381c7b1272e2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8738810c2975404c8b927ad3ea5b3e01	c7d1b237f87f472da88ae773795c1c53	2016-08-23 16:43:13	HS256	\N
df74f116-e384-4e5e-a256-098f1d102c05	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7ad14a07922a4b779a4d3a0e968f9688	5e3fed5dd7e643c19df6c80f61c17eea	2016-08-23 16:55:13	HS256	\N
98d8f82c-99f2-492b-840f-890b13681355	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	574d009e461f4b2ba3afa21f03bb4e08	1067e4c17e3e471dbc4b35819112e2d5	2016-08-23 16:55:31	HS256	\N
87998321-a6bd-4b3e-b199-ba8e005c3d27	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3a823941e4b546b2a3897ae32ca227db	d44a75ab2bfb4cc79797c987873309c4	2016-08-23 16:56:44	HS256	\N
8716abeb-4114-49cc-9c5d-06ad5eeaa34e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	371b9cc2d4e54c40bd41728362e481d4	8cc8b6900d7a446f8906d387e8567fbd	2016-08-23 16:56:44	HS256	\N
6dff3a89-89a1-4454-99f5-ca8dfe1e00ec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a67925033ed04736a275cb2872b27965	7d2487ba19534de2a0b85a91db77cf39	2016-08-23 17:04:45	HS256	\N
3580784b-9afe-423e-a853-7ee6fdf71b2c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	65461322b68d4e8ba4dc968dc504f7ca	7f3e84ac599c48cfa82505624b24d783	2016-08-23 17:04:50	HS256	\N
8fad3093-832b-429c-8938-a13772390b3a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7732fdf461864e1a94429e04104f8684	75bc36bf7622477893a18e69ce294fd0	2016-08-23 17:21:44	HS256	\N
28b25f1b-5d59-4ee2-a06a-817419cf6ede	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ffb0dc7a22ef4551a45dfdf421179907	db7f5e54b7cb4e0ebdcf5595238c4bc4	2016-08-23 17:21:44	HS256	\N
f5a7b747-2115-41d0-b7c9-01b10a2d428e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b717ae5721ee45b383f923e9c5b87c46	a4d1ba11dde24cd0b4b2ebd0edc04645	2016-08-23 17:35:01	HS256	\N
1f945f7b-787e-47ac-9b0a-11be22611831	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2f9739840f0a43f38487b116b6eb297e	14d02203ebaa4f10977d2b2a5beb9934	2016-08-23 17:35:01	HS256	\N
535b3aff-a212-4e3d-b1f4-4e0609602de5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	89996b8ff939482ba771e75e07d8d0b0	35fd314e03354e05ada868510e41479a	2016-08-23 17:35:12	HS256	\N
85c000bd-507e-415d-bf36-d767e04d6c4c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	08f220a4071e495ab2ea617249abeff3	2509f91dd26d482499239b9783e686bf	2016-08-23 17:48:38	HS256	\N
eae187fa-913a-4cd3-a1a3-b0961b45b154	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e55fe86873104863a075374a4a325660	e547c959d3074d52a0a85ba905c1af2c	2016-08-23 17:48:38	HS256	\N
2b2af506-3755-4970-a2ad-719508f316c5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	72bb30dccac64dc49d7213651766b489	f7a1b6463389444d9841e01c6d6a0285	2016-08-23 17:53:54	HS256	\N
1e77ffc6-4e0a-44a5-bec2-e0bb1db8617f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ec8faab1be8c4a408731fc08983d0666	b3453c2ae5874cea970b7cbf9aef37fd	2016-08-23 17:53:54	HS256	\N
53a1ac9c-d137-4426-bcc9-a9c638d12664	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2e20ac44155246c6983d25b72dbcf090	7d26d9acc6614c349fb3d0f89a75ae68	2016-08-23 17:54:00	HS256	\N
7f522355-7c3b-49dd-b8d3-22d844052a8f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b8b12ed3dfea45d78b71fcc652c50377	6def2aa6edb049628cdc46538f3d3555	2016-08-23 18:14:59	HS256	\N
965664f5-f27d-4a13-9ca9-e99e0f0f27ba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7cb16e0c765641a5ac2360f9144504ea	b40482b0c190419f87810750e576b4b2	2016-08-23 18:14:59	HS256	\N
aee2c58d-8f62-407a-980e-1add0719fba8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	650d4f64289849339db5a36b9c25090b	a2f17bf5d4f44cc79886aefb32924aaf	2016-08-23 18:15:20	HS256	\N
953dd000-1f9d-4925-a7bb-021aba6d6df5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3babcb69bf3e4a8cadc252f1ae375d02	ae3cd66b1ba24997838c6569e9d5057f	2016-08-23 18:24:08	HS256	\N
28fa2265-911b-4af1-a36b-922920578fa2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5301311f75c1495aba64cecceaf610e1	81c38026fa6f42f7af4438472d908e88	2016-08-23 18:24:08	HS256	\N
f476f7ee-293a-48c2-9641-961c9bc3e81a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	54761ab9b52946ca8d8156bde2c8dced	404164192675413c973538a848c4ac16	2016-08-23 18:24:14	HS256	\N
54effa5a-43dc-4fd5-b421-739ea352a7d6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3be00fa0e66f4879bf97a23aee42f3cb	908acbb60c9747c4834715b3b4a14ba9	2016-08-23 18:48:05	HS256	\N
4e988700-10a6-42ae-90b3-d60d2737ebbd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aac5a7cd67a049c8b39ac030e1bc27c6	c2ef8e19128b4a619145a8b75ee6fea2	2016-08-23 18:48:26	HS256	\N
7e9674f7-f787-455d-9734-2ce8746ba994	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9750119af8ad421d994eb296bc5f2901	f25042cb73c1468a807b5b9c146444ab	2016-08-23 18:48:26	HS256	\N
e81cf1ee-28bd-4bd4-96cf-a947b111f8a0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	40e136f6cc8148adb019c7e28d6cfc8f	50482407dcdc42cc99a47f059cf9cf1d	2016-08-23 18:50:19	HS256	\N
38d8cf32-bcb2-4656-aabf-0bb5b5bdc059	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	73945a3217864e55b08857867cb79bac	51492976808c46248f0f3e844987fcf8	2016-08-23 18:51:32	HS256	\N
72d46c47-6fe5-4682-8392-0d0917eeacb2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1d26afb4062d48f4ae11f0cf81ab25df	aed8a7b7ee4c4bc384cc87d900013141	2016-08-23 18:51:32	HS256	\N
888a9356-ae2a-4ad4-b6ff-cbe968861009	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cc7217aa2235426aa645fb09b399790b	d79ce6f6c15848009fe399a06c033665	2016-08-23 18:51:51	HS256	\N
ebd1a98f-8b07-47a2-8a0b-2dec2b9de990	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	244c0cb93b7e4dd8ba96cc7a7437a26c	ea297662cae844cfaee8f143bb4ef29c	2016-08-23 18:51:51	HS256	\N
596c00d8-3199-4c56-a9c1-788e8827cee6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	62b932c1cd094c9e960684183781c6cf	e64613d5805a484e9171543459173f4c	2016-08-23 18:52:02	HS256	\N
8b62ae0d-a236-4977-b760-9dd8d2bf4ccd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	af3856050fe2461ab5818e39254e985c	f3100d4ab77c41308e46e78c63f54c97	2016-08-23 18:54:13	HS256	\N
9bbdae0b-f870-4d38-b2a1-7dfac56a6eaa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f194f015f9784baabba5560940c4c8b9	28f36c747c10413990bca60de76e9e3d	2016-08-23 19:20:02	HS256	\N
23c8a1ce-ffa9-4daf-b615-c61164c46bef	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9800a00a12ba41f4bba31a67f9c64d22	377bd9dc943f4ca98d5c87fc9a91279c	2016-08-23 19:20:02	HS256	\N
9ae41443-7c5d-4dea-9e56-7e70c646b6d4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	43708cd93d284ecebf8ea8d309d519ff	b3a09e8e4565486dbf77054a1d79113e	2016-08-23 19:20:33	HS256	\N
84a1119c-d618-4813-83eb-e7ff758403cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aa7b8226da934641822f7dcfe24ad3b6	36c4427a8a2a4a868be6bd1ae306f2ce	2016-08-23 19:24:07	HS256	\N
f509cb1a-9eb3-42c1-a57c-3a632ee491cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6d12538fd3254d8994ad8870787267a8	76523e38e6eb475cb7d64ff38ffbfe07	2016-08-23 19:30:18	HS256	\N
152b7448-fd01-451d-acc6-d2a749404975	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cfa43a9d91c1426ead20ccb128894fe7	9f3b9470a2174306abbb72425a64492d	2016-08-23 19:30:45	HS256	\N
1f592f45-b727-4301-b203-86c6e77a4327	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0c24bab4a4d7456296408aeb9e3ad14a	87b51beaf25b41f7867ca14c7f9f21eb	2016-08-23 19:30:52	HS256	\N
2901aa8d-c668-4ad3-a153-df00c0a3ba2b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	90e636d4116f44deb3737f6ded281ac1	8aa9f1f9a92f4b2392521271fbf4da36	2016-08-23 19:31:10	HS256	\N
dbb75767-21b6-4a99-b9ad-9f178ee596ec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bc6f80aaa205419fb396b34ce621efcd	f1b6dd16f2c649fb8070426f954f511a	2016-08-23 19:39:20	HS256	\N
e3f8d174-dc4a-4e28-921f-cdcd35b11efb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	37a7382ecdf14524b353b27dee1b0bde	639e05d877a94b8aabec50f88da59fb7	2016-08-23 20:14:28	HS256	\N
79dbcd68-3c26-404f-abca-bc051f8a8e7f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	05869f48b71e4093b3f1b4e68d9aadcc	9d1a4d8af7a146a2a4eee4f1daa6d3e1	2016-08-23 20:14:28	HS256	\N
1c261ebb-9671-4795-a645-f2bcca510577	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	67b868fb64164a51aa135d46c1c95fef	64fb90d677c4403c8c3c2cc18b27c0a1	2016-08-24 00:22:00	HS256	\N
073b6b09-bf71-4591-a538-ef7a0459a985	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c7d2134b4a194c7293c054e8ac86f63d	f2aea707f4cf47498a92c65c3d176b0c	2016-08-24 03:24:25	HS256	\N
1310b24c-d97a-4754-aa84-b4b313ab7209	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	62aa0516232045cfa5b6323fa10d3980	e23ef44277914492bb94cf0a03f25363	2016-08-24 03:24:25	HS256	\N
407a9660-5402-48ea-baaf-51eada0e5bcc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fc8e675177ab43e5bd890f382d21ed65	75e5121ec91e429dbd90e1c107d04902	2016-08-24 03:24:50	HS256	\N
8d5974aa-28ed-488d-bebf-189876be023e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	544ceb5124e44c0688f40065a4634e8d	08723db100ff466799f80330d0f9c858	2016-08-24 03:24:50	HS256	\N
7edc96b3-bae7-4c8f-bc92-a33e97f1866d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cc0418476bb04fdd8d76150e8081c6aa	df534d7b3fa14e19a2a168e73a1a28d5	2016-08-24 05:34:06	HS256	\N
513aa3db-d50c-476d-b2d6-efd52b8e4eeb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	286296c97b4e4d16becd9afe01c359b2	d94f0873ce1f4d64a2ecf2502bae7aac	2016-08-24 05:34:06	HS256	\N
e7a69033-0b82-4c2a-b931-ce35cb0fe216	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a33a8598f8994198933fe8185ab49f07	8bc2dd8b94c14332bef137b3d3bd2cef	2016-08-24 11:52:05	HS256	\N
b7604536-f9ec-4d8e-b293-960308e3a3c5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	803944c776ed406685bfe5c2d850bc1a	412add366bb647fd8135529a53b65920	2016-08-24 11:52:18	HS256	\N
5460c368-b170-49f2-ae47-1ec58333e1c6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2c4d921a43d54588bce2724a7dd7fa7d	e70a624d6f1f49248f74358c37329c2f	2016-08-24 12:12:37	HS256	\N
05bcf7bb-4892-4ccb-816e-464eb7557a63	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	630d6d97467345a1af340d03d9164f4b	4ea4a3fbdea0482ab49121b5fc4eac55	2016-08-24 12:12:37	HS256	\N
3bc3cf6a-5a0a-41e1-aaaa-dba01be764a9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7d8a454748304555827418a8e8a563b2	b6debb1adccb4d9f939de6ee0320ee26	2016-08-24 12:18:18	HS256	\N
e1b713cb-c7a0-44e5-8015-93317132717f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e8109f04ce684ae7b9ef899036b839b0	589fc3a8cb7b40a59bbeb38e18504a4e	2016-08-24 12:19:21	HS256	\N
4db72f05-863e-4927-a8ba-051d38c8a5e0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	31b04e0e986348cc91de1e2488c934cf	f21462c4b31a4f26978c1d5f0c025fd0	2016-08-24 12:20:10	HS256	\N
019d9e05-4e00-4f7a-95d1-421462ef3e76	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8899c22ebd2642fcaf058cb13cca8790	a649d04499c9406bbd9c2a47575e8ab0	2016-08-24 12:28:41	HS256	\N
2f1fd11c-a01f-4395-a1c8-2dff6ad22d90	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b318a7dd0f644fad89d65af2f9fd1484	ba8522a4506f42488960f85f907aaf8c	2016-08-24 12:28:41	HS256	\N
fc223395-9749-498c-8093-ac19f4ccfad8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	74cee1e1d7a045c6ac79b7b729841744	829068d528ba4f31bb46bfaef047c9c7	2016-08-24 12:28:46	HS256	\N
fc4c6266-2972-4535-9288-b49f42ac110e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dbda9d027d414ab3aef1e6188ab29942	006c40ca059546cc83cf6ee513b2c16d	2016-08-24 12:43:10	HS256	\N
2831e542-593d-425b-804c-9589bbbaa8a7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d18456380793475482a5c91ffe011c3d	f8e9cf6fd7f942999f33f1fb494aec6a	2016-08-24 12:43:10	HS256	\N
f6d64237-7a1d-44c3-9bb6-a98f05bc24ec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a7472e889c494516ae884cd775ced7b0	8eae97005b96451597213285d88c8f28	2016-08-24 12:44:20	HS256	\N
6af89379-d52e-4cd3-bc8b-0bd950f27c6a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6c138331babe46efa69aa6113dec33a8	aa39d68f3637493dbf6b0c2c1a0eafea	2016-08-24 12:49:50	HS256	\N
f0ad1b99-a42d-4fc4-b71d-bfb9c4e57e26	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	36afc1043e3b475bab46c632395c213c	979fddc4d4454c2f9b5c27d3eda4a7c5	2016-08-24 12:49:50	HS256	\N
465a446f-b716-42bd-884d-15f44b867649	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b96c31df07cc45e095c4a9d8e319ad80	8329cac5f8b54a41970e3718cfd25180	2016-08-24 12:49:53	HS256	\N
98049d48-2d41-4138-b798-b0a7ebd183ae	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6a703ad4a1cb4ef58e3c4629e667182c	e2a4d89b71ad4eb4ba0d6677c41ff620	2016-08-24 12:55:24	HS256	\N
0a6feecc-1d85-4c07-9362-cf958f93f610	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	be8ab1bd0a464644b8329fd2e38906d7	a9a1667d43634681af8606750cb64603	2016-08-24 12:55:32	HS256	\N
e58c3b93-211d-43a8-b11f-3aa78b236ecd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3395f1d2cb304bbb8436ba04b9386cd1	440ba5dc2e6a4224b3777928e72236b6	2016-08-24 12:55:32	HS256	\N
afbe2629-5343-40da-902c-cdf4bc393d90	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bf73772b53294c0d927b2eda14e427fa	06dcac9ca4884474b7e5a7b6708693c7	2016-08-24 13:21:12	HS256	\N
f1bee891-8ead-408b-94a6-c3495c67e366	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	462be17e74bd405785b5b15842a20368	1e3a960fa1a7478d8ebbe6a397c63f18	2016-08-24 13:50:05	HS256	\N
4e23607a-fa39-4192-b3e6-04ec2e1740a3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7941ca002001456981cdad78f65b3a27	2e21656ad7b14a9f8a826436dc966d0f	2016-08-24 13:50:51	HS256	\N
7e933954-8f2e-4cc5-824a-4d4b05090ef9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4f5262e58fbf47a5bbc507afca185203	5b1fdd5875d3490ab94efde89fe598e2	2016-08-24 13:50:51	HS256	\N
c248b108-271e-40a9-a20e-d92a4ab11586	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9ce382c4a7ae46438bf9ca19f62cdc38	653a93c9e2774570a33319a5a4d32d02	2016-08-24 13:51:35	HS256	\N
70374f80-42af-4baf-9718-a60f6ea9caed	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a964b21545fd4652b7ca9ddb0c9249ce	0e9dc4bf52094ac98bd7720925074bc6	2016-08-24 13:52:50	HS256	\N
1f985cdd-622e-4fe5-ab77-187ecc544495	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	072d899cb1aa48e0be06fb320549ddfb	ccb0d852f2674db2b7e135ac29b46c7a	2016-08-24 13:52:50	HS256	\N
8fe4c234-e908-41d4-92c7-d90d1d943e3b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20d9205e8c4d453ab5f8033a633afce6	a3352c3e56994060974944f35149466b	2016-08-24 13:54:13	HS256	\N
20399c20-fd6d-4448-a2c6-1918396005d7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	34699fe378414bd1bb6c7278e629318f	54b8c48705e041bb9f2371b31381571c	2016-08-24 14:05:20	HS256	\N
990ea425-6ade-4b2a-8b55-39e4f8be17c4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2240872f233149c69e63527be05479c9	03a1c514c09945c5a19a270fea80a2a3	2016-08-24 14:05:20	HS256	\N
95b735ed-af65-40b1-902f-bf9a4ffde015	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20c879a2162342ccb0b456eaa1601142	be04d9c50a084fbe9356bb55809493c7	2016-08-24 14:05:52	HS256	\N
7aea50ac-4dbe-4763-8ba0-2a26c94401f6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b52ac175a4224c6185db2cf3963905ff	7ec889af224e484e9707f7c69ba8dd8b	2016-08-24 14:11:46	HS256	\N
77c1e69a-760c-4479-8ce7-3260626de8d4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4e9e5b3679e3443ba9057b61e1db4f0a	a84383f3565a4f0a8bf04368f5cd1a44	2016-08-24 14:12:01	HS256	\N
ff29b8c5-6c88-473c-a54e-9f306e222346	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a02d3d188565473b9df26881e9988229	67e3e6ac84d74923a487bef5cc0dcda2	2016-08-24 14:28:57	HS256	\N
a3aef0ee-a804-4c17-bf97-7f3440fd1868	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bd917bf7c5064c6a88eac576ea0ed4e2	6378b9f1479f4e19967093e74d700238	2016-08-24 14:28:57	HS256	\N
9719f3bd-12f9-4004-88bc-06e2262638b8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	85a76df493a844cea8b9286731e22b5a	f6b6151f1f6f4d6b90ace24beed98d4c	2016-08-24 14:29:14	HS256	\N
01887446-3984-4570-ba18-d394c24bd0d0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce7d339c4a9141e497c42704fe54908c	1f7d4d3a995445b8aad5a861ccd8f982	2016-08-24 15:13:17	HS256	\N
29dc6018-e12c-4967-981c-c5707631616b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	41640fdb2e9d4d7c9124738c318e08fd	a42f0762e96547a99f7f64d5762d92c5	2016-08-24 15:14:11	HS256	\N
3f8c8196-8131-4a0f-b289-5166ab3cd72e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0a465d37622249b19179b3555edb811d	b57dcbebdc3846c68f013bf797817e9b	2016-08-24 17:07:31	HS256	\N
fee920bc-d3d8-43e6-a19c-af547def68d8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	03ff949d427742c3837f2aadee848836	4cc30bf680594da689955241fd571dff	2016-08-24 17:07:31	HS256	\N
cc7cd6ef-9c04-4a18-b226-c6d4aed51f3f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f0858ec0897a405790ee2832219dd43a	7991124d961a43ad8ad4edd9a8ca5eb9	2016-08-24 17:07:44	HS256	\N
e3d742f8-82c0-4d41-81c6-adfd6d54b9e7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3e9ab044defe42cf8adba13a7f725475	efe7e1fc86a5460eafe73551c4199247	2016-08-24 17:16:41	HS256	\N
237e54a6-c30e-4f65-b069-f575dc49df97	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1bdfe789b27745e7addfb068c713987d	43c4bc140cf84af4b7e2b78c8d8f5b34	2016-08-24 18:04:07	HS256	\N
c69097fd-c5c9-465a-9f0a-73c56f86fe49	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	82ae801b84a642478c71cd3db5b40bd9	f5d692b5b7aa4d6997feced20c15aab9	2016-08-24 18:45:02	HS256	\N
8d214b93-4a48-4cb3-a5dc-281d0e864686	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4d289bf13fed41009df37f009d4dcde5	2a0197fa4b274e2ca333a774be9685d5	2016-08-24 18:45:02	HS256	\N
87c6a436-cbe1-4414-af75-c7288daad76d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c033479c917e4c36bcbc1ab5929f814f	8d86bbc0c870457c82a827a9a289c88d	2016-08-24 18:46:11	HS256	\N
cb39233a-1794-411e-b413-f85df98980f2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	45084cdc6b934236a6304d1ce8d6acc4	a0dcb4cc42234df591aeee95dd3356c9	2016-08-24 18:46:19	HS256	\N
65ec0ff8-2577-4467-af41-3e9f27eecb43	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dcd61c1d292d4c668867f87ae63662e2	e7b1ff9d7eb444b28373cd90b3ebd51d	2016-08-24 18:48:16	HS256	\N
3a265b4a-326e-4045-8359-6c9e471bd292	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	586476572b4645748a90c8faf3e69577	f2aeec5d48344220a9d6027d8150bd74	2016-08-24 18:57:33	HS256	\N
a1b64cd4-5a82-4dea-8f00-265d9b783377	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	91f12d183b3c4a38a94ce4a71b49f835	9650965f70db4ad0898958fe3c9aa91f	2016-08-24 19:34:34	HS256	\N
3d6ad94f-1348-43ff-a72a-bb22931ca52d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	838abf07988645949898bf59aed98136	f4415c515c47404abcd2846b396cce95	2016-08-24 19:47:13	HS256	\N
1f3c16d0-954e-4ee5-b203-4cdf64583052	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	74a45c6a2612457ea2030dc2516f4a1c	f9952e37da2843c9aa62fbd8572246c4	2016-08-24 20:00:31	HS256	\N
0468fb2c-52d7-4d8d-b69d-96560fc65ac7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c2594775fd56418fb966b8ca809ddee4	abb6e5574e344d80a8a8cc7686a070a8	2016-08-24 20:00:31	HS256	\N
28f387bc-70de-4de0-b9d0-16d31e645601	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1b4e33c20c9541f68a4274d035050385	5915f1fd431e463abfdd13391182ca3e	2016-08-24 20:58:23	HS256	\N
ce9ac5e2-4406-454b-9e81-4199af5f8e87	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fb83cba811e1441da07c3e53bb62802d	e06a2c0fa6894ef8914209ce4f12ee4e	2016-08-24 20:58:23	HS256	\N
d756859d-bb9d-471f-9c0e-64cf170e8211	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6bd68b31cc9c42cc82bb19ecfac804aa	29ecd79d936b4d119bbf0f75d8da23a2	2016-08-24 20:58:30	HS256	\N
61f47788-eefc-4cee-9e73-3ce0660af13f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	689ef3813d44459e851267f20d97167e	e3614a0cdd7c4958aafb2b895950217e	2016-08-24 21:48:42	HS256	\N
ff23ad3f-b8c0-44db-8d41-59a5806c3809	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5c85b993fd2b4abfacc4fecd22806f80	22205ea2010f401da8f3082aef3c37de	2016-08-24 21:48:45	HS256	\N
65db3fb2-268b-4dbf-a5ac-667c3b138701	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e95552ad105248da928582242ef9b32f	73fd244923104f22aa33cc10c52c5de5	2016-08-24 21:48:45	HS256	\N
e1ebb32e-2fac-4a43-80e1-5f3769a46592	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a718f7712ec848b794f80f3685fdab4d	066f3590318748a19ddf6658c33c1cef	2016-08-24 21:48:51	HS256	\N
a5cab6e7-6749-4bb0-a4b5-45af6a115eb3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	541ccae4c8164eb682804f80e297d0ee	7df1fe6f7b93430faa8bdab835759311	2016-08-24 21:58:12	HS256	\N
f39b2c2e-fca0-43b2-95eb-c1c19219a1e0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e722c589ad5048e486a9c825b22a877e	0696dcf1c8134890be49e3af26da9662	2016-08-24 23:08:56	HS256	\N
03281ec8-e71f-4004-80ed-1fb54e2b461f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c23e7209d28d4657b6df65e7e0823952	c72808061c184fec922db95613c642a6	2016-08-25 02:03:51	HS256	\N
d25b2c10-5d98-4889-9fd0-c6b93f92e4ec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c07f315c9d6b4100bd3294289f4c7a0c	3e67cdd932db41328aa2376cd4bba048	2016-08-25 02:03:51	HS256	\N
4fce5deb-8541-4043-8bea-56ee2f82eaec	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	313c28a5b0144e9e81181133ac14bb6c	757d81a6d82c4e48927ec0d1e6911251	2016-08-25 02:04:50	HS256	\N
81fc635f-cb28-47bb-a8d3-2cdfdf748a61	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	082d62536fe94ea496a0778e15de76f1	d10527a498334ad082e91b8d9bbce12d	2016-08-25 02:09:34	HS256	\N
201024a8-0ca9-4554-8fce-936f925917ad	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dddb1b0d8e74404980418c300482c9d4	21d5329dab564ab3bb1ad6e15027eda8	2016-08-25 04:11:19	HS256	\N
85b073fa-1d16-4524-b465-8466c89cbd4b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5376b8c2a35246d8b7356a7f7ab4e2d1	a85071a9c7f744c6b97723c3f913f747	2016-08-25 11:40:00	HS256	\N
e84afb69-6b3b-4189-aad3-b8dab6a01dcd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cad777bbf32b45679d56206219a98135	450def41be704ce280ca2edbb35f53a1	2016-08-25 11:40:05	HS256	\N
218c796f-5585-47fd-87a3-f8de1eda7fff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	184423d5148746ea8fa531e7c5a62bd2	24383f6447ea4d06a307f58d0c563f3a	2016-08-25 12:16:51	HS256	\N
e88e51d3-33e2-4890-8b0c-420f87f1071c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2617887f9c3e4c30a1fae4de0fcecc15	8a1a667aff274944b4b1dfa1791ff415	2016-08-25 12:16:51	HS256	\N
ad4d054e-2514-4185-9f8b-65d80ea4911a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8d9ec3eaaa0b44cf84c319635ed9cdf5	ec275e5258a54d45bca6cd6fbc0ffcc3	2016-08-25 12:16:55	HS256	\N
87774631-cb99-4f80-959d-4cbcda93e39e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6f12dc2c2e1c4f1599f170747f1dd1b4	886f22e52485478ebc311da2c068ca14	2016-08-25 12:23:11	HS256	\N
01135cbc-1778-4225-bb18-0745cb96a737	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8dbd50624066458f96eb02246e4d60d6	f326d8cc0f18496493cc0a541924d228	2016-08-25 12:23:11	HS256	\N
f946dcb0-96bb-4028-ab70-ee39096e0c16	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	267c9f2f321949dc8ef03e0714a3d56a	163e72ec308049c3ab31e71c5b982a5f	2016-08-25 12:23:31	HS256	\N
3891fe0a-7e69-4c33-a473-8c4c60000d1a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f08b8d2fedf14cd39b845aadc78a7a50	43bc07ae33484c14875ef07e7b8b8749	2016-08-25 12:23:35	HS256	\N
9047c861-d23f-49c2-b39d-5dd2faf25faa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	65594796499d457596ee6636b6fb2c04	e96f57defb4d4d9ba36770d956010ac3	2016-08-25 12:23:35	HS256	\N
cf043034-ec72-4ba7-b804-cf52a08f1561	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3fc82d155a72427ba08184433d3802e1	278c479c33b944589b21c3cac27d4261	2016-08-25 12:23:44	HS256	\N
7f636868-5f25-43e3-91c4-39ee517d0719	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	188882d926a144afb504bc559b528c82	91d8b88e9c684942b161ef306e113b02	2016-08-25 12:30:46	HS256	\N
2fd1a25b-c87e-473f-8355-c1e79ef29d8d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	02966533734d41c6bc92ddbff33203c3	f6379974708b4372ab716763cde24639	2016-08-25 12:30:49	HS256	\N
3d8d618a-aade-4aa1-bc62-24ae7dc6608a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20b9c1322e3649a9b440f4e1e8ba7ed3	349dbec320e341e4a165fddb57b6f0b1	2016-08-25 12:35:24	HS256	\N
cecc2a47-9a82-4484-8252-35e2377cf026	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	451165f51f7a4d1d9ca1ae52a2a4fe61	bbf947a4d0a9423fb9516983d5b356f7	2016-08-25 12:35:24	HS256	\N
0b621707-adb7-422f-b9ee-65256e5c1e04	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9dff5b23dd03406eaa8cae2d73a3d465	d4fdb5f91d1240e1bb2d6f714e012f80	2016-08-25 12:35:29	HS256	\N
484aa80e-5573-4595-94e9-490cc6636f63	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4736ff93da8e47409795b45354afe02f	cf2bbead4b184c8f8b758e81c42aa85e	2016-08-25 12:59:22	HS256	\N
3219e110-39b0-443c-8b43-4bbe50357112	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cb3797f64101470e8f3631bde3be9c61	0d86a76e1eb046c198c3649f2304f19c	2016-08-25 12:59:22	HS256	\N
d0be6d8f-bb35-42bb-9696-6ac87eda7043	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	457cdff395dc44ca853119ae62443ed2	6f3d9cc79cf74e61a4c9d74698d395a3	2016-08-25 13:00:00	HS256	\N
a98d7b86-6092-47f3-bba7-0a7602e7b99e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a456bea4e78040f6a930cb93a9f080e1	bdf236604e5b4530b0bf8197d6dd597a	2016-08-25 13:00:00	HS256	\N
46a48c81-c3b0-40fa-866a-2b49f9edc9c1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	83821c7c6e604505a7fa66f4b850ff37	0dd1aeeb89a34b8ca5b3c012b039967f	2016-08-25 13:00:46	HS256	\N
ff8ae930-f325-40bd-bddb-bab7b9607b10	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c81bd57a3a4143239c1ee3abe944edf1	abbed1db60e448aa833f3b5e65092bb3	2016-08-25 13:03:45	HS256	\N
ead13a28-4564-4070-815a-3f408ce5919d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ed42e3c548704b28b30535b893504150	50cf119286fe4fdf85b4233157373ad1	2016-08-25 13:07:53	HS256	\N
831dbc57-d70d-439f-a58e-aee1da9eba1d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d15edeb8617d453b862457907ba92d70	51cd4d3c330d43b2bdf21dc945ffa73a	2016-08-25 13:07:59	HS256	\N
4d0d6ff7-731e-4bdb-bb79-9550dfcc04c7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	da02f8743e5745f2b8b00ab000172b0d	3ae23fdc27ab4ad182a6fef04d1c7c58	2016-08-25 13:52:58	HS256	\N
b91a9cd3-b55c-4507-9105-e1fd36b94ca6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8c7650388cf641e5816f8f729d2c989b	31501767cae749e19a753abdc272ed95	2016-08-25 13:52:58	HS256	\N
bd2ca2a2-d550-43c0-9261-a6fe6a5b6e53	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2fcee20e6dd242288d76cbbcf81ea8e3	c7a7825c2586463bb53bc65db542fa46	2016-08-25 13:53:31	HS256	\N
b049c7f1-0c20-479b-98c0-52a3fe48085f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7aac5bc4820940518bdef58d2cd97264	b3debed432c346238ac67bc4782f27c3	2016-08-25 14:11:21	HS256	\N
70d5f1c9-6d54-41c9-948f-7b7c86f514c0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	405828d67ccf4de5b5ffa84192c2be18	61a842424454467795a5174b02546b91	2016-08-25 14:11:21	HS256	\N
a82680be-1328-46f4-b443-efebc5f0240d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	37fe37de167547a3bad32a5293b270d4	731ebde5a1c348998123022058d34ddc	2016-08-25 14:29:14	HS256	\N
ef7c97d1-8327-40e8-afd7-76c14be83d63	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a7d0b8bb2a1142669af938714cdf4e98	2ba7047112fb4ce2913973e0110ddf5d	2016-08-25 14:29:14	HS256	\N
2a272dcb-77f5-494d-8d0f-cde96a8d6436	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20092fe572dd4868a4797323c699c8b0	e0dbe22ca1c04ceeb43e548aac752b81	2016-08-25 14:29:14	HS256	\N
241a4a58-06d0-4f3b-9444-52d08cc6728c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a044e3bdd4674b5eb29276425badf7cb	5a748e7cd48e4039adec45af2172c656	2016-08-25 14:29:55	HS256	\N
d2ea2f95-f13e-4120-956f-a1c61f16b7c8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	870aaca53374428e8c8c3d18cb70df86	f48de1993d054e44a73a23869f732e89	2016-08-25 16:42:03	HS256	\N
61e193be-a588-4b57-9a2c-d05c2141fbe5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b7a70b67e594458d97e28baa3da3f634	1d81873582774da689b28308dae8b981	2016-08-25 16:48:51	HS256	\N
5708ce9e-f837-4c91-b68c-d2ee1cb3381b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e04c675aebab41608bac426573faeddd	a33f8200aaf040b49a721783451c1aee	2016-08-25 16:52:00	HS256	\N
677fc3a6-69ff-497a-b4ee-261f85901562	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1bcc6a1006384e4192f7852e41db76ff	1c9bb3fd808349e6935da9611771f86b	2016-08-25 16:52:00	HS256	\N
f855c148-6e2c-4c7c-b1f7-36fa8eb68d4d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c61e1b4ffad14050a9738fb5ada4bd10	884550b0244e4580a40c8a65706ea9c5	2016-08-25 16:52:20	HS256	\N
8186d3bd-4d05-4f28-b0d5-b04c25a3d4e5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a4f8d090e8da446b8522472f11dfac2e	130a23ab5e0441b69202a4c24c8affb6	2016-08-25 16:52:20	HS256	\N
870823ae-7b5d-4d5a-a0ed-60b9b1b1a354	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	37c1c0320e6d45db829a1f6d817c80c8	7f9993bfaecb454e9aae16cd678e5528	2016-08-25 16:53:20	HS256	\N
1ac10202-23dc-4472-b77e-b446827974a4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	18673ece556e4f65b80b8280b0ac8ef6	47139af5cd2e4574a0ccf2f00e6eb21c	2016-08-25 16:54:18	HS256	\N
3eb9acbc-274a-4419-b0ce-54968c325778	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e7421e9009ab40d4abee2c18b181ca48	825dcc557e314d90b9fbb6b4ae088517	2016-08-25 16:54:24	HS256	\N
9f171508-69ff-4af9-9d62-ab0b36c04747	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	729e556bda8b4aa99ee27ee8d75f298b	985bd5bf30a04e1aba5e0e3447de7d47	2016-08-25 17:00:09	HS256	\N
7594c357-a61f-4894-92d0-d022c8c7ec70	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ede15998b41642f79f33d10922fc9825	149e898073634bb285e13fe0d4240a74	2016-08-25 17:01:16	HS256	\N
89d8f77c-ba9e-4704-b731-f83d716df638	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f9c50c2438c549559579755518fd0330	de32506e71bd46198505af358255cea9	2016-08-25 17:33:01	HS256	\N
0ca8655c-b36e-4cdf-900c-85ae33859d6a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	383d6909a090436c86b9ed4dcb4582c9	206a4eeb943743d7849871ede2c1483b	2016-08-25 17:33:01	HS256	\N
a9eda377-f004-402c-8bc5-092e6d14fbe7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c1879a3ed65749a8b1d1043fea716ccc	b0007a4f87264ca183735fffffe0f0aa	2016-08-25 17:39:10	HS256	\N
7b777af0-1989-4ad8-909d-4a3b99da1d47	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	74e0d73435c9496ab86232e8ea79c0ad	4457d59716c343d2bcf142a33a163c32	2016-08-25 17:51:43	HS256	\N
81353213-32f6-4a61-86d7-60403507ae76	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2cba92b9526c4f6eb284083cbfdbf51f	23644656171a463bb7c7e785f88d0dc9	2016-08-25 17:51:43	HS256	\N
80667110-fc55-4ff0-be79-9b6c96aecd3c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	697e5dfee2684120b90efd8af5b2042d	8900e1b03ee7406f9585f88803fa836f	2016-08-25 17:57:26	HS256	\N
f39724c9-9547-49b0-a6ba-adbf51168339	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b3ab0c7ac48f4a6faf088be193b5453a	4dbbc56ef8ed43bc93b4d0599751b4f9	2016-08-25 17:57:26	HS256	\N
1e264384-dca5-4695-b586-571d4a4fffb5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ea15206b8c4b456cb96cd43648772ff1	2f3cf7d724754192bdb9fd2bf76547ae	2016-08-25 17:59:32	HS256	\N
434e146e-0bb7-40ce-b68a-9c4f4ea10d46	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b423a87f8c0e4e1a9f8a2771287bbb45	220d5bcdf4d5470b975b8229a44acda2	2016-08-25 18:00:24	HS256	\N
14b0dfac-7461-49b9-8486-899e12bd5784	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9ee6d28679d0484c97bcc6f45f984086	4306fe4da4f6446fbc0270b1d9b0eab0	2016-08-25 18:01:38	HS256	\N
7d423005-807b-4644-b383-3f8828765274	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	04483aebea8640dd92cb9eb5530442ad	6852127a2a6a47318644213b3faefc19	2016-08-25 18:02:55	HS256	\N
cd98fa15-02d4-4420-83c9-3a02591ee1e4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	416dd470f10e42b8a9b2d005a1219f40	25fa0d6980ce4cb1bbe577ec525fff0a	2016-08-25 18:09:40	HS256	\N
1a0fc91d-6446-4a6d-838b-5760a96816db	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	abb9cb67a42d40d596621a59324c5003	8d61c03b86bc4c04ae6b98bc2a88ec73	2016-08-25 18:45:20	HS256	\N
4bc17897-b364-43a9-a417-31803b10a967	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7fefb88394754f98900f8634183a6975	1b4351c42b074665bff2866395c2f04a	2016-08-25 18:45:20	HS256	\N
2b5f9b5e-c1f1-49dd-9b06-9baee76db775	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	24092af651e142d886a001eb7d6f2f21	8696f2dce55340eaacb7c9507bf49574	2016-08-25 18:49:23	HS256	\N
a80dee8d-ca6d-45d3-aae5-7cb9c992a316	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6ad69a85a94347f8abbcc7ec2c8f5dfb	c7e4d7183dcf48078840f506d7cc3ff7	2016-08-25 18:49:23	HS256	\N
64fa8241-0e71-426b-8f5c-9b0d433c5780	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5a0da6bad060499d8e56119fa78830b9	4731e451af374591965b884d3a90c53e	2016-08-25 18:55:28	HS256	\N
4cb1e8cb-5050-4517-b62b-faeddf60a985	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8d6dc50ad2e54ef796e3ef15fcda7aea	7617359912854facb6cbba9d4d6ac1d0	2016-08-25 18:57:05	HS256	\N
fbf3c0a5-38eb-4ce7-bfed-d68a7aa2d06f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	121bb8fd64f34fc3a9e34e45c5a5e7fa	d1f584f336a54e68b8f6ea989ba646c8	2016-08-25 18:57:05	HS256	\N
081b0a36-6eb3-4fda-805b-8d585924ff04	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b534f3dde0b140ec9a5d8b3eb4bff4a6	0883f588a577410b87301405fb69f0c9	2016-08-25 18:57:23	HS256	\N
a218babf-b557-4173-b184-27f0a4c859d2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b1ebdb69eb794e21966ac8680110ac81	fe28373482744f988d5f329b39d1c824	2016-08-25 18:57:23	HS256	\N
6d14e92c-e021-4c04-976b-0ba5a8f1cd71	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a4628baf394a47b8ba317509dee4bcf5	f4da2059761e49ec8c2a558911cfae58	2016-08-25 19:01:30	HS256	\N
708512d0-7899-4068-b6d0-29f0059aeab0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	38d8bb93de2c4bd4a28c5d7a092a684a	16b871bf21cd4fef99d525d5f389b36a	2016-08-25 19:08:41	HS256	\N
97bb58ba-fcab-4307-a58e-e6235aab217c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d3be59bd3a1b449785358b3eebff038f	dbea6664914c4e53b17f4c1dcb73d63a	2016-08-25 19:08:41	HS256	\N
c904af08-f726-4228-bcee-147e393f2631	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6f4fd44c03b640518ffe42b83ab3187a	33a26fce8f734966964aac17eb6cc69a	2016-08-25 19:09:01	HS256	\N
b0a6a897-89da-447d-831b-e4290ff9f07f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a4fd5cc0b109453f8d1a595dad403dc1	61e0378516444f0ca5245875c3ca95a6	2016-08-25 19:09:10	HS256	\N
20e3fc6d-8a83-4052-bf4c-b3ebb738fafb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3c3b3c8e9dbd4d35bc84a8d70b6b025c	a2fad29e508f4597a48dd5b645e7c325	2016-08-25 19:09:10	HS256	\N
7ab1a3e4-1290-47c5-9276-afdfa590930a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d0bb39379cf944aa9d286010da2eff01	6866ade92b734671809d19ac07a1f040	2016-08-25 19:11:29	HS256	\N
367e5844-338c-4dc8-95cb-12f311be97de	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b8f78941861840f2b510fd61300c5272	abd5644c8ea945cdbdd99c54a141e7c7	2016-08-25 19:13:50	HS256	\N
a524f9a3-fa6a-492f-a282-5db760ef28ac	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e9cb696db96e42c68c7ab1aa5f396472	8d86d44ebb304e899ffdb36f4144c15d	2016-08-25 19:13:50	HS256	\N
ffd8c13f-5925-43ca-bbe1-022de935ef4b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	921345fef6d54dd898d12d8dacbfcc6d	61ae53ad5b79492faa83553cd98cc3e2	2016-08-25 19:28:21	HS256	\N
6e5f2119-1a40-4d3a-9f32-1a7b293b99f7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8f65a9eec4e74132993691f5bcd22ed5	52a5605aae2a470894c4a898241f6e4e	2016-08-25 19:28:29	HS256	\N
37d222dc-1352-41f4-9387-c7b55674cac6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fbc80e4ae5c54298a4d230a16042e661	197a254e2f0447cca490d331303ce060	2016-08-25 19:43:36	HS256	\N
cdf62c73-ffc4-49ac-b014-fbd564a52a0d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	085ccca2818f4c56a93b172c58620046	ad0eccc72c0a49fdb12028a58603c006	2016-08-25 23:51:21	HS256	\N
f9375efc-25ba-4fe7-a0f4-708f61e29185	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	44fc382484cd491dbe4b37ddf283233b	49304e48c1804db58a256a0d1538a887	2016-08-25 23:51:21	HS256	\N
4f381597-b64a-4d8c-80c8-8b74ded9e767	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dc76ba5caa3d4548bd87cbd8eadacf43	3831a03095434302a6d58c8aec329aa1	2016-08-25 23:54:00	HS256	\N
640b3b39-dbfb-4ed4-813c-e99c9f099e43	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a2f58c4b11644bd797208ae5f5a7e4a0	5e30942247bd47fcaa09ebc9fa55554c	2016-08-26 11:07:49	HS256	\N
40fba75d-981e-480c-b080-70f3c6a39cb7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	acd4d22337f548f7bcd503f8caaa83ae	f95dfc3510c14f2d99d5fe43833f5ff1	2016-08-26 11:07:49	HS256	\N
63faa177-4d46-4ea9-89cd-fabf1e3965b1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	178f3ca708ec463a82c16858570755b5	6f52f2a90f4b44429ab465fd0eb8493e	2016-08-26 11:08:01	HS256	\N
d0c7c939-b692-413e-981f-ab06ac7f081c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9eff897fe31d4b8d900e1c83865d8afd	bab1a91811c44a8d9567075a25d9595a	2016-08-26 12:01:12	HS256	\N
7f15e7e9-bd54-4374-9e07-33e494ba5206	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	91b8b4307c354d3185a871255832bf13	96133c276c964fd68027f57787cefd8b	2016-08-26 12:01:28	HS256	\N
6310723e-f7bb-4e30-8a0f-813c967c77e3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	87a24a6b2cc342658731a4c3f959fd30	aad50ee0afbc41b08488071a604a4f34	2016-08-26 12:01:29	HS256	\N
5d1a5a53-8aea-4ab2-bd7f-9920603066d7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5cd2326ce71249e1bb9bba73a2c39e64	a219a75b8ec84b7a9736a0e8e3aa703c	2016-08-26 12:01:44	HS256	\N
43a1ed18-5f50-4e2c-9d62-9502ac556afc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4b1cbc6d4a764ba8a1aaaf08d01ec532	fbff4f9a4d404b50ae2b7c6d655846fe	2016-08-26 12:05:38	HS256	\N
7affe723-5172-40ed-8320-fffccfe7788f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	01ce393ac58a48598a6a9b8c22761038	c5e2bd0c64fa4b51a3ae84deb631ef59	2016-08-26 12:05:38	HS256	\N
ddb28ccd-52ec-4154-b468-3ccc42fa32d9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	94b06921ba464014888b65dab94da84b	1262677eefb2493db50460ae07e8d46e	2016-08-26 12:10:19	HS256	\N
48326d16-16fc-4275-9709-b9bd6e8ba548	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	46637b27a787429cb170d67169d531d6	fc16fcc98e5148d5a27e354fe00ab496	2016-08-26 12:10:19	HS256	\N
753008be-9fd9-48eb-9ff2-44e7aa9f489f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fc7956ff9cc84070832b6bfdc58c0da3	807a8eb948c7493e83621bcf9c382518	2016-08-26 12:10:21	HS256	\N
744058f8-3559-4cd7-8d4a-cfdf4124b70b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	408b8679bde14513b7a6335e2ee7d900	93516957105646bbb89ee7604a1d3155	2016-08-26 12:14:18	HS256	\N
c633d937-97fd-4d78-b07e-62da9978c9cc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	18827be2361647efbe5f85081ac2ae3e	7cdc8ea7e64e4c8aa6018fbaf24b75e0	2016-08-26 12:19:51	HS256	\N
a6947d3c-2e54-4498-ad8c-91e00d33ec17	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	491263b958a243c0b976f574a492b730	31ff849f6ad14951927eaa7514214ace	2016-08-26 12:19:51	HS256	\N
0483f1b7-d2a3-4d95-bfe4-9b93f40f9c53	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	753cdec467a94f7d81c4eb09f7b8a9d7	a5c431c85b8446c1a73f26aa4469a982	2016-08-26 12:20:00	HS256	\N
db254cc8-8beb-4094-8913-3e2ab9b15912	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	954389ae39e440738e0e807d6ecfe026	99453fd214954be68615602d85c1685e	2016-08-26 12:21:35	HS256	\N
cbaba2ad-b916-42bc-9a76-792552cc2856	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3aa65c443d0a410eae0bcfab35e89d44	e77d865be7cf4f46a5b6b0fc32736f87	2016-08-26 12:21:35	HS256	\N
122d4ce3-71ae-42de-9d58-914e169a77bd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	87359718ea894a6db4b75ab226b433dc	174cfebffbe44c52a51269489efc5faf	2016-08-26 12:22:36	HS256	\N
94b94ece-23cf-4fb8-ac83-4e16ef20a6ab	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	02a775830a6d49568d007a80e7ab6f08	bbb90a76b6f747cd801122382a076a78	2016-08-26 12:38:01	HS256	\N
bc6c4670-37e2-40a2-90f1-eac490f3f85f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a2b26b63c26d428ba2476dad17cfeb7f	edcfa0b9184a432db85ffe80cd21630d	2016-08-26 12:38:01	HS256	\N
e4217138-b557-4e18-bb22-3d0c9ecae4e0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f608eae148d0491cbee55d4e66db9092	bb5009aab3b042edadff9fc77919667e	2016-08-26 12:38:11	HS256	\N
6ab73f20-5891-42db-95c3-13439e572a5b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	13cfb7c1574d441291b91d7c0ced389e	81a8577281414fd89a2001491738d76c	2016-08-26 12:41:41	HS256	\N
b015f42e-6824-43b0-824e-1be045efddab	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	26d33a057f294000b0cb45cf543a7a6a	fa988d31d25942e08e5d94a6287531cb	2016-08-26 12:41:49	HS256	\N
9f822345-e922-4df7-ae26-39ef7fc550da	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	76798b5e24354f2e9a3208097693b941	d214d101644a45c881cb4c51bb3f1dab	2016-08-26 12:42:20	HS256	\N
a4bd2f1f-2b1d-4038-b613-a110b63b89a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	01c79a61f58e48d984ff41f99adbcbb2	f011a024c9fd4a34b7bdf109bef4abee	2016-08-26 12:42:40	HS256	\N
9e4aada6-5d8f-432a-93a1-6048fb5e0001	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8e8f83126ab342bd9f54caa2bb2c6523	5534402c9e4f4c49866847acc5c91f23	2016-08-26 12:45:25	HS256	\N
331dac38-681e-4ec5-8cec-605a68d7cac9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2dc3edd519374b5c886e7ce781de6af3	7fe3bbdeb6704261acb3003b8a2fdb24	2016-08-26 12:46:02	HS256	\N
1dc2243a-397b-4440-b6e5-ef5b5878a951	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2bc9d893025d47d487022626b2d18045	835e610728dd4ffe90c4b85a2d75fbcc	2016-08-26 12:53:11	HS256	\N
87021e66-5c8a-4232-af26-5d1d0e244c81	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5ccf68d965db435dbc7dbc67e5a6f9b9	26da4f3f435f4bd69904f51eb48f2cb7	2016-08-26 13:01:27	HS256	\N
f9a78263-173a-4776-897e-3684732e77a9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	430d61af4b2b43f39ceba02e81bfae72	7ed2c05efdb14971b3ba37f44824d05a	2016-08-26 13:02:48	HS256	\N
ddd8c0d4-9ce7-489c-84c4-780731a78097	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a8eeaa83bd6c4504aaa32c99103a3f0f	2070d9c5ea934b429f41a58e0f14a011	2016-08-26 13:08:21	HS256	\N
8a346d10-b407-4ca9-bc0a-ecd077fa219d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	98b8a7fc6560463fac5a90c29c56ac05	094188451ec1400eb3bba1c5da4ec5b3	2016-08-26 13:08:21	HS256	\N
e4928543-6384-48bb-8988-eb67982fc52d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	61ef41601e5a43f193e1160c100f8c22	4e0b2d24eb774260a80af6f9fe9ca199	2016-08-26 13:15:17	HS256	\N
9c58603e-192c-4115-b18b-6fd4f529744e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3867f0d15efa49cf8dbaf2c45936e66c	607638961e4d47769a342292f33958f5	2016-08-26 13:18:51	HS256	\N
f0dcc866-88ae-433d-8e17-25538aab7644	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e4a1521f35bd42d59ed78d9268b9c6ad	c2996615ca4d48409cfb77097cccce5e	2016-08-26 13:19:00	HS256	\N
137f4adf-26e2-4f74-b398-e9c4fae34546	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	abf341a9c785499990f838ec98f219d4	3051ad914ec34e4ba5908641f8a06e64	2016-08-26 13:19:00	HS256	\N
593163dd-84f1-4a3f-9364-6b6c2cfe1ce2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3730ba94ce3d4d38a0e073170a5fe52c	21718caa42684d67809539734eb5a653	2016-08-26 13:19:07	HS256	\N
ca369030-fb23-4044-abb9-a08c02d3d6db	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e629bed165414e0e8fce81752cc62ec7	c890272f797848ba90492f61604fb554	2016-08-26 13:36:21	HS256	\N
9540d974-0f93-4a16-b6d0-612d641ddc59	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3ad34e639e084802915e46a37370f33e	92e2552edec64e9191123bc49401ed31	2016-08-26 13:56:18	HS256	\N
d0ed17a7-eb3e-4967-8cbe-9286b3f9367a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	22a0ff9a271446f2b91790ed1ecc9654	cecc587153ac4703be1ee58e666a0e8c	2016-08-26 13:56:41	HS256	\N
61ce360b-2584-4790-ab90-9d2e86bc3ac1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dfff2824367249e4ab71e60dfb9e43df	1847fa5db16345dab3ad3b716cc86e5d	2016-08-26 13:56:41	HS256	\N
7e036290-d732-4bf7-8ba6-54f1f8ac4b90	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1098c0b341164032ab906b0a281e827c	7e7db314c8814637bb398499696d89ea	2016-08-26 15:31:37	HS256	\N
98564792-5cb5-4dbe-b82f-bf865a444b6f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f5ac3115451f43419f7a81d010f5f7ef	3a906352db494f65af56249f2e457271	2016-08-26 17:02:20	HS256	\N
cfe21070-7e14-4ffe-9981-bce9ec1873ff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1d491d8822bf458586f077e25f1480de	6ee5886a962940c79b82db94109970ed	2016-08-26 17:02:20	HS256	\N
276ca1b3-9c09-4134-bab0-67e804cebbc6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	10e60b77d76c4f38a3f8c263f9926e9b	0bc1472267204061a1ce6be8354d1a66	2016-08-26 17:02:40	HS256	\N
e88e9ed8-c572-4170-8440-726826606c06	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	302def4b94d74d51bd133caf7a157763	d78e0781fb27477a84a09a47531173ca	2016-08-26 17:02:40	HS256	\N
4e7208de-0101-4745-894c-e066337119c3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	74bc249ab85a4f9b80d4df6829d8a373	5cfc54107e4b4c50bed5cdbb437e20b2	2016-08-26 17:13:31	HS256	\N
0f808bdb-2ea4-4fdc-8a19-6bff392dcec6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	48d3a814e2fa42f698f8e6e4986c00e1	9f634c9420d04db199d5a6f03f82aca4	2016-08-26 17:13:38	HS256	\N
96efd751-56d4-49cb-a220-1e0dd7988197	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	64e6eb49939e4bc0b4f8b3036cef3883	7f74287a566749fdad6036f4ab81d12e	2016-08-26 17:13:38	HS256	\N
0acbec5f-ba3f-4711-805c-749d1a9264d1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2adc7501e9d4490c8f3dd4b7336efc98	b742866d8e284517ac5ff9141aecbf1a	2016-08-26 18:13:25	HS256	\N
ce2b0413-1609-4bf3-a2ed-6d1792d3244b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6c16e9a02f814d01bb3aa98ac8399443	b11aa4607e13453e9c007343e666dc0c	2016-08-26 18:13:25	HS256	\N
fd08a9e8-06cf-4e9e-ab2a-ec8015a4facd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5aa92c15d7514cdf97d50ab6bac3edc1	bcef6d6a2c3d4d338412087f09ba7a75	2016-08-26 18:13:36	HS256	\N
8f875f2d-16d4-4362-8b32-352f42c6649c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9e819c8fcf83471f8afdccca58551952	e237284d74b9445698fd1ce7ce14d5c7	2016-08-26 18:19:45	HS256	\N
aeb2f619-5483-4aa8-bc0e-26d9bebfdffd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a0f404f28b6046dcbd4d7dfb0d239fa4	c8f5b2ffe5964a17897099a04b17a8c6	2016-08-26 18:19:45	HS256	\N
06e57f4d-9816-417d-a864-c3f73ba6a45d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e4a27b4f916347af95b0750ea57bf450	61adcfe6f928436ebe89f59183e96245	2016-08-26 18:21:57	HS256	\N
e3f9eb1e-d060-4a2e-a9b8-d4d863452528	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	463dd46d18dd4ff892fd07451165b3ef	22c259d8cacb45a7a40feee47d8cf639	2016-08-26 18:21:57	HS256	\N
18b1f0ca-53ad-486a-8fd6-1912ce9b1098	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a483d45819904d02b43d03ecb7e28c39	349a43068b1c4a5a89c47bda1d2cc098	2016-08-26 18:30:39	HS256	\N
a279e307-5507-4dbe-909e-f78b4bbb15ea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	945209daf17b4c64afd3040ceb7934c5	665650147f7b47dcae8ac6332fdee20f	2016-08-26 19:08:15	HS256	\N
9d0294a3-8c48-4dee-8d5c-4dada683b767	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dcfb40623ccb4babab0ccfe50bb394d6	a510ab2739cc410ea32e6033636f9b44	2016-08-26 19:08:25	HS256	\N
93176af3-de6f-4fed-8169-496298b91afe	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ca3dded7764442b2a5c34774a965f579	ecbd0262a5324edfaf6e5ee8753d9157	2016-08-26 19:08:25	HS256	\N
a8f68e0d-9d45-44cc-9abc-86b4c9f4c3a8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	26557cb38f38470fa7cff0d684685157	d6cb49cbcbe54371a55a081121ed0924	2016-08-26 19:38:05	HS256	\N
e9e4a7d7-832c-4c62-b2fd-18a639dc0064	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ac1601f599d347aaa7479e406021ea30	49b0d3c411484c61ae5b4bde98c8a87d	2016-08-27 17:44:11	HS256	\N
c1cf64b6-f86a-46d4-846d-ddfdda71253e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d038916f30d74139bf2c6c773e112f08	5b15d0dbeabb47c7bd32bce245212364	2016-08-27 18:35:55	HS256	\N
75b8d242-8be8-4469-9e2c-1a135e044b37	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a3ac774f36f84b578ee28c90f6118257	f9b0b130af6840acbab3a90db8abad61	2016-08-27 18:35:58	HS256	\N
4e417863-5e70-44f2-9da0-64ab0d834ee3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	748e898c52d0450193e9db393576c9e2	7b008734577e469e83dfa7a94a2844c5	2016-08-28 00:32:06	HS256	\N
29d1c9f1-0f1b-4d90-8f93-1ff40ffccea3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	05538673974846f8a1e30cc98747c45b	4261de8534474dd0bc93299b940d7e93	2016-08-28 00:32:06	HS256	\N
4d03bf33-72af-487d-a475-190666525fcf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	67a32d5b90b64605a5088cb6acdf2361	f69c53e0a35c4a129f4851070aee39e7	2016-08-28 00:32:32	HS256	\N
8bb92c35-9650-4ab5-84f2-6563baa072a9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	281f826140924da3adf233147fe999a4	7bd8adfa5beb404bb4b69aa2449854a8	2016-08-28 00:37:04	HS256	\N
16c5c4a9-fa68-4b94-af10-45bbda099976	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bf61d5c320c94a49a4639119d4108c47	8f26a2ec3d0844dda9b816582df8d4bd	2016-08-28 00:37:04	HS256	\N
f2f3e359-fee0-4973-aefe-fac9d9796887	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20ea41ad26194dbeaabde9a009c5790d	0d1e8533374045b29bf8f179c6a10301	2016-08-28 16:49:19	HS256	\N
b05961c2-0f92-4e55-b3b9-abf7d8bae26a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ea94a0219cb54525b128fe7012357534	f0b6f7f38c3f4427a2654723a5ea5779	2016-08-28 16:49:19	HS256	\N
6972d1c1-3aab-49cd-8ee1-bd2d852a7191	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0f4b90b9f8f74f3e81cbb3e7edef01c5	e51692ce0f8f49f59e2dad2a4c2b7cec	2016-08-28 16:49:27	HS256	\N
29e30756-433b-45a1-a8b2-e2da97e51d28	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5200b41a63ee4a8a8609d781860e238f	7ada71a357db4e36889a26b3db0ec464	2016-08-28 16:49:27	HS256	\N
68751bea-4d51-4053-8a39-e9af0dc34821	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a9e4dac73ef84a3fb8ea9bce61b023ca	7672960ed776442a86cb597f093b6b0e	2016-08-28 17:36:52	HS256	\N
49a7614a-90be-4c79-87d2-9bb277cd2aff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9473050df2c146fe9fe9cc62d7826661	d4d34debfa8c4f309b126e4e2b8141fc	2016-08-28 17:37:01	HS256	\N
e0d5135f-8323-4d30-9135-54b2be37be26	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1af81a5c1a35418a879c4d8e51cde445	ad2994c9dc4048b99a1fb7057254a1c3	2016-08-28 17:37:01	HS256	\N
8a341ece-45c5-403c-958c-8051fcdcbbf9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	046e363307dd4b6dbb30bd9cb5d1694d	19bed9ee6bdb44198e13e0e7e0a0ac8d	2016-08-28 18:34:02	HS256	\N
90ac40a5-6554-4d7d-9c00-71fb9cbcfee2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dfdf79f799dd46c49693a846023cf851	8738812df50c42f68fb07c1d70441cd6	2016-08-28 18:34:02	HS256	\N
205bc962-0413-4ee0-b1e2-75940d7ef780	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	20a49ce28f354312b189b21c45bf697b	9b5526d9a3c24d2db9692438e7694bc4	2016-08-28 18:34:16	HS256	\N
318e4606-d4f3-4256-a78a-cda2596ef35e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	444ad750ae6c4fba9dbc4cbf520c82cb	23aa11a43dbc46f98355ddd7fc9370c6	2016-08-28 18:34:16	HS256	\N
630721bb-e062-46af-93d5-ed132d65f319	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	94d52dcabf604fe98018d03f5ede867e	feb97d010a58408592b524e415ebcb31	2016-08-28 18:34:19	HS256	\N
1b6b6195-a5a2-4238-a9f7-c85a39ea34bf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	791495223bff49ac89d211a5269a75d9	963d5d469cb5456e93178e9e5b667b9f	2016-08-28 18:34:19	HS256	\N
fefb4232-7ed3-4393-80e0-da353564bbfa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	84732df19dda4959b9cf5529f89060d8	fd2864296030445cadd9e2dc2c3a5e2b	2016-08-28 18:40:13	HS256	\N
1f6d0c60-ce1b-4812-8d1b-a4b1cc191eba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f717ad3a7d3445d9b395559e201ad17b	47e02a1d0f0341be95cd581517e707cc	2016-08-28 18:40:13	HS256	\N
8bfc8e17-21b0-4daa-816f-0dbc57bc7b5d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1b9d8280e15c43e2b04709556ad9d797	87d52c316a284879a40495e462d36f30	2016-08-28 18:40:26	HS256	\N
079049f9-3ada-49ad-8f5f-63a4aa48da5e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d5d595b1a9014928903a180cf5d922ba	b4851c007eab4568af1f384b581d905c	2016-08-28 18:40:26	HS256	\N
336e1539-c144-4b79-a174-c8d0fd6bcb80	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dabee20700eb49ef97133804e32f2ef4	47d2ace8b1dd4534943db9e3fd821eb4	2016-08-28 18:42:59	HS256	\N
ecd8ad5c-d14b-4fff-8192-6f814a9d6ff6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	02cfec2916f74d0ea4a63486d6c624fe	3d935bbd670e4043a91096e68cb0b9c7	2016-08-28 18:42:59	HS256	\N
839d748f-bc4c-4057-aab6-e96c8708a45c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0365ea9511d6444085267007f32bd444	66ade5287d8148dd995250e3ba9caf17	2016-08-29 03:37:41	HS256	\N
71f61f91-7411-49f1-bc85-2ff6d4f46129	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	29da8817693041a9947a27c2cb966ecd	ee71617261e64f47ab3d34c96561698d	2016-08-29 03:43:53	HS256	\N
56349974-0b8d-437f-b10d-6bbf5fe44327	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7acbe02d6b054037a20a0960296fdc14	425116dce4f8491796ed5590c341c1a8	2016-08-29 03:44:09	HS256	\N
79f63828-c10c-40c4-b781-ffe5d484a966	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	204320e0828e4c31b17e981823c18de2	385d45f634ee468eb34c82ac3fc560ce	2016-08-29 03:45:17	HS256	\N
9748e76f-2546-4b03-899e-40102c8f0e1f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a2da4f0a15ee4f7293e95beb4e64ce44	de264fd25a724c58bdf75b91e316e3e3	2016-08-29 03:45:17	HS256	\N
ff818c5c-063d-4671-9210-9ff67ac6e223	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2df335fa0a494672b9eb35183594efa4	75273e6708f8491790198db5cba6a5f7	2016-08-29 03:46:01	HS256	\N
5a6a2489-d137-4e96-8196-00a344efd84c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce1600c04573452393dc054c36b251b3	0569a1146cb04aceb45c58d9f89659a8	2016-08-29 03:46:01	HS256	\N
a59ed5da-53bd-4155-ac19-ffb77655b0be	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1e440f1ae12e417c829d8f211d880cd7	da7e9a8b2ad64645a039eed455bd6f7b	2016-08-29 11:29:23	HS256	\N
3f5abceb-cd7d-405b-b062-5599876c7603	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2911b4974ba143dab17a6fb834795144	8e9c051ef8a54d039305b3e50f75dcb0	2016-08-29 11:29:23	HS256	\N
6288ba67-48ca-4a2c-89c1-2a817423e194	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d74c7fe4642346078341d26483b0b028	4841296a98464f93bc3722ebab89f2b8	2016-08-29 11:29:31	HS256	\N
eaabdaa1-4db5-48be-a42f-f011d1c17977	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cbb2aebbd26542a090998777467ce35e	445892ff87d643d5aa03428597e18782	2016-08-29 11:42:46	HS256	\N
fc0f12f1-d34a-4647-aa7b-1a35f383f8b7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e3f7fd3807414cfcb4ef13a146ae18c3	0581b0d3059a4bb08acf6f41208ea4f9	2016-08-29 12:16:47	HS256	\N
f9a1a2a5-10a3-4904-b109-fbb861b88812	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	28358b87877f4f4b93c0682653442e88	4c586e0df3914865a0fcd082604264e0	2016-08-29 12:18:41	HS256	\N
609cd7a4-760e-40a0-bbeb-fa2988a6478a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f8d28b8c85bd47d792210f8a596f7b63	33adb3fdb03f400597645e3cc8dcd0f2	2016-08-29 12:25:33	HS256	\N
f3280eb4-a9aa-48bd-a39f-7c53b405c848	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5f468df34df24e29bf4a7ec7eb5e45c6	207e95566dd14deca9bcfed180368a93	2016-08-29 12:25:33	HS256	\N
9d9c61d3-9f7a-449c-b5cd-c0196a6e22fa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d2101ec801d347c4ade6689dfc4f7763	34e793a326a448b89502c3198b927b10	2016-08-29 12:41:51	HS256	\N
c284ca97-c311-4e03-b4b0-338004f6818e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	19a37af38cb74b6f8bf187517ef9cbcf	c66c5ee284e84ec8be4e321666d128b3	2016-08-29 12:42:04	HS256	\N
de23d534-5d5f-4a2a-a72e-36d99695c519	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	52b3b901c4de47cba1ec0c58f7f10b8d	edf0bc3a908d4a539f785848c191f679	2016-08-29 12:43:35	HS256	\N
301ee19a-0111-49e2-aa93-9aebf990a027	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3b7a9c550fa3438b92424018f1a932e5	28d44bc2c4a64a02b585f7d6e4b98981	2016-08-29 12:43:35	HS256	\N
c0dd80bf-362b-489d-9217-b8acaa6dea25	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b6213736afd44633b61f9bca891d90e2	de9fb362054444f7bdf96e8d36c60aac	2016-08-29 12:44:08	HS256	\N
85040611-bcc1-4c93-8e61-8488b14f7e59	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	09743a3e833a4a14b19a9b998bb2bbaa	8ee44a6008ef4cfba15dcd1c149c52bc	2016-08-29 12:44:29	HS256	\N
1855fb54-147d-468f-9eb6-cafd6e087d31	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	75a723b5b37443219d75e09b205ed76e	91ca678828e24b26b9898ef59605a6ff	2016-08-29 12:44:29	HS256	\N
d25e24bd-05bf-40f2-9d65-c900afa857ed	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b85e5881aff649eab9f8b1791f9f8507	6783253d43d8452b910c5db7d3f14d0e	2016-08-29 12:45:02	HS256	\N
e5dd8684-3b3d-449f-baa8-40bac1d25e35	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c10561fe55554363b01b464c52087e3f	127b76692f1944d4bdf89928ec08d80b	2016-08-29 12:47:23	HS256	\N
b2387fff-b1e1-4d29-b8fd-10423f36794e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c3812535a4b44ee0b0a210ba8bd5f091	3bfdfc2c3bed47cf871b9ecfb61a252a	2016-08-29 13:09:28	HS256	\N
30bda504-4d1f-4a80-8405-c978a3f2b74f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cc4f29b3f5cd40b682fe51efe73c7808	d0757fd9f6de45d5a65e201cc2de042b	2016-08-29 13:09:28	HS256	\N
8c0f4fb9-9ce3-4185-9463-77eeefb25c53	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8c76d4ac535c41adbe29176daa3e2b97	18819f43aa70403badb4ce2b8db8f4bd	2016-08-29 13:09:41	HS256	\N
eb4e6016-5562-4d50-85d1-5f3e0911dcb2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1fd0b60c55ea4670b849207cba1df92c	1524323dfbe54b9cb3739fe6661a7605	2016-08-29 13:14:56	HS256	\N
fe44bfe8-f05d-4524-9f5e-a65ee7df187f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	239b5adaae1244fb847949b1ceb85f95	4c1f900b3df04584821d35b5b8fff576	2016-08-29 13:14:57	HS256	\N
ef92b8fe-cd25-4658-b04e-e28b03d946a7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	945ec2d318124badafcf0e0553fed148	2984c2134ae746eb84b46384efe95aad	2016-08-29 13:15:25	HS256	\N
de8660be-25c3-48a6-8eac-80a29d2ef25f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0edd5b1d9f0c4ff492840883b14819bf	d08f2e1936f241d1b0674a6c5ec1fe60	2016-08-29 13:58:16	HS256	\N
cdf2ee4d-0991-4c4f-8f69-4684e786fdf9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1c064f383ca9477aaa444b29a749eb22	40296206f5fa4d9aace4420c17deb403	2016-08-29 13:58:16	HS256	\N
8e1678c0-8151-4136-9f46-ef3c4cae535e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e8ba2652c64f42498abfb97b8fe69ee7	742b5ed8a7344734a66da72d106e70b3	2016-08-29 13:58:59	HS256	\N
219df9d8-b879-4447-b46f-149b01eba5f7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c6488694e51146acab7968fb43838d36	f251808169e246b49492f73952adac3a	2016-08-29 14:00:02	HS256	\N
8d48024d-f7bd-4819-be5a-6e7b24ddf60f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b4a205d947004d45ba8489ddcbb4f4db	89869cd0127542eaa0c16996f26a3bda	2016-08-29 14:00:02	HS256	\N
18ec79a8-4b55-4d39-9e4e-ae82d0c344f7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8c506636d9024dde86aaa3f53cacbd0c	60cd9d5f4b4b4a22a7d6ea2c815f6ef5	2016-08-29 14:05:31	HS256	\N
9ef5e7ac-012f-45f3-8b66-da086f9c2354	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c0156c48571a436a842f380b263c458e	15cb031a744543c0963f597ebc5c61e4	2016-08-29 14:05:31	HS256	\N
863d3d44-4a2a-4d40-9b05-d2396c3e7ce0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0997e9c48e1446648cd73a78ac9597ae	5f4a9805e9804946a5051732673d5f7d	2016-08-29 14:05:38	HS256	\N
13e05def-2f33-4cb2-9c94-fa57d07d90b9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5ecf036164c749ae94b312b59d52b14b	8aca4dba3149475cb8c7a5aa19b9210a	2016-08-29 14:41:49	HS256	\N
9522baf3-cc75-4172-ba72-a234d7901095	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dad662c32af54166968b2d80c16ca867	6ae7d30e55f24cfa967936f74605128c	2016-08-29 15:21:41	HS256	\N
6d5a9d2c-0c78-495d-ad26-5fb861581aaa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6d4a5d2a17984a84ab8e6ef68eea10c7	f44c5e5bdbe14a75b1248c6584227f0b	2016-08-29 15:21:41	HS256	\N
9c8c6991-3407-433d-b978-6d407e75a8d3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cca644112d5d4db990dfc5b4ff9d1bf1	90a356c4c643434a836299c2d2725a43	2016-08-29 16:40:34	HS256	\N
6b13a168-2d78-4b91-820d-11d85b2765ff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	325e7a83a15946098ed041c13361c8e5	49ae69205898406fbfb3dd2d135c2377	2016-08-29 17:37:39	HS256	\N
dab8fddb-5db5-4c95-aff6-319105074772	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1ccd48e1a57c4d03977582babf2b3723	d6515a6ecd8d492abe4cd1a95d0e3a35	2016-08-29 17:37:46	HS256	\N
cc0d17d8-06cc-4f30-bea0-9384cd47f272	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	30a565d1dfd046c3b56de61405702d8b	48b0a733de9c487393ea1a1bef5229c5	2016-08-29 17:56:14	HS256	\N
5b76d256-46f4-461d-b6eb-9094f54da79b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eff64b7c066e425288de9713962fb7c8	21ba4c625e5643eca6810c107c71b495	2016-08-29 18:39:10	HS256	\N
3bd28aaa-8889-45d1-88cf-375ac8f56ba8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a4715ff0e4784de9ab4cf421bdec24f1	730cb77c6baf4d8286502610dc0bd4f8	2016-08-29 18:39:10	HS256	\N
94766303-1f8f-41b7-bbe3-ceb49931d009	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0daead1fcb5540ecbb7ec63922511d80	93fdaf6f28924581b9a3128aec8058e1	2016-08-29 18:39:15	HS256	\N
cdfff813-220d-48f3-810d-7434a4cee1f1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c0ae31ee04084f048cefeec6dc328af4	3a3b6769c31b40ed93f63d128348ec8d	2016-08-29 18:39:15	HS256	\N
313da553-b235-4523-817d-daf16f384b0d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2bf2550670e942fcad4b9cf68327dcc1	af7d065135de4427bf62e46d3e349e3e	2016-08-29 19:48:05	HS256	\N
efae3a2a-e3ab-487f-8867-e6da52f7713e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bda1b8524a8a4c348c5890506d517e73	0319155f7d664e6ab90b98bba445502d	2016-08-29 19:48:05	HS256	\N
69f090ad-6074-4100-90ca-0106a406f13b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	44b8b9075ac64a96a0994f6c81026de8	546a8291b184493fab60d2fece2de82f	2016-08-29 19:48:17	HS256	\N
503cf573-0e49-4b02-934a-0b6010178013	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c47cf5004aa4784b85d5509ede1ef1e	08b2d07a47384b1795e1f4eb01265a61	2016-08-29 19:48:17	HS256	\N
dcfa595a-5d34-4ebc-85dd-88ff098a06d6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7d1634cefeff4b91a27e1762ec926c81	07ac6eeeb16c4753b39788ec56e8b40e	2016-08-29 19:49:32	HS256	\N
e582d7f6-1c65-4ade-9d10-8ac75d6a0e82	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2fe97ed5ca184f87b9b034fbf635e3b0	694df4d38481464fa5a3fb8da1c214b6	2016-08-29 20:03:40	HS256	\N
518e0318-323f-4d36-ac5c-7acf60ce1555	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	928a4e941e6748a0acfd552249ac754d	7c4bae1d85f94b7cae40a8ab6686023c	2016-08-29 20:03:40	HS256	\N
e1dbb24a-b47e-4beb-b5a8-9ec5e76260c1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	48640a97202542958c96a173a1eb1b69	65cf7999fe60491b94041074df030d82	2016-08-29 20:03:45	HS256	\N
6c85ef32-893d-4053-b7f9-683dfe68f806	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	17e2fbaadeb04479b01ba982006987b8	92193dc26e4e4bc08f3dd2bfd086139c	2016-08-29 20:03:45	HS256	\N
2ccea4bf-ae4a-41cb-a93b-e5b042539e3e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2ee194c116054c5e9c6fb305e610f4b7	f523819575d14b7d9f3677e7e9b1826d	2016-08-29 20:16:29	HS256	\N
a61e2fbd-84e5-4632-b781-85865959bb35	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2024e76bc5904cb8a8f800d313311636	a3de2942b0364a64a0657033877fb54d	2016-08-29 20:16:29	HS256	\N
0f214d0a-638f-46cf-bf1e-46411b4a5cf1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eda33ce2c32447fcb28d4ac1be00648b	1f3f2f9a139548aa8ccb141398d087c2	2016-08-29 20:16:39	HS256	\N
b197a822-7e31-4344-91bd-a55ec4aad45d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cd7be50fe1904e4297d2257fc3a334f6	4de089bdfc4c4143bec3bd8ad34a9452	2016-08-29 20:16:39	HS256	\N
a99fade3-a565-4b90-995f-86737da2ed81	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0c926f3af3034a8bb5c2687753fc3163	2ded9867da6d41f984bde5336437d9be	2016-08-29 20:17:01	HS256	\N
f98fb46f-1127-491b-b1ba-88f56daeb56b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	25a2de5623ae4ffcad6ed1f541a6a311	02c2dabc16dc4db689c858dad8cf1d56	2016-08-29 20:17:05	HS256	\N
342777d3-b247-4048-be71-3d6ef19fb847	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8882d0c298a44683a424aef188389706	8fd9336a7d6647d3bc0a4c437f33fa0d	2016-08-29 20:17:12	HS256	\N
fafb95fa-820b-42f4-adc2-9cb2946b2e5a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9f1728365d294c0da0e4d958152ca37f	1a4e2ab68a3045f3982ee3c740b153de	2016-08-29 20:17:12	HS256	\N
3b47f8a3-1697-4914-8d2b-e4e69a76f3a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e29fec2c04c54a5da0e4492d41b62da6	1a5b3d6de50547db87f45f6b07afcba9	2016-08-29 23:30:06	HS256	\N
c4fc29ad-3e74-4a5f-ac88-91de9529aa11	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fad6d8f6ac2846028976db983cc3f54f	9ca45f7e67fb4f4b96becd0572eb69bb	2016-08-29 23:30:06	HS256	\N
ee1e0625-f994-45b2-937d-336deca400bb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6c4cb61ebd124e1fa1dadb34aacae6ee	f560eb2912bd46d3bf9000e5054540f6	2016-08-29 23:30:12	HS256	\N
a4c0bae8-8a54-4c92-981d-89a52977efee	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6c152d0bc222437490375ac56e9633e2	34408613306c4ada8b423835b942a86c	2016-08-29 23:30:12	HS256	\N
fcf6e809-e665-4e51-92fe-6f6f7b5aeb3e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dfbac77918be4f959c626adf5999eeb6	575a904c8c444331bca0289398984774	2016-08-30 00:04:30	HS256	\N
6ea42d32-276e-441c-969b-b33e4240c937	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ed0fb93fe4df496b8b6c8f926e990434	6f377a485a8a4a0b8bfb0ceb67eb3018	2016-08-30 00:04:36	HS256	\N
153c1c67-5026-440f-b19d-60f6e7a19c38	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4b2bde4c597842f8a2cf9fa24b60f9c4	c3db13a98dd04c4fb7cd935bab4c17ba	2016-08-30 00:04:36	HS256	\N
81401bb8-9c48-4d45-a042-55e90bdbd7fd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4d75782f830f48f98c07b58599b06157	4f8c00cffcf64ae1a0490761e650ff48	2016-08-30 00:23:59	HS256	\N
59b58e49-06db-4d79-a0fa-8ed51d8e2d73	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	279cd16cbcd54f70bf2a7641d63917d3	9a2191f092db464bac1f7f41acf7a859	2016-08-30 00:24:05	HS256	\N
1a78c129-845e-405d-b8ad-e1497c017149	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	95717a1211144efe9882f6c2bf4b4b0a	3699f5f090fc4fe79f148a2bfc3d1547	2016-08-30 00:24:05	HS256	\N
974c5450-ff73-4909-8a36-15685ce3be18	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	30a9388504ab4739a6d2fe84b6949bda	69e108089a1a4219b5929098f50fe574	2016-08-30 00:53:23	HS256	\N
4a0fcce3-9b0c-4da6-9dc7-c84ecc796453	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c8d1e40ec4cc49a484e96b31db70c8d5	69d6926a4fd64430949b74e17b74bc0b	2016-08-30 00:53:30	HS256	\N
c1b9eef5-f18d-428e-b12b-68287842ee9b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8bc39e5eb5424623a17618d70c79275a	1e2436b3863b4a36a8cb516513bfc803	2016-08-30 00:53:31	HS256	\N
1723523a-43d2-47ad-80bd-51d5f58cfb20	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ddf8bcbd423148eb9ec01876f8f9f96b	207bd4f9ed7c4babb6d209fb7b245bb2	2016-08-30 01:18:47	HS256	\N
43260c66-6e6b-4bb9-8c3f-4caf62800948	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	566fec520fed4145b908fbe0d41d13cc	49a79ae9fff04313a59adb2b4a993dda	2016-08-30 01:18:47	HS256	\N
a944aa17-88c9-4642-a83a-917d182c1557	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f9e7ea7eb9eb48f598830fe713b29573	c771284d5fdc4d22928b08c88baba36d	2016-08-30 02:24:44	HS256	\N
e690708d-6099-4691-90eb-f5afbc1c5092	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8a2e34ac754d470eb757181ebb9cb023	b319437cf676468ab04c4b1998e13061	2016-08-30 02:25:31	HS256	\N
956209d3-20c7-4240-8d0a-d1b108619677	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6ba376b8cdfd410eb7843b4368dc2ee4	b66fda89e54e484f860a63d267810b11	2016-08-30 02:25:31	HS256	\N
c1e52a88-6a09-4a42-86cf-8ed56b418bc0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a443001641904baf895e53c9a24d80d0	94c1f19061574be3b4308a488b0e0c3f	2016-08-30 03:03:14	HS256	\N
96754c27-a766-4887-ad77-1517c496745a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b28cb076dd8341b0b7d9197189193ab8	0e14e303329f46ce97d44536c5b68a75	2016-08-30 03:03:14	HS256	\N
0912007c-95bd-4341-a7f1-5fa164f8e235	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	342f663fdafe45769ee8d3fe8a0ff154	19af3b04be884bd68eb115e9e643548b	2016-08-30 03:03:19	HS256	\N
5f26ac4f-318a-4ed8-88d9-0ab3463fa6b8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8ac3846055174d92b23017f5ef271a3b	aa0af72601d7488a8634aef99d493077	2016-08-30 03:03:19	HS256	\N
ab77ad83-3519-4901-9ca2-4dd3d1797d80	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b1f955d27dd1449e9cfda5c9c783004a	748e12e3366348f5925f0b989f15126c	2016-08-30 03:04:29	HS256	\N
3499be6c-6e47-4e7d-b288-70ddddaad9b9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d238a8318dc54342af9e0bed85537197	6e98bf00d64d49f8ad9c8311bdf530d5	2016-08-30 03:04:29	HS256	\N
8353beb4-aa8c-41ed-9b4a-ba4a91da0f25	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	90f4868fc1df448bbce40b19f044c893	63626f83aaaf44109c227c519b29d102	2016-08-30 03:04:36	HS256	\N
7a111e69-9cda-4829-9575-1870a4e3efc7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	383c18d9c8a84c998530568451195c4b	037de469b0994384aae0af52f28c0c20	2016-08-30 03:04:36	HS256	\N
d46680cb-b3aa-4fb2-99f6-4bb539c74074	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9b5602d54d424552b05c5d999d801c10	72628fb2ef06498c85cd45c2e829929a	2016-08-30 03:09:47	HS256	\N
f02aba08-4cc8-44a8-aaf7-7588ebb5b8cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aaf3dc9eb93b418288f01f9f2ec61766	d4cf39d9f74b4a70a95d6b59de6c5bda	2016-08-30 03:09:47	HS256	\N
d79dacbe-3a22-4d2d-99f2-e5f145c38332	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	86d9e09fb78144edbdba814e54bae664	1ab70ce3dbf54862aefc08a7ec560f63	2016-08-30 03:09:51	HS256	\N
4620184c-993c-4a72-8d78-9cb39cb549cc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b1d33f5b4bba471d941569422085d3bf	d9c93435f0ac43f9b4569d0872278286	2016-08-30 03:09:51	HS256	\N
ed2ee969-87e7-42fb-86b2-0ab7c55d0d74	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	775307d0416a467dbed7e61d4897a73e	79ff47f1649e44e5bfbfa576231254b2	2016-08-30 11:33:36	HS256	\N
cbe0ab26-07db-4548-bc4b-bdb5f65c5e8a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5255ac14a71c4424bf5f10bca42a4ad5	385290b57ed74711803da7688b055dfa	2016-08-30 11:33:36	HS256	\N
9cef9d7e-dc0b-45c0-9cfb-361d95f20cb8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	95839034487048fd94a542f2a576caaa	3e8c2f37423049db8ef180380364d0d9	2016-08-30 11:36:39	HS256	\N
bc69a34f-75e3-4f4b-beb9-ea441e7cf792	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	110c6a67874c4af38d1a632ffa6a74d8	772592f53276431590026d081e6f1fae	2016-08-30 11:57:47	HS256	\N
64e983e4-3e2c-4303-bde9-ea63a44b0b5b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c5b1e13ee82947deb741f2bcadc75d11	8476fe71d5a34550b4e2531905f7b602	2016-08-30 11:57:47	HS256	\N
89ab2554-9f31-4b72-ae7e-47863e4388e3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0c3ad7bba22e466098c37ac1d99081f3	fb1088a1784a49f8be4ef6beeb0915c4	2016-08-30 11:57:58	HS256	\N
ba39fc2b-4190-4ee7-9881-9d81ba4edd7d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	35e251df4e724119a3a85ff25b01cf18	ac6090bf232841c0936c6e959d929b67	2016-08-30 12:06:59	HS256	\N
5067eb60-d4e2-48b4-94e9-779f202c6b1f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c633f397e8a84d3bba0d41fd11372a3f	5d60e8ad37f348cdbfbfc42fd8d84bcc	2016-08-30 12:22:55	HS256	\N
378dfe14-0e48-49f6-8a12-2669743626d6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	29312b8f3eaf4c3a99accbcdc8987452	56da33364c4d4f1d9f35c0e5691c7509	2016-08-30 12:22:55	HS256	\N
071b319f-4631-438c-a7b0-9f7fbd9181ac	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	895baa65940c446588d13d71f557ad71	c04f0085bd6d4fb1b89aaec1415c9417	2016-08-30 12:23:11	HS256	\N
12025cb9-bf44-4bb8-b5b1-93318bd792f3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ff5d15c777ff4e53a05fb1662aaced51	f56cad0a758b45fd822adcdb6b45a00c	2016-08-30 12:26:03	HS256	\N
5b97f728-28b8-4c4f-9b8d-616ca5276c31	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	800a939af9434c9e9384c06d119539bd	ce22e95fb4694ca6b3468016fd056ad7	2016-08-30 12:26:07	HS256	\N
fce7ae28-094c-4bc9-971c-d2fcf1d2d5ba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	797c9b51c0ee46c19d1cc755f4915eb4	2caded2ffc2946c0bd4b9e20cd327bf1	2016-08-30 13:37:46	HS256	\N
b245fa12-ec34-4b8a-8d49-45b686ae9367	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7e826b8dd66d4e268ec2685b041080db	dc5f76187d1e44858e62f087cc5d5009	2016-08-30 13:37:46	HS256	\N
c91858bf-ae89-4b0e-9cf0-b7198e8eb70f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f6958beb6f2b4eca95a15ec08434273a	eaa37f4aa193471d9c4141e46fcf493f	2016-08-30 13:37:54	HS256	\N
72aeca88-4e94-445d-ba5b-aa23b0261a16	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9034a78d7f334527b0e62ebdb370c947	064e97cec227425abca7ff967dc9541f	2016-08-30 14:56:18	HS256	\N
838ef5ab-ae3f-4ebe-980e-b5c95e33bef4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	38e50aa29c0047dcbf4c78250836af8d	d080e4128cf74e5b81dc38e29aef2870	2016-08-30 14:56:19	HS256	\N
9ce54a55-b948-4f9d-a7ef-484416fe2d91	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ab65e538e71c40dabb67832a99ab1735	14b3d0e29b7345fb9347e1a4f455fd22	2016-08-30 15:22:26	HS256	\N
eb817c77-e366-4884-a687-29a6d00e99a9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5cb5bd0fc56f458eb93ef89a56da38cb	027cda52631b4cff967c1b811eff7178	2016-08-30 15:22:26	HS256	\N
08b71cbd-8b8f-492f-b4a1-5b20a231867e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	545f9c6bcbc14e97ac3c856afdf1214a	dd05e474626349a18b6a1f790fcdbbb0	2016-08-30 15:22:46	HS256	\N
92e45b56-cbce-4154-b41b-89cadfd40e8b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dadf9455ab174ffcbb3a81197b32ba37	818f048950574c5dac33ea60f6f45b10	2016-08-30 15:22:46	HS256	\N
1d47b2d6-01c8-48d4-abeb-d89ea975671f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	465eb7f105dc4a5ba50f3eccef3dd4fd	43b59281659f4a5aa9cea852345c6193	2016-08-30 15:22:55	HS256	\N
e9f673a4-31b7-4c08-8b83-5d443662acd1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce8a32a20da74142b4f9e8d61d34b2f8	5ae05933084d4b91942ad3eb7e6ae1f2	2016-08-30 15:42:42	HS256	\N
03d6ac0d-a3b6-4e15-b03a-92deef81a4f9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	423badeff1b44b33b021aa414c912abd	6311efacacf849d8abe9c7b80381c01f	2016-08-30 15:42:42	HS256	\N
cb812a1c-4a1b-404f-8096-23bc790d3617	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	39e2ec49bad0412a94bbda3d84722e5a	da7c82ceba0d4906a447f4b25056be24	2016-08-30 15:43:14	HS256	\N
239539a7-b5e4-4a38-b7f6-4d6d048e8afd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ccca3628e4ef4fc7a877190cf29462c7	56fd893a7f134aea85360759745924be	2016-08-30 17:25:53	HS256	\N
9ccecc90-8c63-4b27-b56d-ce6380f40964	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	25de6c5480f74a81aa3c62c06a1f87f4	f83ad83afe6e41d996fa609625ff3504	2016-08-30 17:26:11	HS256	\N
fa044d20-214b-4566-b82c-8b10568d2a24	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f43568378cee401989b3fa619718d84d	1e7f4f19685a4e5388827d1a768eaf34	2016-08-30 17:27:53	HS256	\N
ee248ab3-1977-4b6e-ada7-8d9a5f278685	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	049db9e5c80546b197ee8592755388e9	8ce0255df5524bf58b46242dca5a8393	2016-08-30 17:36:06	HS256	\N
eddf6e41-06e1-43b6-bffb-f4a0f8401428	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eabdf5449b5145be822d138553faac9d	c246b45b28714c258e2c945a38327928	2016-08-30 17:36:06	HS256	\N
24b10c1d-e125-4e21-89d0-1cafaea151f2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e0cc7f3dc52144e1851288f46351c0be	808ae7af35144c57bdf89a7c5fd69e08	2016-08-30 17:51:37	HS256	\N
a679a2db-6acb-43b4-aed9-29a0da97890c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ac62df61c38446e6b0df8dfb5524334a	a00ad3b6e91342af951b22b78eee9910	2016-08-30 17:51:37	HS256	\N
799f501e-fc67-4de8-a788-a16ed4d141e9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	91d71d88a9a74a438896617f6cd75cf3	977aefcfc62e4c46809e56bfc136c50b	2016-08-30 18:12:58	HS256	\N
135e6cc8-342c-495c-868c-9340b5fe9f4b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	94397bbfa8734dcf86b64ccd41e5dd72	2e66822ac6b649ebb8c9153035d14f19	2016-08-30 18:20:44	HS256	\N
bf1b963c-c8ed-4107-9a9a-9a34ccab2012	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	86a1044747eb4423b0e34336c7aedfba	ec3efaa4c5104510b2fdf4aad6be5dc7	2016-08-30 18:33:53	HS256	\N
9e1e1caf-7a4b-4ff9-8b96-5c763767f3fa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fe6c51d68fde49f789f28e338b2e34e4	ae8e5c077cc44780ad7a968d85c3914e	2016-08-30 18:53:48	HS256	\N
c5aabb38-1f8e-49bc-90e3-bf6470216712	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ad5a91380ab348d887ea798e61ea13bf	5eb1283bc66341fda618fb34e8dcff15	2016-08-30 18:53:48	HS256	\N
e1b5d705-180f-483a-ac6b-0aade1f96e74	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ca76aaa4a7534d4fb035142a0cd642b9	2078af74e67945ec9098d82e05632f19	2016-08-30 19:12:13	HS256	\N
acfa13ec-90ce-4c74-8029-f13338ee6393	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	70f6483b131749ce814f21df486464e2	0ec606be779644c5af6df212e6dcef65	2016-08-30 19:12:33	HS256	\N
68ed5c4e-fc36-483c-a74a-7dd7013a3ebb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f686b8dd14ac44afb18f059abbc28d24	097db4ba79f34613bb118967ca31a68d	2016-08-30 19:25:55	HS256	\N
b11097d7-5fa8-4c35-8474-ee25baf56bd9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d9f793787af54e6b8a820b6a6f35bff6	f5dee96b5e4049a996b0dec9d2c3b539	2016-08-30 20:33:13	HS256	\N
615f8904-6676-4cad-87cc-546fa9b97bbc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	df1dc1e879ac4a17b6c88aa9ee4d7f6b	2bd0db9d165d4444a05c5292c4f4a62a	2016-08-30 23:20:28	HS256	\N
99830e44-50d7-4be5-824c-495b7b3436da	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ad5f9f7ec3ac473ea4f02bdddf359915	d872931bfc0745e38f42e656debfbe07	2016-08-30 23:20:44	HS256	\N
31786f01-76f9-4bc5-8039-5a45e7b4f563	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9387cea1397944ca8e5f5f4d345ad4e7	1fb98691ca0c45c890ec83a8a1e401ba	2016-08-30 23:33:26	HS256	\N
d2ada18a-9592-404a-9079-57d5e6304541	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b620ab19e9914394b0fdce691352d321	932a4997185d403eb29eded09dd30cd7	2016-08-30 23:33:26	HS256	\N
5102ac74-97a9-47c3-bd56-4c9a29fa862f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	22e1f7b51a31447f90518333740b89a8	b633dcc2ed694cf9995c4ac4da604ef1	2016-08-30 23:33:34	HS256	\N
4e191973-71aa-449a-a24b-21ef3dcaa7cb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	367856fa801949878fbf922de157dd8d	f907f050928b41f3b1e99147201e577f	2016-08-30 23:33:41	HS256	\N
e863b2ce-896e-41ec-bdee-31f529002589	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fc6f3767491243609bc6f7c3727418cd	b81ed3f04efe484bbacfd8c008270f99	2016-08-30 23:33:41	HS256	\N
83d0f70e-b592-42e0-a013-b49b6dd3e8e3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8579cbf2840448aa8a945d03369d99dd	ba265b428edb427f896b23c4bf725da5	2016-08-31 12:13:07	HS256	\N
79e5d2c0-0efb-4a1b-995f-c2204409a03a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3275016196d54980a0b300030312c76f	0d2807b952f24474b00c34432bfb6af8	2016-08-31 12:13:59	HS256	\N
b525a2e6-33e6-42c7-b19d-484ef0677f81	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f4f5ae73d4e34558b420d09e70de48db	ea10af5a9d3145bfa019a3ef8ff8767a	2016-08-31 12:14:07	HS256	\N
62d84df2-5ee4-47e1-9cc4-5ab03f4da010	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	76bca139e5e94550b51541dca21df43a	e13de028ec98450db6339880f4207cab	2016-08-31 12:16:43	HS256	\N
74e90cb7-6717-418e-9c91-a5e39a7d53ae	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ff5b91d027c74aba9a25a2a1ba03bce2	9a64e0a62e354ea6a261c3e8eee00cb3	2016-08-31 12:16:43	HS256	\N
decca11d-ba31-47d0-b6ed-033251457d39	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1886c1371a864c489e306c9e7f03c207	16408af50485420c91ca8ee8fe7083b7	2016-08-31 13:34:05	HS256	\N
0aac9987-105e-4552-86dd-97eb763595f5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f2a521c898224ef4bc6a60271d56b60c	f70aca6fab6c454b822a222c867f8535	2016-08-31 13:34:06	HS256	\N
fbbe73dc-228d-485c-9951-fd4444dcb358	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	551ee3d05d3541c29b73294beb9f5303	627669318235420fbd5c5a9df32d81c2	2016-08-31 13:44:27	HS256	\N
54539aa6-ad62-4ddb-9068-ad6aed527f0b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0b5783b177c64653916164655ba8919c	2725ff514a1c4a248e195d4c5a30a81d	2016-08-31 13:44:45	HS256	\N
2f4bd28c-e83c-45da-9eea-08489e9d01aa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c0d108008a14af195cc0eb8ae1937e7	c599bd39ad724bf0b067cfc0f523401e	2016-08-31 14:23:45	HS256	\N
daaba572-2c0e-4d75-b0cc-11a823162c87	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ebbbcbcbd38540f580fb711dd42540ad	42e6e723f254481cbb543332d73dd4bb	2016-08-31 14:23:45	HS256	\N
394c135e-dc82-42f4-bf19-6a51b7054936	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dad6672e4906435388e9f6475c86798e	0db64a609b014de3902b687bd3c6a8eb	2016-08-31 14:24:18	HS256	\N
dfd7a321-ce4e-4706-ba89-679855ee18b9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	51f8915ed06f4768a61e0e44e3993e9a	68d2e5ba394043bf960e227f5bb5841a	2016-08-31 14:29:57	HS256	\N
e7136683-6ad0-4ac7-8a7b-d7d09c09c657	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aafa77474786421080ee875abf07b7ae	4b67c3dd866a40b797818cae96c192b2	2016-08-31 14:29:57	HS256	\N
5ada135a-5176-4e22-8499-20f20cac4738	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	eb93dc0e128d4efb81950ccd32319388	49b0a16db4dd4a7689dc3dcd52b83501	2016-08-31 14:30:07	HS256	\N
9ccfcf5c-e7a1-4a7d-a0f6-7813e77d6997	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	30cb5cd5f5874d168980f2c61799986c	9a0fc91010a2494e9a1a22ef3d2252f2	2016-08-31 15:13:56	HS256	\N
f3a72b47-4818-4af2-895b-a1a39a3311fe	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e2a2be724b35493cac5ed5ce6b7d1307	dbcf038bf147465bb4ed119703750870	2016-08-31 15:13:56	HS256	\N
7425f3b5-2d7d-4c08-a0f1-beaa71bf56b4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6440ac4065ae478083e65fe6167429dc	27f34a1febf844178bba5e00320e6419	2016-08-31 15:14:01	HS256	\N
4e59ed8a-2bb2-47f6-a7fd-0fb77eabfa3d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d8db565f4a124e07b2cd32dd243278f9	a2a10c9b501f44d59121c5d5fc0b171e	2016-08-31 17:11:24	HS256	\N
2dd399f9-fd4e-4dfb-a64e-b98ee3f7b5c9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1497d6eb8f4e439e817a977cbc30fe1f	93ce6330eab44beab40978c8cba632dd	2016-08-31 17:11:24	HS256	\N
ab726abc-bb66-4543-850e-b5dc0dff6387	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0d28620eb95548f291f8633b679699a4	db98e4a98e1344f5b3849249ff02c629	2016-08-31 17:11:31	HS256	\N
93da8628-644c-4177-88c7-a4da9bd66080	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b7877ab9a17f492d89817247459c59f6	0c7c6f7728ae42d48716d686ace4ef7d	2016-08-31 18:18:39	HS256	\N
2c1cca41-a6d0-4e4d-99cf-c6f5fb3cd60d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e4cf4ea845634f09b2e2080d406fc637	9bd198e590c841c8b6f9ec8c3306a5e4	2016-08-31 18:20:53	HS256	\N
76469a25-da61-4411-a5d5-4a3849961489	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	230bfd51db934b59bdf8d271db59a0ef	4f14c72adedd413ba208c71e70039b4b	2016-08-31 18:20:53	HS256	\N
571c9c18-f5e4-4ba4-9441-88ff62f11de1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4c9e4df5cd514bf9a58e3a7ee38102ca	be902ca4ddc54d0fb987bac71ba44197	2016-08-31 18:21:47	HS256	\N
0656c420-8a09-4b86-b0c2-e96f5930dda5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	406d52b237074d22ab85c8cc66ad4ba3	d18b25b4c94b40cd9b36515f6d86d7a8	2016-08-31 18:22:19	HS256	\N
af9a53a6-0a23-4840-9619-124b8034ec34	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0cd4345045b046108eb7c4d1942d0c11	70c50c15371d4facbca6770194b8bb0c	2016-08-31 18:42:28	HS256	\N
91ea6b61-745e-45bf-9fb3-2e3fd71fd915	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9936f88b0e1e442d89c473b34dec4d04	ee44f4a5f533482d9c69b838f329a609	2016-08-31 19:39:39	HS256	\N
8e084637-8bda-42f6-9cc1-172ea02f305c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d80d0d42f9ae4e02982a25bdc5de444b	272ff9cf5bc94c1bbb688278ba77a2fe	2016-08-31 19:39:39	HS256	\N
8976fec6-3b9b-4513-a65b-6038c6315466	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f1775367bf334c9883fa306f9084f2fd	8a7b16c06d314d14a7c9946973c7b54e	2016-08-31 22:45:34	HS256	\N
6fd284d0-2d78-43be-82f7-3e9499973034	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	80659292bd2341879b1344907f70f0cd	6fe66a5f0d5b49a8bbfc469dfed9478b	2016-08-31 22:48:31	HS256	\N
d91e69a8-ac5b-40a1-8718-58ad3b5bf7ef	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	513e0d0bf4ab46099974ea7a610ab756	8d0c46b03c184e39a9ef6800df8d5f3e	2016-08-31 22:48:31	HS256	\N
9b9e479e-7acf-466a-9d18-8d0da9427251	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bfbe726178c840eebf7c20b1430dacb3	b97c42188db6453c83519cb6f5c98766	2016-09-01 12:39:06	HS256	\N
f2771f90-18de-4f61-828c-2781f7853ca9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6df3508ef9af44f397e14d06218d2361	c2bee6a757a84c758bc48254a8f8cf4b	2016-09-01 12:39:11	HS256	\N
c2f98a3b-2108-4ea5-a924-6d1dd1547192	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	01581fc3a0884e78b2ca0e6130ceb6a1	6916ee22c1934237afe7cd1199fe3114	2016-09-01 12:39:30	HS256	\N
a678e2cc-ebf2-4197-a604-36323d2fa664	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	49e794c518f94169bd28b2f118a51850	02d3cb41cfbd4edf92691366bb46743a	2016-09-01 13:02:53	HS256	\N
d109df42-02f7-4926-b083-e87f1289718d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f6c1f54eb7ab40c3bf8909f581d3178c	7da8bf7ecf374b58a9620dacbe267953	2016-09-01 13:11:03	HS256	\N
8ffa2d00-fb5b-4ea6-823a-e2cd876db6f1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aae282db8ac64edbbfef7957860eb3fa	3f3262d4d9d548c09a51d2a476fa7a96	2016-09-01 13:20:00	HS256	\N
0e39fd93-71c6-4160-aee7-9670d93ce78a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	603db45d6de74e70a08d19aad87695f7	5079ee7b42cf4890ac01bd4f11e61481	2016-09-01 13:20:09	HS256	\N
5b019848-6a29-493e-8364-e6cccdd65d73	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ebe60ead84b4498ba6618aa473049ddf	5a85948a033a405db2cc73753d3fedd4	2016-09-01 14:29:51	HS256	\N
8876445e-508d-4252-99f4-c102438a6fd8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b4263d1587ac4359a5f9c429b1530734	56d6d82ceed64a3d81399ee7e7621610	2016-09-01 14:29:51	HS256	\N
77f31040-6619-4534-88cc-00b93d5ddee9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	04f90f2b1c184ef2b081e5edce7b8a3a	33a373e1c56b49809ff537624e8ed59d	2016-09-01 14:30:02	HS256	\N
87479988-c02e-4ff3-863d-59869c422ba0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	34e298e9865c45e9a2976cf3d50a3541	8093405aa5bd4635916d76b7c3e6a73c	2016-09-01 15:37:41	HS256	\N
8e2537d4-b759-463c-95fa-282f7bce17e6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2c7295b1e9a849e2b16b3ab094e11b82	a709cc507b964ef9acc2320c1d97d7e0	2016-09-01 17:06:30	HS256	\N
cfeee62e-61b0-4902-96bf-bc327a5faaf1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a7fcb23a12454ec19e41eb899fbdd287	12b5e598ed0f44d5a0738384e768117e	2016-09-01 17:06:56	HS256	\N
9cdf6544-5d2a-41b2-8aeb-d54935a1bdea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e69e0dbb2a014622b503bcb609f7aac4	f2c5e126e26a4a20ba55d6175b88db9f	2016-09-01 17:06:56	HS256	\N
5eb115a9-7218-4b22-a57a-9d8808cb42e5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cfc2e56e84fd42968f498f8366f08655	8f19f5f50f264fda958224c7adb355b4	2016-09-01 17:48:58	HS256	\N
7833177e-ef99-4df6-8bfa-b6632664e05e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2581d85874ab4991a896a3b3f353c05e	6cdd2fa0adf24c0eb2c847bb9064f63b	2016-09-01 17:48:58	HS256	\N
b2962e62-0f8c-4d9d-a29c-eb9ba7b74a28	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9cad567f3c664d5f84985cfca164bbd6	0b0f4bcbc7864540832ad0a9abb17a05	2016-09-01 18:37:38	HS256	\N
dd39a888-1cd5-482d-96f9-fbb33b053fce	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5e528ff47eb745fc86abd8445ff3a433	88ad9ecc8a01440d8ab50844828dd903	2016-09-01 18:40:27	HS256	\N
d674fdbd-1957-464d-8227-029f7a792e40	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ac01ed35852a451a8248938e17b9dd82	ab80cf89043c4100aa18d40ac9225f07	2016-09-01 18:40:36	HS256	\N
384f912d-c11e-45e8-80cf-957c06c93a70	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e177b97d761f4c9695c094f632518b24	ca89b4a422f6436785c85bb512ce5b72	2016-09-02 11:35:41	HS256	\N
000ef1d7-676c-49bc-8f81-c1ed5fdbc5c9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6b925f6a07a343ae86b126db6202d7d0	986e40328caf4aa9b2e070baa6b371b5	2016-09-02 11:38:06	HS256	\N
801c4a98-e761-4c85-8d1a-fc6f1921cf4f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8055ca9b2c8846d08baeae682a8ab5d7	35bfed5a05da4211bd82c44d73ec2f13	2016-09-02 11:43:04	HS256	\N
cdb674b7-dd64-4f47-b188-b265a0929952	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5b13537b7a3943e585923c321ab71185	a3d0d7a67caf4c37a680417b59ff87a4	2016-09-02 12:15:10	HS256	\N
d752acbc-be95-40ed-be0b-563d760c52b4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	49e219e41da64f77b93c9a3dfbf7fd41	8b929fbc63114fe29d3e7d1d8a1ad35b	2016-09-02 12:15:10	HS256	\N
627bc7e6-cc3e-4172-9586-a0f8624b10dd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f915649213384afeba76d787edb3e300	ddedd1696d914ee693d87c99f816dd55	2016-09-02 12:15:22	HS256	\N
204af91d-b9f3-4cd6-b817-7519391256a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4497742ac5cc479180848a0dac825688	9c5fdb9e754d44f99586719704a2eefc	2016-09-02 12:15:30	HS256	\N
bf79bdef-3964-4bc9-bc8c-3dc1d5a02eab	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d3046b6ed1bc414193cdc24002a9c4a1	8087f7e4b121478193276d75ead8257d	2016-09-02 12:32:08	HS256	\N
4a8f08b5-200b-4693-81a6-7aaca14aa563	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	116413e1ab204f6a95861b7b677bea2f	c44d5d38fe884023abc24bc30aaca57a	2016-09-02 12:32:08	HS256	\N
75cbf026-5476-4160-aaa4-ebbc345a06fd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	33f3ac5e39354ddc9785b5aa28845008	21a10fc99c45444688cb2f09b0bd59eb	2016-09-02 12:32:15	HS256	\N
aba269f5-ee5f-4eaa-a7a1-d3bc8b8af607	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6392edae8d224a3da251aec2ca4fb592	d6fe0395d304415f885021513ad476ab	2016-09-02 13:09:21	HS256	\N
6cbbabd1-8548-4086-8132-7884ee7afaea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	291bc68ca53c4f7f96ed8cde9b79a1cf	2d7b32b2db24454eb242dd8f92459cc4	2016-09-02 13:41:06	HS256	\N
9604973d-2cd6-47af-8334-f59d28c7d528	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5c6e82f057af4d49ab71c5f5f23a6f78	76affc7624164196be1c769ab4323fc8	2016-09-02 13:41:06	HS256	\N
fbe9fa51-4efc-49b3-9214-cb937f210e4f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce68957b0e5c47489a4a6d3423170838	c3a831f9e4b84bf899cd7c916e6c03b6	2016-09-02 17:40:38	HS256	\N
160b542f-7612-406b-ae1d-dd6122d95447	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9fdbf9356f8040f3b9b4c4534d130b24	25643ea3466d49919bff5d7217ab69f8	2016-09-02 17:40:41	HS256	\N
20913091-531c-4907-af46-7ce5b8282817	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	66b06ffe957e4cb5b345e122c1a8ee47	c34d4924912c43c897b6594834173e6d	2016-09-02 18:33:47	HS256	\N
49c55a58-312c-418b-88a3-4f16c182f273	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	af0898d2b15743b888244acc3866341b	6b5e11e9498c49f2a365b127cb1e4311	2016-09-02 19:03:39	HS256	\N
992f1e34-7802-4343-9e18-95da0862373d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	86314dc9c9cc404fba136959ca2e116c	89624429e145499a8071fe9fc6a304b5	2016-09-02 19:09:17	HS256	\N
10bb9c4c-5f7c-41f8-894e-a727b7b11cdd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	65af7f01028245e4b5fa5f92249641f3	86787bcee5954db3909a00cc6ae253ec	2016-09-02 19:21:57	HS256	\N
2048827d-c214-492a-ae0e-9890932d4f75	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3fad22c2d14f45efbc64592fbd14279b	0a106358e05d4799a781365949b61ba7	2016-09-02 20:48:46	HS256	\N
a223297a-c48e-4740-aabd-f7f91eb52f19	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4f991c5f92b34222be85b24f834c4c44	8c61b79efcca45a195314cf38b92fc55	2016-09-02 20:57:48	HS256	\N
d4b35155-4f48-469f-9e76-694b4bd8b294	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d2b3ac6929da458cae1e00ac0bbc878f	2c576b8b74c340c6b78d6b1c4d590c02	2016-09-03 16:08:13	HS256	\N
2d430962-cf2b-43a9-a68a-6e0361fc7c82	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	88594c8832cb4ebf80b5a22c7e67bb4a	0c62dc4bb50f4c7088bf6de5f3934e56	2016-09-03 16:08:42	HS256	\N
8724f598-c06e-4688-a6ad-03a66b1c2230	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3b9660ce9c6d4e8f8f10d110f035eefa	1f7bf82c5f8e4839bf4082444fda0992	2016-09-03 16:08:42	HS256	\N
99706bc8-7027-4fc5-a6fc-fe52422402ea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	60f03a49d51441dbbd983e2b9045f7d8	3a3f18e176454fd5bd3615ee1789f70c	2016-09-03 16:09:41	HS256	\N
68dea9ca-19e0-48e0-a975-a42eca6777fb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	11e0daf1e96a4c6a8486d798ea59fb1c	1eb2601d3d1c4ca1aad5b1ed31ecf420	2016-09-04 04:09:01	HS256	\N
6aa1b6c2-57c7-4cc7-8c89-27876566db68	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cb35d7546a0e4c93bcb1a322bcdd61d6	18140c45b62841fea5d99a55051df03f	2016-09-04 16:47:55	HS256	\N
4de0ca4f-41d5-427a-9729-36f72c390be0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	487b51fbad9b425dbe8de8f4e7aea1cf	e0c256a493b44137b96d51c1b8587610	2016-09-04 17:29:16	HS256	\N
b4a375e1-df0a-4d1c-99ee-fd340f626b44	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2f2db69bcd254fadb1d450281b56e185	1567a305fad64b43b92ec4048140f643	2016-09-04 17:29:16	HS256	\N
b3a35671-ab46-41f7-9547-bab0510ce6b9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0e5061f7f3884f9dbfa80064374e638f	ee99404f728d4b5eb911f1ddb0e1d8b9	2016-09-05 12:17:27	HS256	\N
354966dd-8055-4d08-b200-ad6a59cfee30	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	00617a4a4cb5447ba2c6f5e0009f0b90	9f46734047fb4407a5a9be71a825fd85	2016-09-05 12:31:18	HS256	\N
a700bef7-f689-443b-affb-3cf4d9909430	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fd0d9534ec2b440abf3d91240dac60be	d2c9408d0a5742f3b4b8ced121ec9d0b	2016-09-05 14:13:57	HS256	\N
c65bbb9e-52af-4a88-a469-7132bde63de3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	83ea37cb6340473397d4b163ced997d8	5f61c344cf294a0da5f44176b0d0b5a7	2016-09-05 14:26:39	HS256	\N
73bf7f2e-de9e-4778-8642-a468336094f2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	851e59fb0d934078a6ab08ace4714662	a114c49fd88341fa8258e64e3ad9b5ea	2016-09-05 14:26:58	HS256	\N
118c2f2a-61e4-4946-b3de-63db495f7ad4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	daa5b083f00d4fcf89dbb170d0c1e723	28543263ea0a4282a16d777d59f3cad0	2016-09-05 14:42:49	HS256	\N
3712dc9f-d7f3-4d71-ae26-56a5c3988662	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4bf504a87de743078cd11acef1e4c031	d4b58d3dd23340c897d83842717b62a7	2016-09-05 14:45:31	HS256	\N
2167a23e-37fd-482c-91da-f04cb53de658	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3d668a9c92e844efbb4d8a2756175626	7fb6ee4c9b7f45118de460617beae375	2016-09-05 14:45:31	HS256	\N
5cc0c7d4-b1b9-4c06-9b4a-33c62af1488f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6bd16b6984f34871b652f38649419a8a	13648e6de43040db8307bc5b446a8878	2016-09-05 14:46:03	HS256	\N
3da8707d-8d8e-491a-a087-7073ece7b6ab	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8f8e6595b5ac4084b79dc02fc643ebf2	e29cc5e5d9344d3692799069d97f1585	2016-09-05 16:28:35	HS256	\N
2852e9ed-500d-4352-bb42-e396937b59ff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aeab9707f7dc4664ae1862329bee9a23	accd4ae28c5847168d0daf84d584e0bc	2016-09-05 17:39:41	HS256	\N
2368c19d-1318-4b2a-991f-3ff788d9981c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c86acbd6215f46d68e1b2d5b4a1b0cf8	188c12d1b3aa44cdbb4244e6f79369ac	2016-09-05 17:47:38	HS256	\N
858dbac8-65cc-488c-a423-9b00a1a5aefa	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e59e297046a04cef9c80284c29d2dfa8	d68f80fd236d4d9cb59bc743d2ee74dd	2016-09-05 18:20:28	HS256	\N
642878a7-def9-48c2-8aba-f3bde8684b5e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c99c36cc209c48f4bed8fe4273dcc1e4	4a76cf6dd6a146fe86b3ca3cfa564870	2016-09-05 18:20:28	HS256	\N
7e3abe40-a1c2-40f8-9653-160c257bf135	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e842d1da754046129ff9eacaac3a6865	937a93594aea48ddb8c834b632c2c92a	2016-09-05 18:42:37	HS256	\N
39982249-08f8-4ce1-8848-b2f7b393153d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b69c428a7e3c417e9b15fef67c05dbf3	1e03b3e612b74b5fa5c63d54b4bed84c	2016-09-05 20:18:09	HS256	\N
c493ed7a-e3bf-459f-b03f-be1f0c7afd00	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d95ddd23bd934100a3cca05ca10cb3a9	30902df2259a482fbbb522fba546b3ee	2016-09-05 20:45:42	HS256	\N
f0ca6a72-9361-48b1-9a4c-32af55c825bb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e4ddb6a0273a489ba880bc1cae9048d0	1ac8fe35cd90496e945c7099858ec96e	2016-09-06 11:49:55	HS256	\N
c001c346-965a-4f93-8687-f29836d43126	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fe8f9f5b02504b48872686afbe49a2a2	16b32e7197f3402f87ff21351769cd42	2016-09-06 12:54:45	HS256	\N
f99e285c-25db-4ebb-87b8-73af57e291db	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d652eafb6bc54a80a47451096a48389d	97de441f75da414dbd47100ca1191bd5	2016-09-06 12:54:45	HS256	\N
ffc11772-51ca-40cf-9446-b25d97e3d364	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7870ec1beba34823b55df6c158314c79	4218c7e5eb8c4a828302377af66ee50a	2016-09-06 14:04:30	HS256	\N
297719d1-2642-4d6e-a6a3-4e5ca63291d7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	34ba1529f8df468494d65c1b34f1932f	0093d63552564a1fbb412712860ff615	2016-09-06 14:04:30	HS256	\N
0beb04b9-2ca6-400e-98cf-ec080ffe8ac1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6b2367e5b0d146a68e6995aff2a68461	7eae747cd0b94a6ba70acb48f4b0ab73	2016-09-06 14:05:38	HS256	\N
51bf7710-29ab-4330-9878-0291b712521b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e1c623a6bb7b4fc5b6de9baefc2b1d21	c3690b18660544efb3cbb89f47d5ff69	2016-09-06 14:29:46	HS256	\N
0be136a1-ee69-4a15-bd16-b435a787f46a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c89545b14f8d42929113385fd4237729	04906694cbfd4738964fb092712fa475	2016-09-06 14:30:37	HS256	\N
e0dd2768-2502-4135-9063-d6b197152ba6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	15accd9b92f3435499ed675d5d4a670e	3bb0317ff0e5493a815312fc06c7dde4	2016-09-06 15:14:16	HS256	\N
9438de15-122a-4067-bb94-a8a924d7b727	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	40937c0b1a3440a3b9f0facd7093b062	51b5044c874643be97d9d1374d15ef5f	2016-09-06 15:14:16	HS256	\N
f1527d61-dabf-4cbb-8f5e-792b336a026a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	305fabad17de4a9c815b58c7a42407dd	d9d604bd08ec4de0af8e04ea6b4fbd9f	2016-09-06 15:14:27	HS256	\N
b65cd3c1-143a-40e5-8e1c-57cc3bc64d53	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	305bc6138efb4b46ba642cf11aac11a5	0a3eff8af49e419aa38c8076b2b75f82	2016-09-06 15:37:05	HS256	\N
9e0fc092-fac1-49b6-80fe-83c233491a33	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e1920f395b294f548f9c2522075fff64	2ac61afe5f4347b48c790769091eb3dd	2016-09-06 17:32:36	HS256	\N
58f4d37b-ffef-4220-aeef-dcfa27c04b6d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2098e69c3ac84142816a0069a98d9c58	f9e99f48a9c24a4c8ecef95c29377ce5	2016-09-06 17:54:48	HS256	\N
e89f1318-0ae0-4ba1-b534-325d51ed5a80	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e750f2c81f9c4245bbd4d6a22d82daca	81bad87cca1a494d854659c9b958f1b6	2016-09-06 18:11:53	HS256	\N
b8a5a7f0-96e3-492c-8e0c-d7a8dd80c702	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ce4f717ae9cd4113b563a2c281630d0f	af0b2bfd96b44ef997f0dff6cb8e7777	2016-09-06 18:11:53	HS256	\N
c1c1b942-8183-4db8-8de5-9ab9d66b7c44	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8da83165cfcf4369af7892772645aac6	2129960bf5594a1ea3a479faaf7b2b0c	2016-09-06 18:25:32	HS256	\N
a101025c-9baf-4ff7-bc07-54cf47ce0486	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2a1e94229df74d5b8d4650638f407735	49dd2bf136114a5091039253abc0f88d	2016-09-06 18:25:32	HS256	\N
4442dfcc-83c5-4b40-a3a2-3d77494cc07e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c57f9584f87c4e739dc979f85d6d9018	31172497ea8742d48e951b61923ba77e	2016-09-06 18:25:59	HS256	\N
1b096b64-53ca-4fb3-a77a-5e91418d70ba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e98109d92ed6495ea38821ca96c4c20c	6be2d23b4b85408b86eab3c78f249198	2016-09-06 18:26:02	HS256	\N
d85dcfc4-de54-47c9-8535-e4454e71592e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3ff50cce9a3a4608a5aac59f4d43da26	a50062497dfd4522b451062964e215dc	2016-09-06 18:26:02	HS256	\N
64e48993-2de3-478a-accc-e6158494e4e1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aca6263e3adb45e1ba85d06f6bdaa145	cf3884d145674e11a7e04bb51239dea9	2016-09-06 18:26:27	HS256	\N
55c6ab42-1830-43ae-96bc-32ebbe109a86	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2a18ce3807454fb98cdcaf8b4566a3b2	4b1a9658ebe947c19b6e6224b2e1e634	2016-09-06 18:26:27	HS256	\N
7b9b67a5-ebb9-4be7-a3d9-e599a66d1130	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	af3662953a0746fc98b9978595040912	c8e163c1836c46e9b450207983bbe7d8	2016-09-06 18:27:56	HS256	\N
c8a0331b-5a73-46d5-81ea-727a074c8370	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3b76b007972e4d27b946e9cc9eb8b9c9	2cf4d8eb76c741e69ced333d8d258bf1	2016-09-06 18:28:11	HS256	\N
e79c6e58-8049-4193-81ee-23388fa30d63	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f63ecd2c83ee4377afe8116083e31efb	58a83a8d58bf47b4b0cbc804b27e444e	2016-09-06 18:29:37	HS256	\N
9811dfab-faf0-4bd3-a0a1-68df47cce2cf	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	6bdf98d8c0d244719a38e08a9503c24f	3ee24b251b674a479614fb760f30aad1	2016-09-06 18:29:37	HS256	\N
bd080665-b99b-4dd5-8ab8-b1c992e436e6	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2173728a91214e709843292da6e2a543	d43d95ec97e64e73b06782f4773421fa	2016-09-06 18:29:42	HS256	\N
a1131393-b0db-4509-844e-79621c4114c0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	84398071148d46e4ab561073263cd356	e193583f7f3541e0ab786504e664ac76	2016-09-06 18:31:11	HS256	\N
1bf35fe4-42d4-4fd7-aca9-7564f1e9ea78	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	efb079a5b65a4426aa0e15661ddf2dd8	a0c6771e7e0d4df5844f435307492e2d	2016-09-06 18:51:47	HS256	\N
735958b3-7500-4d20-ab91-de61eabb2814	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	17eda3fbfb7d495ba78b6489900b8374	f5a71a618a16442282582d5ffec66224	2016-09-06 18:51:47	HS256	\N
71a22c10-0e35-4ae9-b079-15badabe76c5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	963c2d083dcf4bfcad2fa14807d4916f	19ff8c49a27a471685e8ae1c72e63cb2	2016-09-06 18:54:36	HS256	\N
b2c68cc6-8736-4f52-ac23-740fcf4d2819	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fc72d4eda64446b9bc8cacf77138bb5a	bf1962e0fcf54fe0aefb966bcf05c0f0	2016-09-06 19:03:12	HS256	\N
b819b7cc-0546-49e0-99e9-a2cfc98c4775	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1837e56d22ac46ef925e425b059b9eda	634568111413418fbd4d87c2610a6c24	2016-09-06 19:03:12	HS256	\N
d8f7339f-d53b-4caf-b5ca-59a14909384d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	aa7b19fc037140d9a07d01fd6e666d5d	3c820d40d0e44c06bc14a1ce7e50ebe8	2016-09-06 19:04:04	HS256	\N
0f623dd9-e66a-4e1c-b6d9-cc70099d5735	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9bdda3ed4565411f9e817df4af3d8f81	07c0dc776b8c43b9bf6f9ecaae0a99e9	2016-09-06 19:04:04	HS256	\N
21675d05-2cd2-43a7-84f8-147acd625d65	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	67bbce4948ea4bc5b53446e5e4ba51f3	f71ccac0d3e24feb9f01633a8fafbe85	2016-09-06 19:23:29	HS256	\N
c010b92e-1a7e-4e93-85eb-26796d38a9e1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4164a476514a48d68c1cd277bc745c87	01d292692a934e3992a9bfd19269287e	2016-09-06 23:06:53	HS256	\N
ec772ce8-e034-46a2-b3c7-916d2c2135cd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d529bc12a9dd4673b8837057409e5c7a	a66c636f6bd74011858c3b12e20e8001	2016-09-07 03:01:52	HS256	\N
5022081f-4e7e-4ed0-a7f4-b2d34ec60720	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0b45bae2f71c4e2ea217efc7b689f4cb	f232d1de001a4632bf2068efd561fe18	2016-09-07 11:59:58	HS256	\N
691b8ed7-a7c6-4717-b28b-4f715e003f98	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fef3e4200bf04c5a9e4a07e2ea55ca7b	56bf6c47eb914e31bbd88a1b710f02c7	2016-09-07 12:18:47	HS256	\N
9ff51e50-f39d-4814-bf5c-acb7b9f86095	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cefdd312bee34385b56daa3e1041cefb	3f93a138c59c4465ad4e642aa0c312cd	2016-09-07 13:34:22	HS256	\N
7935d7d2-d554-4bcf-b7f3-8fa1d79b9be3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5323942f02ac4255a703308a01a938fb	6c9309be1d0b4c2b8d3efd5131c77bd3	2016-09-07 13:35:35	HS256	\N
03a64a39-6dc2-4e22-9823-0e02a3c1d963	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	2b9e9f1e5afe4709b3aa7d7f851f1d1e	f75de34638cf418aa0c6aa865b6e07b2	2016-09-07 13:49:13	HS256	\N
1d9cfb1a-8ed4-4ba6-ab16-c2240f8a2a07	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	08c7d6f33f4a487d860409ea25ac45c9	e4fda69b9a9e46b280760fb1daef48a6	2016-09-07 13:49:13	HS256	\N
d7ed76dc-5c6f-4d60-b043-29890a3f1ea3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b880ca7212b74e07b083dfc76633d2b3	13b52b852c1647bfa67ce16f46f30ac9	2016-09-07 16:50:11	HS256	\N
c28bfa9f-7ffd-424e-8c8b-9350a904b02d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e899196a7ba34229b3fb7aa3f276714c	ab42df71fa6e4312944a709cd1d2e38f	2016-09-07 17:34:01	HS256	\N
65195fd6-1536-486d-82a2-a473171ef62c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cb87e8852c3e42f8b0b02475d819ba24	51b27e07c33945519c8016ff52c533c1	2016-09-07 17:34:02	HS256	\N
13c08c1f-cc14-4147-9a66-18d394eab5d5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	467818fab70348ef94627b8a94ec8038	93e9f5be98644f66bdf471662a066fbe	2016-09-07 18:01:04	HS256	\N
31fb9960-fab0-48fa-a5f6-0bc12df408f7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d5744798200d40d2a887d8a913686b87	3025e0425d1346508d8860d60946a257	2016-09-07 18:25:55	HS256	\N
cfa5fe17-7a1c-426c-b7a0-47000e3bb3a5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	61b3729119674798b8fac272c05928cb	250a66f51640428e89143991f03074ae	2016-09-07 19:15:49	HS256	\N
fd7a34bf-e08a-45b7-ab06-a9f8cf0b4e08	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4061e0cfad2048748d9b1bea52a8a820	4928d7d237f542f3975e7ef4525ffb95	2016-09-07 19:32:49	HS256	\N
f1da5ebb-ca74-448e-ad7f-007d1aa1b376	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3a8dd93873ef477cbc73cc5b426eaf4c	0b3050ce4ad94bfc9a4ac828fdde2fac	2016-09-07 19:45:15	HS256	\N
96ace989-6271-4f5c-856e-4aae575b5f5f	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e3c5f85a66da4349960f7f3ca172b6ea	b9514ba2b8d145e19968fda6402e62d9	2016-09-07 19:50:07	HS256	\N
5afd4c7a-7cc1-42d7-8380-42f03686b049	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	822404c2b3cb4b5bbc0964d17651f92d	38d5ceadbfc1486092f6ff64ef7bd809	2016-09-07 20:00:10	HS256	\N
748d3e33-e680-4454-aafe-2585387d50f7	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	43952d494fab4dbdbee473724e99ba94	c6e7233d759e4b3d8c2f9f4bf55aec4e	2016-09-07 20:00:10	HS256	\N
d3681f0e-3d32-4e43-9834-26b886b32ed3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	dd0bb4ba163e4ebaa29a5b6424adf59a	b998f4f5c874434393529306707ccfa2	2016-09-07 20:01:20	HS256	\N
99d0f580-79b5-4b4d-b1f3-e83cfdf95a18	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9eaccac47cdf4842b5954b8357ac5ea0	4fb6cb6a966c4246a79ee0f6b757ec3c	2016-09-07 20:01:20	HS256	\N
36a1b050-1254-486f-98d3-c4bcd450f96e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1abfec1ae71f4c95b826fbdbce3b2c56	eed610e4d3da4538b5cf45daa8effdb4	2016-09-07 20:09:17	HS256	\N
3055cffa-8f7d-4f9b-a280-7c10d53de0a8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cae71a5ef16e45149962ea333b0c3d50	fccdad58bf4b45519f29292c9c3706ea	2016-09-07 20:09:17	HS256	\N
ad01b291-200c-4ba6-bf89-23ab445922d5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d20f1e95380e48d5a7c70b5fd8a4c45b	646556a1dbde4ddfba515211562d6853	2016-09-07 21:42:55	HS256	\N
8219fd6f-1101-4943-aff0-32505dfcf793	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	51d176a8f67f45a7a3d6f43412dab790	5bfce5d8e1d64035ab7dfcc2a6281b99	2016-09-08 12:49:20	HS256	\N
7556344e-d5a8-446f-8601-6e4902964ae3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	10fa829e2ff44a81877c1ea3cf6c7555	2e27c067a33049da8fa221c53b607ae6	2016-09-08 13:36:37	HS256	\N
a557daf0-4ea2-4b4e-b63d-ab31af0f4a78	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	fa878d9c11e44faea618c38f8ac7e586	f7a6abe0f7da4195889672c97ba21c15	2016-09-08 13:36:47	HS256	\N
168b3ad1-f5e8-40f8-90bf-28ff4a99a5e9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	16deb8d4a07545f69e82b5658afd97bd	e97c343316a04008a97be1de39a1bdff	2016-09-08 13:36:47	HS256	\N
c2569c01-517b-43a0-9493-2c8693b3e8f2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7c5a8e66e9f147cc9c623b7e8a43018a	13b06ba6d1cd448185989cf0ba8d48d9	2016-09-08 13:58:37	HS256	\N
7dd340b4-c9a1-4896-ab13-dacfcb7b293b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3b530b357cfb4da58b536c4933b2303e	ee2f497d3bde4a50b94082b253bc324a	2016-09-08 14:14:57	HS256	\N
2df1374e-3238-421d-9184-76f4bdbc6cac	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	43b7bec9c44448b9a58853f48656ef42	841dbf4e2513494294d164a48032d9b1	2016-09-08 14:14:59	HS256	\N
276d8183-6a6a-4341-aed5-707096f4abed	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	cf054b47e5fe449baa761071a35b0ad6	d2128c6afd44404b9dc3753337e0e796	2016-09-08 14:14:59	HS256	\N
73dde07c-0bc6-404f-8704-9fc62f00763c	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	de5c3aec3f66425686e2bc01dfe48746	398bb3070d594fa5b60bcbd094138925	2016-09-08 15:14:05	HS256	\N
707b1d55-fded-4e14-a3f4-ed6a9234c319	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d8c5fe262c484d41a8d08605f9116fe0	6a89d78fb84e4020b0f0d3165d0ead5a	2016-09-08 15:20:10	HS256	\N
021cf031-cba9-446f-9b0d-c4d97b465093	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	672c123ef9144fc394e4ebe3a40f57cc	6199020f00bf405bb826b10a6322e7df	2016-09-08 15:20:10	HS256	\N
dbd882a3-ee18-43a3-b132-82d0eb7071fc	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5361f61e20fd4fdebdac01a7c1063c45	3270bcc1e675479288d4b1df6d79125c	2016-09-08 17:40:46	HS256	\N
ffa774f4-a7b6-45e7-8c2c-d657f19f4a19	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	3b300e2c925c4aada94e09d84409d48d	5b903e48515b48a29548097977855070	2016-09-08 17:40:46	HS256	\N
1f7fbced-7d9f-4d32-9e3b-fe16ff8ffc95	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	717b551270174a4ca252aa8e7018a51e	b3c09b27ed7344b0b69fc5a00454a48d	2016-09-08 18:00:40	HS256	\N
409d1265-1ead-4df2-9ec8-96fdad53cb0a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	b6b6f13a2b384a9596e35dda7eab3d75	d2ec3811538a4071b97e078997235f53	2016-09-08 22:18:42	HS256	\N
d1e4c662-2ef8-493f-8148-db737af5b79d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1b0daac35c3244bc9a20586936468db0	eb06df68440f4c7e9ee4b628f3cdc2ac	2016-09-08 22:18:42	HS256	\N
8ab85cfc-3ace-4f4f-8d62-8651a956f9a8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d962f565a09647739eef35deb2b59263	7e77d8c27c4e4a398b92ddfd5bcacb72	2016-09-09 11:17:18	HS256	\N
d1f5427b-57ba-4aba-a258-f665084a66c9	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	a85d014cda8647b284512660f4005950	747ce032a22147a6802cf8e655355874	2016-09-09 12:41:35	HS256	\N
d8424f5f-5519-428a-a796-9b1ef044de59	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	423b3e49eb764c65a46813c9d355db07	912e6caa396d4fada025769b1847c4c8	2016-09-09 12:43:46	HS256	\N
479b619f-8cc6-4722-9666-e4d9fe8c5066	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7e038ae178cf442db51f92bb74b64d21	681ceb62ca104ecd9440e1159fc8ae7a	2016-09-09 12:43:46	HS256	\N
9bd5b7c0-2e83-40e0-ad0f-6c319a9d7d10	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ba17569fee0a40eea9c4bb92f54a88fd	a40ecbd03f094fe4a0ca63ec7594d76c	2016-09-09 13:31:12	HS256	\N
f87de559-e446-4024-ba2d-cead55e095cd	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7628d0e1e341423aa3d225516d2f6853	1b2cb03e640242b2b076edc5bede6c10	2016-09-09 13:34:07	HS256	\N
1eafcd81-a16d-495c-8060-b97bb0937246	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	bc4dec6b5f7a45a2a8eebc171db3cba4	39b38a2aa7d84904be3a8fba874f5d47	2016-09-09 13:46:08	HS256	\N
a589b6fe-55f7-4d74-968d-87d1aff0faf2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	476e81692eaf4929a3f14f1718f440d6	e93dbd9dbdcd444da67474b904f10873	2016-09-09 13:46:08	HS256	\N
a2babf25-aba2-4a18-a366-03f6e19b084a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	d381eb35007b4f2fb2ab189caa927559	ed68e82d088f48b98c561bda67f071bc	2016-09-09 14:14:58	HS256	\N
ef5da8bc-e5fc-426a-bf47-bf5a4d4337fb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	14f563436b6743afb0c84c7f8412b9f3	43ed9152670a49b7b6a9e81216bae9f6	2016-09-09 14:22:54	HS256	\N
e9d7420c-3a96-4546-aad8-6417d6f5b8c2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	02cf024d29624168a8ff7a770da4c9f9	1a9023c2d9fc41bdb04d73c1c974beb2	2016-09-09 14:22:54	HS256	\N
6c59ea49-32e5-44b4-bcb6-2f595ed77ddb	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	32f04eb672fd42eea38ea12dbdfa9a1b	0b9a063b177f4458bd4567d14f2befa0	2016-09-09 14:27:33	HS256	\N
fe6b3cf7-d795-4893-a8ba-242710d3966d	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ffb90396ac9647a4997f29d89eaab07b	269ea5e199794f70bd282a979d517d3b	2016-09-09 14:37:00	HS256	\N
2d68a4d2-32ca-4540-b731-21693c944ae1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	26b594b9c36849fea1c2bf63c398a58a	f70a8025978a45688a7dfa05d9bf2f05	2016-09-09 15:12:19	HS256	\N
2b7b0305-fc32-47eb-afdc-649afa6ee733	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	56f58a85a4364c3cb5b3ddf5c9668ec5	1515a67269f246a0b2266ea8e861646e	2016-09-09 16:11:32	HS256	\N
f15a74e3-324b-4ace-8a6f-9ae56747b301	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	e3d1bd78724f416e819e529a64fbbc59	0c732aab26674d01948ad3040bfcccf3	2016-09-09 18:01:23	HS256	\N
70a144c0-a6d2-4ff7-95b4-9fd9c4c8d327	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5ebe1bd305bf40258468e81e2abfe407	3a5ea6adc9e04738aa02a36b49420233	2016-09-09 18:02:30	HS256	\N
d17e40b4-20cf-4b59-9682-7e95645ee5b5	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7c1040c7cac94b27aade27305b2072db	b472f740736d490dace6049143d711c9	2016-09-09 19:28:14	HS256	\N
9512aaf7-a97d-44d9-bc15-80424778b309	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4cca516f5b4a48269a907839dee11a5a	71147cff26cb459fa445c3a39b8e711c	2016-09-10 23:25:32	HS256	\N
6f7315f1-513f-4919-a7dd-94905786c8b8	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8bbedf1306f84c02b159a7e8999fe0ab	0f801b1cdaaa4d60ba73e2499d37370d	2016-09-12 11:47:20	HS256	\N
50a36d8d-a28e-4ba6-b07c-cd7777215511	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	37b49ebcf7514ec3becae86ef3dcbd12	f28e245611f446f7951c05259753190a	2016-09-12 11:54:09	HS256	\N
66a92cb8-3fec-45d4-a734-a2ac93db975b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	186a7e3338ad480ca26a2e4e3862f2d8	b9d17b985dd147648f47b1c565f197c2	2016-09-12 11:56:55	HS256	\N
bc28d89a-67cb-49b1-b05e-1603a6581d72	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	371e1987314d4155ae8d92ac47fd5e91	a01490c2aff94d48bc8c92e326a530a1	2016-09-12 11:56:55	HS256	\N
94bab3fc-76e9-4a33-ae8c-797ac91e693a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	256152d841a94b959196e0f37dfdbdfe	5de176a4ffea4e7f8ff210a9a6859ce1	2016-09-12 11:58:41	HS256	\N
6bc59248-ad9f-4423-b5eb-317a660a0058	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0c4cc9a5f68347b7aed35dc489630921	a5953a3b55fd4464a5a7d6be8c75e303	2016-09-12 12:23:36	HS256	\N
bc10f018-dec0-4510-835e-5b665922d46e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	5133c240e4514945a82f29e49e89eb9a	f6b449a4275c44f9b54ccb2e3f7c2c14	2016-09-12 12:38:20	HS256	\N
895434b3-e46a-4e31-b348-29847328011a	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	4c798bdf6dc44eb592229d2cc98cdfcd	45bf03150b604c3083b1330b90b56fda	2016-09-12 13:36:57	HS256	\N
781b8dfc-3ffd-4c34-84a3-76a2273532b4	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	f998a04610fa455ea95fc211553ab154	b352e340af5145aa8d8918d04896e28e	2016-09-12 13:36:57	HS256	\N
2c8ce939-3e07-470f-9029-488b102d35f1	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	0485dd09ef2f4f20aeb36723e7e016da	dc407f713d8144f4bae8330e7e457a25	2016-09-12 17:28:59	HS256	\N
ea261755-aa96-4543-9c4d-d8160145c1ba	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7404ca32e62a486ea98c255cf8c23664	f54e8da735204a8597b4943c2bcf5206	2016-09-12 17:28:59	HS256	\N
4b8a3c1a-91f4-4f9a-b1f2-31501e7001a0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	9c739c76136a4f6ab4111d04cd61c0e3	fb469bc9e817406db443e003a5feba67	2016-09-12 17:49:19	HS256	\N
587b4a89-773a-4306-a700-43fc4df897c3	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	78f31f1d074741c8891e5e193f68aab4	52679bf664d144dca822e3f878fcb7ef	2016-09-12 17:49:19	HS256	\N
20e53b28-991d-4979-96c7-3959191532c0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	36462debe4644d008a83788cfc7e360a	df0ac664a5cf45e6a015a3be27cd42e7	2016-09-12 19:33:57	HS256	\N
6ad623e8-95af-47e3-adbf-23fb6310ca93	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ba582f4979414a49a6d8010ce8e951b2	c3de05f5003e4fe38c4ff97f573bf7d5	2016-09-12 19:34:03	HS256	\N
4be4294a-f730-4bd1-b6ee-1ee6339489ff	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c8bf156e955747f08e8a8c5327549450	b2970f67ef7f47f99cb14e0f672e8921	2016-09-12 19:34:03	HS256	\N
0ae2cbbc-51f4-445e-89e2-b5a1b40e4bd0	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	8141935871cb4c9b8e7306a8ce9746ec	d6b260dcd88f48a1ae18fb8ae3605bd3	2016-09-12 22:30:08	HS256	\N
f1073d24-9465-4933-b431-f65103699ade	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	11b52c860806475c9d993cc3a54c1ee9	9d31221c628f4959bd8e431eafb2f613	2016-09-13 01:22:28	HS256	\N
00d58dfc-2a86-4331-841e-c7a8234e31ea	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	7bbdb8bc2a704e51b580a90ce54393c4	02d25c7e8cb9456189db208813b5c093	2016-09-13 02:44:59	HS256	\N
479ebdaf-87c7-4795-82c3-b27b4387459e	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	ed584a811c214d4b9ae4e80e66377987	a18808d7c82340e99ac9ba9e6e0e0af2	2016-09-13 12:12:46	HS256	\N
5bcc88de-c7d4-4206-a83b-bc689a996510	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	c8b2da0822554ed490b4c09a8dd226f0	df7ad481122a4a04b20465b50b2c0204	2016-09-13 12:50:43	HS256	\N
e46a76cf-a126-46ae-adb0-65056f4859b2	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	79b12d821c0f4c22abc7ff0c3c4df5d3	3e1f969d9f9c4128b96ec6de6e8e07ab	2016-09-13 14:29:37	HS256	\N
3990bb5f-5a71-4d1f-90fb-3db7e010995b	7fb5addf-5263-4a28-91dd-8f9bbc44ab16	1c0da13a490a4110881e0f7ef0983010	ad1f1d89ba614c4ba33b5f1115caa4c6	2016-09-13 16:59:09	HS256	\N
\.


--
-- Data for Name: keyauth_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY keyauth_credentials (id, consumer_id, key, created_at) FROM stdin;
\.


--
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY nodes (name, cluster_listening_address, created_at) FROM stdin;
odinPreProduccion_0.0.0.0:7946_3912383a9ced42219ab94a5e0dfd2ceb	10.0.0.11:7946	2016-09-13 15:39:44
\.


--
-- Data for Name: oauth2_authorization_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY oauth2_authorization_codes (id, code, authenticated_userid, scope, created_at) FROM stdin;
\.


--
-- Data for Name: oauth2_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY oauth2_credentials (id, name, consumer_id, client_id, client_secret, redirect_uri, created_at) FROM stdin;
\.


--
-- Data for Name: oauth2_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY oauth2_tokens (id, credential_id, access_token, token_type, refresh_token, expires_in, authenticated_userid, scope, created_at) FROM stdin;
\.


--
-- Data for Name: plugins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY plugins (id, name, api_id, consumer_id, config, enabled, created_at) FROM stdin;
5cf1e12f-a467-4e22-8b2b-9fcb95e1d9f8	acl	6b6e07fb-7040-417f-90e1-353cf3a70d1d	\N	{"whitelist":["external_users"]}	t	2016-07-20 18:30:04
2c58b6f8-f1d7-4b75-a935-8837a98f7be5	cors	6b6e07fb-7040-417f-90e1-353cf3a70d1d	\N	{"methods":["HEAD","GET","POST","PATCH","PUT","DELETE"],"credentials":false,"origin":"*","exposed_headers":["Authorization","Content-Type","Content-Lenght","Date","ETag","Connection"],"preflight_continue":false,"headers":["Authorization","Content-Type","Content-Lenght","Date","ETag","Connection","Accepts"]}	t	2016-07-20 18:35:12
eeb3cd0c-1bad-430a-92ed-2899001f53f4	request-size-limiting	6b6e07fb-7040-417f-90e1-353cf3a70d1d	\N	{"allowed_payload_size":2000}	t	2016-07-20 18:40:32
877959d1-33ff-4edb-97ce-b86f7e8460df	jwt	6b6e07fb-7040-417f-90e1-353cf3a70d1d	\N	{"uri_param_names":["jwt"],"secret_is_base64":false,"key_claim_name":"iss"}	t	2016-07-20 18:46:50
\.


--
-- Data for Name: ratelimiting_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY ratelimiting_metrics (api_id, identifier, period, period_date, value) FROM stdin;
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 18:46:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 18:46:57	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:39:49	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 18:49:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 18:49:15	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 18:00:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 19:44:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 19:44:17	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:54:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:54:30	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 20:00:00	8
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 19:52:20	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	day	2016-07-21 00:00:00	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-21 13:41:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:41:20	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 19:52:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 19:52:26	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 19:00:00	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 21:00:13	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-21 13:00:00	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:46:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:46:24	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	month	2016-07-01 00:00:00	20
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:50:39	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 21:00:37	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:50:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:50:44	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	day	2016-07-20 00:00:00	16
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 21:00:00	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 21:00:47	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 21:00:00	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:51:05	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:39:36	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:51:08	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:51:00	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:51:39	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:52:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:52:37	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:39:47	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-21 13:39:00	3
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 18:46:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 18:46:57	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:39:49	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 18:49:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 18:49:15	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 18:00:00	2
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 19:44:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 19:44:17	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:54:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:54:30	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 20:00:00	8
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 19:52:20	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	day	2016-07-21 00:00:00	4
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-21 13:41:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:41:20	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 19:52:00	2
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 19:52:26	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 19:00:00	3
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 21:00:13	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-21 13:00:00	4
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:46:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:46:24	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	month	2016-07-01 00:00:00	20
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	year	2016-01-01 00:00:00	20
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:50:39	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 21:00:37	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:50:00	2
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:50:44	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	day	2016-07-20 00:00:00	16
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 21:00:00	3
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 21:00:47	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-07-20 21:00:00	3
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:51:05	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:39:36	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:51:08	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:51:00	3
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:51:39	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-20 20:52:00	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-20 20:52:37	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	second	2016-07-21 13:39:47	1
52c4fa2c-f9b1-48ba-b57b-e90ce85d1648	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-07-21 13:39:00	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:28	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:25:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:25:55	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:30	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:26:01	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:33:00	10
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:33:58	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:26:00	11
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:26:11	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:30:35	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:33:44	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:24	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:31:12	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:31:00	10
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:31:21	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:30:26	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:57	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:30:23	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:26:06	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:30:37	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:47	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:31:15	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:30:24	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:04	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:43:19	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:01	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:26:10	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:30:00	20
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:30:38	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:23	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:34:00	15
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:34:29	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:34:25	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:33:57	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:40:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:40:59	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:34:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:43:00	24
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:48	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:42:00	14
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:43:30	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:02	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:05	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:43:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:42:28	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:13	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:44	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:42:29	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:14	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:43:34	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:42:27	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:41:00	55
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:41:56	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:43:31	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:23	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:45:57	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:45:56	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:31	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:45:59	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:32	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:33	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:34	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:37	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:35	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:24	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:45:58	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:35	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:46	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:48:42	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:46:00	36
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:51	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:25	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:34	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:26	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:49:16	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:27	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:47:05	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:54:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:54:23	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:49:00	12
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:49:17	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:45:00	20
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:48:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:47	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:48:00	21
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:48:54	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:47:00	19
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:43	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:47:17	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:49:15	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:18	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:47:02	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:49:14	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:09	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:30	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:48:40	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:42	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:46	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:47:16	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:46:24	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:39	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:48:53	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:20	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:43	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:57:00	152
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:31	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:23	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:37	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:44	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:28	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:33	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:47	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:36	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:32	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:29	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:36	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:38	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:50	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:40	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:45	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:48	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:49	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:33	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:30	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:32	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:38	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:58:00	146
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:36	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:39	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:38	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:49	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:52	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:43	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:47	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:57:51	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:50	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:48	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:39	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:04:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:10	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:46	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:42	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:40	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:57	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:37	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:44	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:46	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:55	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:07:00	16
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:06:18	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:53	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:51	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:02:56	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:49	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:34	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:11	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:03:00	33
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:47	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:45	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:45	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:02:00	20
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:12	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:35	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:43	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:02:59	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:04:51	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:56	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:11	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:54	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:00:00	109
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:39	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:42	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:58:58	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 20:59:00	140
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-10 20:00:00	716
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:02:57	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:05	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:44	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:48	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:07:35	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:45	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:06:39	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:06:00	26
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:59	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:07:53	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:13	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:06:19	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:06:20	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:38	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:18	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:56	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:51	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:40	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:54	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:57	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:10:00	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:10:38	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:24	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:55	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:34	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:09	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:13	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:19	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:30	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:25	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:14	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:45	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:36	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:20	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:35	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:26	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:15	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:31	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:21	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:09:00	71
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:05:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:02:58	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:16	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:05:16	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:27	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:44	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:22	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:40	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:06:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:17	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:32	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:36	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:11	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:23	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:58	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:28	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:18	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:33	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:08:00	46
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:08	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 20:59:29	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:08:58	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:46	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:50	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:00:43	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:03:01	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:07:39	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:11:07	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:11:08	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:10	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:48	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:10:00	21
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:10:01	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:49	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:10:39	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:09:52	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:11:00	23
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:10:05	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:11:11	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:11:12	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:11:14	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	day	2016-08-10 00:00:00	1097
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-10 21:12:00	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-10 21:12:51	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-10 21:00:00	381
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 14:32:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 14:32:49	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-11 14:00:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 15:42:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	minute	2016-08-11 14:50:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	second	2016-08-11 14:50:30	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	hour	2016-08-11 14:00:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	day	2016-08-11 00:00:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	minute	2016-08-11 15:01:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	second	2016-08-11 15:01:42	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	hour	2016-08-11 15:00:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	month	2016-08-01 00:00:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	e4a8519a-7869-44c3-b817-39db61f6d166	year	2016-01-01 00:00:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 15:32:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 15:32:22	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 15:38:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 15:38:20	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 15:42:13	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 15:38:18	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-11 15:00:00	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 17:22:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 17:22:13	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-11 17:00:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 19:57:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 19:57:59	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-11 19:00:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 20:00:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 20:00:57	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:18:27	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 20:05:36	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:48	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:16:00	23
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 20:05:00	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 20:05:43	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:16:55	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:39	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 20:27:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 20:27:21	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-11 20:00:00	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:16:51	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:03:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:03:45	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:29:00	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:05:00	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:05:44	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:16:45	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:16:54	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:52	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:16:53	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:17:00	29
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:12:06	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:43	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:12:00	14
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:12:13	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:40	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:18:23	4
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:07:00	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:07:41	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:29:01	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:18:22	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:49	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:35	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:41	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:28	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:12:07	3
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:12	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:58	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:18:25	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:09	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	day	2016-08-11 00:00:00	161
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:17:42	1
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:46	2
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:18:00	15
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:55	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:29:00	28
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:29:23	8
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	hour	2016-08-11 21:00:00	150
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	month	2016-08-01 00:00:00	1258
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:29:05	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	minute	2016-08-11 21:28:00	34
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:28:59	5
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	second	2016-08-11 21:29:22	6
6b6e07fb-7040-417f-90e1-353cf3a70d1d	633cc788-2568-4254-84d8-2871cad8efff	year	2016-01-01 00:00:00	1278
\.


--
-- Data for Name: response_ratelimiting_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY response_ratelimiting_metrics (api_id, identifier, period, period_date, value) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY schema_migrations (id, migrations) FROM stdin;
core	{2015-01-12-175310_skeleton,2015-01-12-175310_init_schema,2015-11-23-817313_nodes,2016-02-29-142793_ttls}
key-auth	{2015-07-31-172400_init_keyauth}
galileo	{2016-04-15_galileo-import-mashape-analytics}
acl	{2015-08-25-841841_init_acl}
ip-restriction	{2016-05-24-remove-cache}
oauth2	{2015-08-03-132400_init_oauth2}
rate-limiting	{2015-08-03-132400_init_ratelimiting}
jwt	{2015-06-09-jwt-auth,2016-03-07-jwt-alg}
basic-auth	{2015-08-03-132400_init_basicauth}
response-ratelimiting	{2015-08-03-132400_init_response_ratelimiting}
hmac-auth	{2015-09-16-132400_init_hmacauth}
\.


--
-- Data for Name: ttls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY ttls (primary_key_value, primary_uuid_value, table_name, primary_key_name, expire_at) FROM stdin;
odinPreProduccion_0.0.0.0:7946_3912383a9ced42219ab94a5e0dfd2ceb	\N	nodes	name	2016-09-13 18:43:49
\.


--
-- Name: acls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY acls
    ADD CONSTRAINT acls_pkey PRIMARY KEY (id);


--
-- Name: apis_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY apis
    ADD CONSTRAINT apis_name_key UNIQUE (name);


--
-- Name: apis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY apis
    ADD CONSTRAINT apis_pkey PRIMARY KEY (id);


--
-- Name: apis_request_host_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY apis
    ADD CONSTRAINT apis_request_host_key UNIQUE (request_host);


--
-- Name: apis_request_path_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY apis
    ADD CONSTRAINT apis_request_path_key UNIQUE (request_path);


--
-- Name: basicauth_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY basicauth_credentials
    ADD CONSTRAINT basicauth_credentials_pkey PRIMARY KEY (id);


--
-- Name: consumers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY consumers
    ADD CONSTRAINT consumers_pkey PRIMARY KEY (id);


--
-- Name: consumers_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY consumers
    ADD CONSTRAINT consumers_username_key UNIQUE (username);


--
-- Name: hmacauth_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY hmacauth_credentials
    ADD CONSTRAINT hmacauth_credentials_pkey PRIMARY KEY (id);


--
-- Name: hmacauth_credentials_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY hmacauth_credentials
    ADD CONSTRAINT hmacauth_credentials_username_key UNIQUE (username);


--
-- Name: jwt_secrets_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY jwt_secrets
    ADD CONSTRAINT jwt_secrets_key_key UNIQUE (key);


--
-- Name: jwt_secrets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY jwt_secrets
    ADD CONSTRAINT jwt_secrets_pkey PRIMARY KEY (id);


--
-- Name: jwt_secrets_secret_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY jwt_secrets
    ADD CONSTRAINT jwt_secrets_secret_key UNIQUE (secret);


--
-- Name: keyauth_credentials_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY keyauth_credentials
    ADD CONSTRAINT keyauth_credentials_key_key UNIQUE (key);


--
-- Name: keyauth_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY keyauth_credentials
    ADD CONSTRAINT keyauth_credentials_pkey PRIMARY KEY (id);


--
-- Name: nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (name);


--
-- Name: oauth2_authorization_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_authorization_codes
    ADD CONSTRAINT oauth2_authorization_codes_code_key UNIQUE (code);


--
-- Name: oauth2_authorization_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_authorization_codes
    ADD CONSTRAINT oauth2_authorization_codes_pkey PRIMARY KEY (id);


--
-- Name: oauth2_credentials_client_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_credentials
    ADD CONSTRAINT oauth2_credentials_client_id_key UNIQUE (client_id);


--
-- Name: oauth2_credentials_client_secret_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_credentials
    ADD CONSTRAINT oauth2_credentials_client_secret_key UNIQUE (client_secret);


--
-- Name: oauth2_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_credentials
    ADD CONSTRAINT oauth2_credentials_pkey PRIMARY KEY (id);


--
-- Name: oauth2_tokens_access_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_tokens
    ADD CONSTRAINT oauth2_tokens_access_token_key UNIQUE (access_token);


--
-- Name: oauth2_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_tokens
    ADD CONSTRAINT oauth2_tokens_pkey PRIMARY KEY (id);


--
-- Name: oauth2_tokens_refresh_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_tokens
    ADD CONSTRAINT oauth2_tokens_refresh_token_key UNIQUE (refresh_token);


--
-- Name: plugins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY plugins
    ADD CONSTRAINT plugins_pkey PRIMARY KEY (id, name);


--
-- Name: ratelimiting_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ratelimiting_metrics
    ADD CONSTRAINT ratelimiting_metrics_pkey PRIMARY KEY (api_id, identifier, period_date, period);


--
-- Name: response_ratelimiting_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY response_ratelimiting_metrics
    ADD CONSTRAINT response_ratelimiting_metrics_pkey PRIMARY KEY (api_id, identifier, period_date, period);


--
-- Name: schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (id);


--
-- Name: ttls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ttls
    ADD CONSTRAINT ttls_pkey PRIMARY KEY (primary_key_value, table_name);


--
-- Name: acls_consumer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX acls_consumer_id ON acls USING btree (consumer_id);


--
-- Name: acls_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX acls_group ON acls USING btree ("group");


--
-- Name: apis_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX apis_name_idx ON apis USING btree (name);


--
-- Name: apis_request_host_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX apis_request_host_idx ON apis USING btree (request_host);


--
-- Name: apis_request_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX apis_request_path_idx ON apis USING btree (request_path);


--
-- Name: basicauth_consumer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX basicauth_consumer_id_idx ON basicauth_credentials USING btree (consumer_id);


--
-- Name: basicauth_username_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX basicauth_username_idx ON basicauth_credentials USING btree (username);


--
-- Name: custom_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX custom_id_idx ON consumers USING btree (custom_id);


--
-- Name: hmacauth_credentials_consumer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX hmacauth_credentials_consumer_id ON hmacauth_credentials USING btree (consumer_id);


--
-- Name: hmacauth_credentials_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX hmacauth_credentials_username ON hmacauth_credentials USING btree (username);


--
-- Name: jwt_secrets_consumer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jwt_secrets_consumer_id ON jwt_secrets USING btree (consumer_id);


--
-- Name: jwt_secrets_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jwt_secrets_key ON jwt_secrets USING btree (key);


--
-- Name: jwt_secrets_secret; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jwt_secrets_secret ON jwt_secrets USING btree (secret);


--
-- Name: keyauth_consumer_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX keyauth_consumer_idx ON keyauth_credentials USING btree (consumer_id);


--
-- Name: keyauth_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX keyauth_key_idx ON keyauth_credentials USING btree (key);


--
-- Name: nodes_cluster_listening_address_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nodes_cluster_listening_address_idx ON nodes USING btree (cluster_listening_address);


--
-- Name: oauth2_accesstoken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_accesstoken_idx ON oauth2_tokens USING btree (access_token);


--
-- Name: oauth2_authorization_userid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_authorization_userid_idx ON oauth2_authorization_codes USING btree (authenticated_userid);


--
-- Name: oauth2_autorization_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_autorization_code_idx ON oauth2_authorization_codes USING btree (code);


--
-- Name: oauth2_credentials_client_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_credentials_client_idx ON oauth2_credentials USING btree (client_id);


--
-- Name: oauth2_credentials_consumer_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_credentials_consumer_idx ON oauth2_credentials USING btree (consumer_id);


--
-- Name: oauth2_credentials_secret_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_credentials_secret_idx ON oauth2_credentials USING btree (client_secret);


--
-- Name: oauth2_token_refresh_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_token_refresh_idx ON oauth2_tokens USING btree (refresh_token);


--
-- Name: oauth2_token_userid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX oauth2_token_userid_idx ON oauth2_tokens USING btree (authenticated_userid);


--
-- Name: plugins_api_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX plugins_api_idx ON plugins USING btree (api_id);


--
-- Name: plugins_consumer_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX plugins_consumer_idx ON plugins USING btree (consumer_id);


--
-- Name: plugins_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX plugins_name_idx ON plugins USING btree (name);


--
-- Name: username_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX username_idx ON consumers USING btree (lower(username));


--
-- Name: acls_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY acls
    ADD CONSTRAINT acls_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: basicauth_credentials_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY basicauth_credentials
    ADD CONSTRAINT basicauth_credentials_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: hmacauth_credentials_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY hmacauth_credentials
    ADD CONSTRAINT hmacauth_credentials_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: jwt_secrets_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY jwt_secrets
    ADD CONSTRAINT jwt_secrets_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: keyauth_credentials_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY keyauth_credentials
    ADD CONSTRAINT keyauth_credentials_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: oauth2_credentials_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_credentials
    ADD CONSTRAINT oauth2_credentials_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: oauth2_tokens_credential_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY oauth2_tokens
    ADD CONSTRAINT oauth2_tokens_credential_id_fkey FOREIGN KEY (credential_id) REFERENCES oauth2_credentials(id) ON DELETE CASCADE;


--
-- Name: plugins_api_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY plugins
    ADD CONSTRAINT plugins_api_id_fkey FOREIGN KEY (api_id) REFERENCES apis(id) ON DELETE CASCADE;


--
-- Name: plugins_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY plugins
    ADD CONSTRAINT plugins_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

