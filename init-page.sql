BEGIN;

DROP TABLE IF EXISTS public.page_metadata CASCADE;
DROP TABLE IF EXISTS public.page_model CASCADE;
DROP SEQUENCE IF EXISTS public.page_model_id_seq;
DROP SEQUENCE IF EXISTS public.page_metadata_id_seq;

CREATE TABLE public.page_model (
    id bigint NOT NULL,
    com_tree json NOT NULL,
    aspect_ratio varchar(20) NOT NULL DEFAULT '16/9',
    com_count integer NOT NULL DEFAULT 0,
    CONSTRAINT page_model_pkey PRIMARY KEY (id)
);

CREATE SEQUENCE public.page_model_id_seq 
    START WITH 1 
    INCREMENT BY 1
    OWNED BY public.page_model.id;

ALTER TABLE public.page_model 
ALTER COLUMN id SET DEFAULT nextval('public.page_model_id_seq'::regclass);

CREATE TABLE public.page_metadata (
    id bigint NOT NULL,
    model_id bigint NOT NULL,  
    title character varying(255) NOT NULL,  
    description text NOT NULL,  
    keywords text[] NOT NULL DEFAULT '{}',  
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,  
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,  
    CONSTRAINT page_metadata_pkey PRIMARY KEY (id),
    CONSTRAINT fk_page_metadata_page_model FOREIGN KEY (model_id)
        REFERENCES public.page_model (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uk_page_metadata_title UNIQUE (title),
    CONSTRAINT uk_page_metadata_model_id UNIQUE (model_id)
);

CREATE SEQUENCE public.page_metadata_id_seq 
    START WITH 1 
    INCREMENT BY 1
    OWNED BY public.page_metadata.id;

ALTER TABLE public.page_metadata 
ALTER COLUMN id SET DEFAULT nextval('public.page_metadata_id_seq'::regclass);

COMMIT;